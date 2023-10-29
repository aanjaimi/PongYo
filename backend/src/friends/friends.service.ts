import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendState, NotifType, Prisma } from '@prisma/client';
import {
  FriendQueryDTO,
  FriendShipAction,
  FriendShipActionDTO,
  FriendStateQuery,
} from './friends.dto';
import { buildPagination } from '@/global/global.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendNotificationPayload } from '@/ws/notifications/notification.interface';
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

  private async createNewNotification(
    senderId: string,
    receiverId: string,
    type: NotifType,
  ) {
    return await this.prismaService.notification.create({
      data: {
        type,
        senderId,
        receiverId,
        content: {}, // ?INFO: add some details
      },
    });
  }

  private async deleteOldNotifications(
    senderId: string,
    receiverId: string,
    type: NotifType,
  ) {
    await this.prismaService.notification.deleteMany({
      where: {
        senderId,
        receiverId,
        type,
      },
    });
  }

  async getUserFriends(userId: string, query: FriendQueryDTO) {
    const where = this.getFriendsWhere(userId, query.state);
    const select = {
      displayname: true,
      login: true,
      id: true,
      avatar: true,
      userStatus: true,
    } satisfies Prisma.UserSelect;

    const users = await this.prismaService.friend.findMany({
      where,
      skip: query.getSkip(),
      take: query.limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        user: { select },
        friend: { select },
      },
    });

    return buildPagination(
      users.map((friendShip) => ({
        state: friendShip.state,
        ...(userId === friendShip.user.id
          ? friendShip.friend
          : friendShip.user),
      })),
      query.limit,
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

    // delete all old friend request notifcations
    await this.deleteOldNotifications(userId, _friendId, 'FRIEND_REQUEST');
    await this.createNewNotification(userId, _friendId, 'FRIEND_REQUEST');

    this.eventEmitter.emit('notification.send-notification', {
      senderId: userId,
      receiverId: _friendId,
      type: 'IGNORE',
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
        // remove all old friend accept notifcations
        await this.deleteOldNotifications(userId, _friendId, 'FRIEND_ACCEPT');
        await this.createNewNotification(userId, _friendId, 'FRIEND_ACCEPT');
      }

      this.eventEmitter.emit('notification.send-notification', {
        senderId: userId,
        receiverId: _friendId,
        type: 'IGNORE',
      } satisfies SendNotificationPayload);

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

    // you already blocked this user before
    if (friendShip && friendShip.state === 'BLOCKED') {
      throw new ConflictException();
    }

    const nextfriendShip = await this.prismaService.friend.upsert({
      where: {
        id: friendShip?.id ?? '',
      },
      update: {
        state: 'BLOCKED',
        ...swapUsers(userId, _friendId),
      },
      create: {
        state: 'BLOCKED',
        userId,
        friendId: _friendId,
      },
    });
    this.eventEmitter.emit('notification.send-notification', {
      senderId: userId,
      receiverId: _friendId,
      type: 'BLOCKED',
    } satisfies SendNotificationPayload);
    return nextfriendShip;
  }
}
