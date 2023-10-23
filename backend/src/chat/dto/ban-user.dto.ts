import { IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}