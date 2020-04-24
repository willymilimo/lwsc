import { NotificationI } from "../../models/notification";
import Actions, { ActionI } from "../Actions";

export const setNotifications = (notifications: NotificationI[]): ActionI => ({
  type: Actions.SET_NOTIFICATIONS,
  payload: notifications,
});

export const addNotification = (notifications: NotificationI): ActionI => ({
  type: Actions.ADD_NOTIFICATIONS,
  payload: notifications,
});
