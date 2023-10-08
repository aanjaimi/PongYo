// friends.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prismaService: PrismaService) {}

  async searchFriendsByUsername(username: string) {
    return this.prismaService.user.findUnique({
			select: {
				id: true,
				login: true,
				displayname: true,
				friends: {
					select: {
						id: true,
						user: true,
					},
				},
			},
			where: {
				login: username,
			},
		});
  }
}
