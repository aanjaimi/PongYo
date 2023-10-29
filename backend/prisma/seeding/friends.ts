import { User } from '@prisma/client';
import prisma from '../utils/db';

type _User = Pick<User, 'displayname' | 'login' | 'email'> & {
  profileUrl: string;
};

export const getAvailableUsers = (users: _User[]) =>
  prisma.$transaction(
    users.map(({ displayname, email, login, profileUrl }) =>
      prisma.user.upsert({
        where: {
          login,
        },
        create: {
          displayname,
          email,
          login,
          avatar: {
            minio: false,
            path: profileUrl,
          },
          totp: { enabled: false },
          stat: {
            create: {
              defeats: 0,
              points: 0,
              rank: 'UNRANKED',
              vectories: 0,
              rowVectories: 0,
            },
          },
        },
        update: {},
      }),
    ),
  );

export const sendFriendRequest = async (user: User, friend: User) => {
  const [{ id: userId }, { id: friendId }] = [user, friend];
  const friendShip = await prisma.friend.findFirst({
    where: {
      OR: [
        { AND: [{ userId }, { friendId }] },
        { AND: [{ friendId: userId }, { userId: friendId }] },
      ],
    },
  });
  console.log(
    `The user ${user.login} sent a friend request to user ${friend.login}`,
  );
  if (!friendShip) {
    return await prisma.friend.create({
      data: {
        userId,
        friendId,
        state: 'PENDING',
      },
    });
  }

  return friendShip;
};

export const acceptFriendRequest = async (user: User, friend: User) => {
  const friendShip = await prisma.friend.findFirst({
    where: {
      userId: friend.id,
      friendId: user.id,
    },
  });
  if (!friendShip) return;

  console.log(
    `The user ${user.login} accepts friend request of user ${friend.login}`,
  );

  return await prisma.friend.update({
    where: { id: friendShip.id },
    data: {
      state: 'ACCEPTED',
    },
  });
};
