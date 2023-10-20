import {
  // acceptFriendRequest,
  getAvailableUsers,
  // sendFriendRequest,
} from './friends';
// import { User } from '@prisma/client';
import users from '../data/users.json';
// import users_friends from '../data/users_friends.json';

async function main() {
  // seed users  for testing

  await getAvailableUsers(users);
  // const availableUsers =
  // const dp = availableUsers.reduce((accumulator, user) => {
  //   accumulator[user.login] = user;
  //   return accumulator;
  // }, new Map<string, User>());

  // for (const user of availableUsers) {
  //   const { login } = user;
  //   const requests = users_friends[login].requests;
  //   // send requests to user
  //   for (const other of requests) await sendFriendRequest(dp[login], dp[other]);
  // }
  // for (const user of availableUsers) {
  //   const { login } = user;
  //   const accepts = users_friends[login].accepts;
  //   // accept friend request from user
  //   for (const other of accepts)
  //     await acceptFriendRequest(dp[login], dp[other]);
  // }

  // TODO: add seeding for game and chat !
}

main()
  .then(() => void {})
  .catch(console.error);
