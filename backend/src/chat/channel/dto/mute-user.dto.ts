import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MuteUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
