import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendState, Prisma } from '@prisma/client';
import {
  FriendQueryDTO,
  FriendShipAction,
  FriendShipActionDTO,
  FriendStateQuery,
} from './friends.dto';
import { buildPagination } from '@/global/global.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendNotificationPayload } from '@/ws/chat/chat.interface';
import { friendChecking, swapUsers } from './friends.helpers';

@Injectable()
export class FriendService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  private async friendChecking(userId: string, friendId: string) {
    return (await friendChecking.bind(this)(userId, friendId)) as ReturnType<
      typeof friendChecking
    >;
  }

  private getFriendsWhere(userId: string, state: FriendStateQuery) {
    const owner =
      !state || ['BLOCKED', 'REQUESTED', 'ACCEPTED'].includes(state);
    const reciever = !state || !owner || state === 'ACCEPTED';

    if (state === 'REQUESTED') state = FriendStateQuery.PENDING;

    let side: unknown = owner ? { userId } : { friendId: userId };
    if (owner && reciever) {
      side = {
        OR: [{ userId }, { friendId: userId }],
      };
    }

    const where: unknown = { AND: [side, { state }] };

    if (!state) {
      where['NOT'] = {
        OR: [
          { AND: [{ friendId: userId }, { state: FriendState.BLOCKED }] },
          { state: FriendState.NONE },
        ],
      };
    }

    return where;
  }

  async getUserFriends(userId: string, query: FriendQueryDTO) {
    const where = this.getFriendsWhere(userId, query.state);
    const select = {
      displayname: true,
      login: true,
      id: true,
      avatar: true,
    } satisfies Prisma.UserSelect;

    const [totalCount, users] = await this.prismaService.$transaction([
      this.prismaService.friend.count({ where }),
      this.prismaService.friend.findMany({
        where,
        skip: query.getSkip(),
        take: query.limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: { select },
          friend: { select },
        },
      }),
    ]);

    return buildPagination(
      users.map((friendShip) => ({
        state: friendShip.state,
        ...(userId === friendShip.user.id
          ? friendShip.friend
          : friendShip.user),
      })),
      query.limit,
      totalCount,
    );
  }

  async getUserFriendShip(userId: string, friendId: string) {
    const { friendShip } = await this.friendChecking(userId, friendId);
    if (!friendShip) throw new NotFoundException();
    return { ...friendShip, isOwner: userId === friendShip.userId };
  }

  async sendFriendRequest(userId: string, friendId: string) {
    const { friendShip, friendId: _friendId } = await this.friendChecking(
      userId,
      friendId,
    );
    if (userId === _friendId) throw new ConflictException();
    if (friendShip && friendShip.state !== 'NONE')
      throw new ForbiddenException();

    const newFriendShip = await this.prismaService.friend.upsert({
      where: { id: friendShip?.id || '' },
      create: {
        userId,
        friendId: _friendId,
        state: 'PENDING',
      },
      update: {
        state: 'PENDING',
        ...swapUsers(userId, _friendId),
      },
    });

    const { sender, receiver } = await this.prismaService.notification.create({
      data: {
        type: 'FRIEND_REQUEST',
        senderId: userId,
        receiverId: _friendId,
        content: {}, // ?INFO: add some details
      },
      include: {
        receiver: true,
        sender: true,
      },
    });

    this.eventEmitter.emit('chat.send-notification', {
      sender,
      receiver,
      type: 'FRIEND_REQUEST',
    } satisfies SendNotificationPayload);

    return newFriendShip;
  }

  async updateFriendShip(
    userId: string,
    friendId: string,
    friendShipAction: FriendShipActionDTO,
  ) {
    const { friendShip, friendId: _friendId } = await this.friendChecking(
      userId,
      friendId,
    );

    if (userId === _friendId) throw new ConflictException();

    if (!friendShip) throw new ForbiddenException();

    const oldFriendStatus: Record<FriendShipAction, FriendState> = {
      [FriendShipAction.CANCEL]: 'PENDING',
      [FriendShipAction.ACCEPT]: 'PENDING',
      [FriendShipAction.UNBLOCK]: 'BLOCKED',
      [FriendShipAction.UNFRIEND]: 'ACCEPTED',
    };
    const newFriendStatus: Record<FriendShipAction, FriendState> = {
      [FriendShipAction.CANCEL]: 'NONE',
      [FriendShipAction.ACCEPT]: 'ACCEPTED',
      [FriendShipAction.UNBLOCK]: 'NONE',
      [FriendShipAction.UNFRIEND]: 'NONE',
    };

    const { action } = friendShipAction;

    const isOwner = userId === friendShip.userId;

    if ((action === 'ACCEPT' && isOwner) || (action === 'UNBLOCK' && !isOwner))
      throw new ForbiddenException();

    try {
      const updatedFriendShip = await this.prismaService.friend.update({
        where: {
          id: friendShip.id,
          state: oldFriendStatus[action],
        },
        data: {
          state: newFriendStatus[action],
          ...swapUsers(userId, _friendId), // just in case friendId used as login !
        },
      });

      if (
        friendShip.state === 'PENDING' &&
        updatedFriendShip.state === 'ACCEPTED'
      ) {
        const { sender, receiver } =
          await this.prismaService.notification.create({
            data: {
              type: 'FRIEND_ACCEPT',
              senderId: userId,
              receiverId: _friendId,
              content: {}, // ?INFO: add some details
            },
            include: {
              receiver: true,
              sender: true,
            },
          });

        this.eventEmitter.emit('chat.send-notification', {
          sender,
          receiver,
          type: 'FRIEND_ACCEPT',
        } satisfies SendNotificationPayload);
      }

      return updatedFriendShip;
    } catch {
      throw new ForbiddenException();
    }
  }

  async blockFriend(userId: string, friendId: string) {
    const { friendShip, friendId: _friendId } = await this.friendChecking(
      userId,
      friendId,
    );
    if (userId === _friendId) throw new ConflictException();
    if (!friendShip) throw new NotFoundException();

    try {
      return await this.prismaService.friend.update({
        where: {
          id: friendShip.id,
          NOT: {
            state: 'BLOCKED',
          },
        },
        data: {
          state: 'BLOCKED',
          ...swapUsers(userId, _friendId),
        },
      });
    } catch (err) {
      return friendShip;
    }
  }
}
