import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDate()
  @IsNotEmpty()
  until: Date;
}
