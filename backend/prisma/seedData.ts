// import { Mode } from '@prisma/client';

// enum UserStatus {
//   ONLINE,
//   OFFLINE,
//   IN_GAME,
// }

// enum Rank {
//   UNRANKED,
//   BRONZE,
//   SILVER,
//   GOLD,
//   PLATINUM,
//   EMERALD,
//   DIAMOND,
//   MASTER,
//   GRANDMASTER,
//   LEGEND,
//   CHAMPION,
// }

// export const achievements = [];
// export const users = [];
// export const games = [];

// achievements.push(
//   {
//     id: '1',
//     name: 'First win',
//     description: 'Win your first game',
//     icon: '/achievements/1.png',
//     userId: '1',
//     user: users[0],
//   },
//   {
//     id: '2',
//     name: '10 win',
//     description: 'Win 10 games',
//     icon: '/achievements/2.png',
//   },
//   {
//     id: '3',
//     name: '50 win',
//     description: 'Win 50 games',
//     icon: '/achievements/3.png',
//   },
//   {
//     id: '4',
//     name: '100 win',
//     description: 'Win 100 games',
//     icon: '/achievements/4.png',
//   },
// );

// users.push(
//   {
//     id: '1',
//     displayname: '4der',
//     login: 'moulmado',
//     email: 'x@g.co',
//     // userStatus: UserStatus.OFFLINE,
//     vectories: 0,
//     defeats: 0,
//     points: 0,
//     // rank: Rank.UNRANKED,
//     achievements: achievements,
//   },
//   {
//     id: '2',
//     displayname: 'somo',
//     login: 'aanjaimi',
//     email: 'xx@g.co',
//     // userStatus: UserStatus.OFFLINE,
//     vectories: 0,
//     defeats: 0,
//     points: 0,
//     // rank: Rank.UNRANKED,
//     achievements: achievements,
//   },
//   {
//     id: '3',
//     displayname: 'said',
//     login: 'smazouz',
//     email: 'xxx@g.co',
//     // userStatus: UserStatus.OFFLINE,
//     vectories: 0,
//     defeats: 0,
//     points: 0,
//     // rank: Rank.UNRANKED,
//     achievements: achievements,
//   },
//   {
//     id: '4',
//     displayname: 'awbx',
//     login: 'asabani',
//     email: 'xxxx@g.co',
//     // userStatus: UserStatus.OFFLINE,
//     vectories: 0,
//     defeats: 0,
//     points: 0,
//     // rank: Rank.UNRANKED,
//     achievements: achievements,
//   },
//   {
//     id: '5',
//     displayname: 'ra1nMak3r',
//     login: 'omoussao',
//     email: 'xxxxx@g.co',
//     // userStatus: UserStatus.OFFLINE,
//     vectories: 0,
//     defeats: 0,
//     points: 0,
//     // rank: Rank.UNRANKED,
//     achievements: achievements,
//   },
// );

// games.push(
//   {
//     mode: Mode.RANKED,
//     oppositeScore: 0,
//     opponentScore: 0,
//     opponent: users[0],
//     opponetId: users[0].id,
//     opposite: users[1],
//     oppositeId: users[1].id,
//   },
//   {
//     mode: Mode.RANKED,
//     oppositeScore: 0,
//     opponentScore: 0,
//     opponent: users[1],
//     opponetId: users[1].id,
//     opposite: users[2],
//     oppositeId: users[2].id,
//   },
//   {
//     mode: Mode.RANKED,
//     oppositeScore: 0,
//     opponentScore: 0,
//     opponent: users[2],
//     opponetId: users[2].id,
//     opposite: users[3],
//     oppositeId: users[3].id,
//   },
//   {
//     mode: Mode.RANKED,
//     oppositeScore: 0,
//     opponentScore: 0,
//     opponent: users[3],
//     opponetId: users[3].id,
//     opposite: users[4],
//     oppositeId: users[4].id,
//   },
// );

// export const achievements = [
//   {
//     id: '1',
//     name: 'First win',
//     description: 'Win your first game',
//     icon: '/achievements/1.png',
//     userId: '1',
//   },
//   {
//     id: '2',
//     name: '10 wins',
//     description: 'Win 10 games',
//     icon: '/achievements/2.png',
//     userId: '2',
//   },
//   {
//     id: '3',
//     name: '50 wins',
//     description: 'Win 50 games',
//     icon: '/achievements/3.png',
//     userId: '3',
//   },
//   {
//     id: '4',
//     name: '100 wins',
//     description: 'Win 100 games',
//     icon: '/achievements/4.png',
//     userId: '4',
//   },
// ];
