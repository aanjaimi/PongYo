import { QuerySchemaDto } from '@/global/global.dto';
import { FriendState } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class FriendQueryDTO extends QuerySchemaDto {
  @IsOptional()
  @IsEnum(FriendState, { each: true })
  state: FriendState;
}

export enum FriendShipAction {
  ACCEPT = 'ACCEPT',
  CANCEL = 'CANCEL',
  UNBLOCK = 'UNBLOCK',
}

export class FriendShipActionDTO {
  @IsOptional()
  @IsEnum(FriendShipAction, { each: true })
  action?: FriendShipAction;
}
