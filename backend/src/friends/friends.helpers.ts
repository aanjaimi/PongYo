import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Friend, Prisma } from '@prisma/client';
import { FriendShipStatus } from './friends.interface';

const loginOrId = (id: string): Prisma.UserWhereInput => {
  return {
    OR: [
      {
        id,
      },
      {
        login: id,
      },
    ],
  };
};

export const swapUsers = (
  userId: string,
  friendId: string,
): Pick<Prisma.FriendUpdateArgs, 'data'>['data'] => {
  return {
    userId,
    friendId,
  };
};

export const getFriendShipStatus = (
  userId: string,
  friendShip: Friend,
): FriendShipStatus => {
  if (!friendShip || friendShip.state === 'NONE') return 'NONE';

  const userSide = userId === friendShip.userId;

  switch (friendShip.state) {
    case 'BLOCKED':
      return userSide ? 'BLOCKED_BY_USER' : 'BLOCKED_BY_FRIEND';
    case 'PENDING':
      return userSide ? 'PENDING_BY_USER' : 'PENDING_BY_FRIEND';
  }
  return friendShip.state;
};
export async function friendChecking(
  userId: string,
  friendId: string,
  prisma?: PrismaService, // ? this in case u wanna use it from outside the service
) {
  if (!prisma) prisma = this.prismaService;
  const friend = await prisma.user.findFirst({
    where: { ...loginOrId(friendId) },
    include: { stat: true, achievement: true, userGameHistory: true },
  });
  if (!friend) throw new NotFoundException();

  friendId = friend.id;

  // Retrieve the friendship status between the current user and their friend

  const friendShip = await prisma.friend.findFirst({
    where: {
      OR: [
        // friendShip form myside
        {
          user: { ...loginOrId(userId) },
          friend: { ...loginOrId(friendId) },
        },
        // friendShip from their side
        {
          user: { ...loginOrId(friendId) },
          friend: { ...loginOrId(userId) },
        },
      ],
    },
  });
  const friendShipStatus = getFriendShipStatus(userId, friendShip);
  if (friendShipStatus === 'BLOCKED_BY_FRIEND') throw new ForbiddenException();

  return { friendShip, friend, friendId };
}
