import { Injectable, Res, Req, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  
  async findOne(@Req() req: Request, id: string) {
	 const user = await this.prismaService.user.findFirst({
	   where: {
	     OR: [
	       { id: id },
	       { id, },
        ],
      },
    });
    if (!user) throw new NotFoundException();
    return (user);	 
  }
}
