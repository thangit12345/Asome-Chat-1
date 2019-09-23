import authService from "./authService";
import userService from "./userService";
import contactSerivice from "./contactService";
import contactNotificationSerivice from "./notificationService";
import messageService from "./messageService";
import groupChatService from "./groupChatService";

export const user = userService;
export const auth = authService;
export const contact = contactSerivice;
export const notification = contactNotificationSerivice;
export const message = messageService;
export const groupChat = groupChatService;