import { QuerySchemaDto } from '@/global/global.dto';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserQueryDTO extends QuerySchemaDto {
  @IsString()
  @IsOptional()
  login: string;
}

export class UserUpdateDTO {
  @IsOptional()
  @IsString({})
  @MinLength(4)
  @MaxLength(32)
  displayname: string;

  @Transform((obj) => obj.value === 'true')
  @IsBoolean()
  @IsOptional()
  'tfa': boolean;
}
