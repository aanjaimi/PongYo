import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsOptional()
  password: string;
}
