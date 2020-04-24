import { NotificationType, NotificationStatus } from "../types/notification";

export interface NotificationI {
  _id?: string;
  title: string;
  type: NotificationType;
  date: Date | string;
  message: string;
  status?: NotificationStatus;
}

export class Notification implements NotificationI {
  _id?: string;
  title: string;
  type: NotificationType;
  date: string | Date;
  message: string;
  status?: NotificationStatus;

  constructor({ _id, title, type, date, message, status }: NotificationI) {
    this._id = _id;
    this.title = title;
    this.date = date;
    this.type = type as NotificationType; // potentially buggy use of keyword
    this.message = message;
    this.status = status as NotificationStatus;
  }
}
