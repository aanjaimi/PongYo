import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MuteUserDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
