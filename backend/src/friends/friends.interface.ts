enum FriendShipSattusEnum {
  NONE,
  BLOCKED_BY_FRIEND,
  BLOCKED_BY_USER,
  PENDING_BY_FRIEND,
  PENDING_BY_USER,
  ACCEPTED,
  REFUSED,
}

export type FriendShipStatus = keyof typeof FriendShipSattusEnum;
