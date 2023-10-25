import { IsNotEmpty, IsString } from 'class-validator';

export class OtpCallbackDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
