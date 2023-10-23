import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortyTwoGuard extends AuthGuard('42') {
  handleRequest(err: unknown, user: unknown): any {
    console.log('42Guard');
    console.log(user);
    console.log('42Guard');
    console.log(err);
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
