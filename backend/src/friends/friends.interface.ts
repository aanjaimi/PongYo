enum FriendShipSattusEnum {
  NONE,
  BLOCKED_BY_FRIEND, // howa li 3ml block
  BLOCKED_BY_USER, // ana li 3mlt block
  PENDING_BY_FRIEND, // howa li 3ml add
  PENDING_BY_USER, // ana li 3mlt add
  ACCEPTED,
}

export type FriendShipStatus = keyof typeof FriendShipSattusEnum;
