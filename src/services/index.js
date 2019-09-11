import authService from "./authService";
import userService from "./userService";
import contactSerivice from "./contactService";
import contactNotificationSerivice from "./notificationService";

export const user = userService;
export const auth = authService;
export const contact = contactSerivice;
export const notification = contactNotificationSerivice;