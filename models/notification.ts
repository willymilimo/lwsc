export interface NotificationI {
  // _id?: string;
  // title: string;
  // type: NotificationType;
  // date: Date | string;
  // message: string;
  // status?: NotificationStatus;

  _id: string;
  title: string;
  description: string;
  icon: string;
  create_on: Date;
  is_read: boolean;
}

export class Notification implements NotificationI {
  _id: string;
  title: string;
  description: string;
  icon: string;
  create_on: Date;
  is_read: boolean;

  constructor({
    _id,
    title,
    description,
    icon,
    create_on,
    is_read,
  }: NotificationI) {
    this._id = _id;
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.create_on = new Date(create_on);
    this.is_read = !!is_read;
  }
}
