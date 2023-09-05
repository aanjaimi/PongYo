import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateAuthenticationDto {
	@IsString()
	@IsNotEmpty()
	readonly id: string;

	@IsString()
  @IsNotEmpty()
  readonly login: string;

	@IsString()
  @IsNotEmpty()
  readonly firstname: string;

	@IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}
