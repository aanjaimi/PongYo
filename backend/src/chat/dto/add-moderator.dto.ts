import { IsNotEmpty, IsString } from 'class-validator';

export class AddModeratorDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
