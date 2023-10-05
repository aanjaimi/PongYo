import { IsNotEmpty, IsString } from 'class-validator';

export class LeaveChannelDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;
}
