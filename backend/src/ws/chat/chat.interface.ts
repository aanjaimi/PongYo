import { NotifType, User } from '@prisma/client';

export type SendNotificationPayload = {
  type: NotifType;
  sender: User;
  receiver: User;
};
