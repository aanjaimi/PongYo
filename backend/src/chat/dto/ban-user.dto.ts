import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  banDuration: number;
}
