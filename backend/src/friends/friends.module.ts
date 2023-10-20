import { Module } from '@nestjs/common';
import { FriendService } from './friends.service';
import { FriendController } from './friends.controller';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
