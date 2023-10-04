import { RoomType } from '@prisma/client';

export const users = [
  {
    id: '1',
    displayName: '4der',
    login: 'moulmado',
    email: 'x@g.co',
  },
  {
    id: '2',
    displayName: 'somo',
    login: 'aanjaimi',
    email: 'xx@g.co',
  },
  {
    id: '3',
    displayName: 'said',
    login: 'smazouz',
    email: 'xxx@g.co',
  },
  {
    id: '4',
    displayName: 'awbx',
    login: 'asabani',
    email: 'xxxx@g.co',
  },
  {
    id: '5',
    displayName: 'ra1nMak3r',
    login: 'omoussao',
    email: 'xxxxx@g.co',
  },
];

export const channels = [
  {
    id: '1',
    type: RoomType.PUBLIC,
    name: 'general',
    isDM: false,
    owner: {
      connect: {
        id: '1',
      },
    },
    members: {
      connect: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    },
  },
  {
    id: '2',
    type: RoomType.PUBLIC,
    name: 'random',
    isDM: false,
    owner: {
      connect: {
        id: '1',
      },
    },
    members: {
      connect: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    },
  },
  {
    id: '3',
    type: RoomType.PUBLIC,
    name: 'forStudents',
    isDM: false,
    owner: {
      connect: {
        id: '1',
      },
    },
    members: {
      connect: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    },
  },
  {
    id: '4',
    type: RoomType.PUBLIC,
    name: 'forDevs',
    isDM: false,
    owner: {
      connect: {
        id: '1',
      },
    },
    members: {
      connect: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    },
  },
  {
    id: '5',
    type: RoomType.PUBLIC,
    name: 'forStaff',
    isDM: false,
    owner: {
      connect: {
        id: '1',
      },
    },
    members: {
      connect: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    },
  },
  {
    id: '6',
    type: RoomType.PUBLIC,
    name: 'food',
    isDM: false,
    owner: {
      connect: {
        id: '1',
      },
    },
    members: {
      connect: [
        { id: '1' },
        { id: '2' },
        { id: '3' },
        { id: '4' },
        { id: '5' },
      ],
    },
  },
];

export const messages = [
  //channel 1
  {
    content: 'message 1',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '1',
      },
    },
  },
  {
    content: 'message 2',
    user: {
      connect: {
        id: '2',
      },
    },
    channel: {
      connect: {
        id: '1',
      },
    },
  },
  {
    content: 'message 3',
    user: {
      connect: {
        id: '3',
      },
    },
    channel: {
      connect: {
        id: '1',
      },
    },
  },
  {
    content: 'message 4',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '1',
      },
    },
  },
  {
    content: 'message 5',
    user: {
      connect: {
        id: '3',
      },
    },
    channel: {
      connect: {
        id: '1',
      },
    },
  },
  {
    content: 'message 6',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '1',
      },
    },
  },
  // channel 2
  {
    content: 'message 1`',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '2',
      },
    },
  },
  {
    content: 'message 2`',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '2',
      },
    },
  },
  {
    content: 'message 3`',
    user: {
      connect: {
        id: '3',
      },
    },
    channel: {
      connect: {
        id: '2',
      },
    },
  },
  {
    content: 'message 4`',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '2',
      },
    },
  },
  // channel 3\
  {
    content:
      'lorem hamid lazy to search for it so i will just write some random shit and duplicate it xD. lorem hamid lazy to search for it so i will just write some random shit and duplicate it xD.',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '3',
      },
    },
  },
  {
    content:
      'lorem hamid lazy to search for it so i will just write some random shit and duplicate it xD. lorem hamid lazy to search for it so i will just write some random shit and duplicate it xD. ',
    user: {
      connect: {
        id: '1',
      },
    },
    channel: {
      connect: {
        id: '3',
      },
    },
  },
];
