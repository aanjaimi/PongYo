import { IsNotEmpty, IsString } from 'class-validator';

export class kickUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
