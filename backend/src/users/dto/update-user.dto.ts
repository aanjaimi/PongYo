import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  displayname: string;

  @IsString()
  @IsNotEmpty()
  twoFactorAuth: string;

  @IsString()
  isComplete: string;
}
