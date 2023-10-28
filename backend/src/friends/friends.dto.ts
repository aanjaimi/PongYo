import { QuerySchemaDto } from '@/global/global.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum FriendStateQuery {
  BLOCKED = 'BLOCKED',
  PENDING = 'PENDING',
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
}

export class FriendQueryDTO extends QuerySchemaDto {
  @IsOptional()
  @IsEnum(FriendStateQuery)
  state: FriendStateQuery;
}

export enum FriendShipAction {
  ACCEPT = 'ACCEPT',
  CANCEL = 'CANCEL',
  UNBLOCK = 'UNBLOCK',
  UNFRIEND = 'UNFRIEND',
}

export class FriendShipActionDTO {
  @IsEnum(FriendShipAction)
  action?: FriendShipAction;
}
