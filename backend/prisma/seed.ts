import { PrismaClient } from '@prisma/client';
import { users, channels, messages } from './seedData';

const prisma = new PrismaClient();

async function main() {
  for (const user of users) {
    if (await prisma.user.findUnique({ where: { login: user.login } })) {
      continue;
    }
    await prisma.user.create({
      data: user,
    });
  }

  for (const channel of channels) {
    if (await prisma.channel.findUnique({ where: { name: channel.name } })) {
      continue;
    }
    await prisma.channel.create({
      data: channel,
    });
  }

  for (const message of messages) {
    if (
      await prisma.message.findFirst({ where: { content: message.content } })
    ) {
      continue;
    }
    await prisma.message.create({
      data: message,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
