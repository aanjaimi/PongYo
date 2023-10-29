import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeOwnerDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
