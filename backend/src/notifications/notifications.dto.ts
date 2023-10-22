import { QuerySchemaDto } from '@/global/global.dto';
import { NotifType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class NotificationQueryDTO extends QuerySchemaDto {
  @IsEnum(NotifType, { each: true })
  @IsOptional()
  type: NotifType;
}
