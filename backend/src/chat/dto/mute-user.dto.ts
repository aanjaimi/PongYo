import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class MuteUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDate()
  @IsNotEmpty()
  until: Date;
}
