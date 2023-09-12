import { Injectable, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}
  
  validateUser(@Req() req: Request, @Res() res: Response) {
	  res.send(req.user);
  }
}
