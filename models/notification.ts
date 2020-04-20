import { NotificationType, NotificationStatus } from "../types/notification";

export interface NotificationI {
  _id: string;
  title: string;
  type: NotificationType;
  date: Date | string;
  message: string;
  status: NotificationStatus
}
