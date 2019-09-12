import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

const LIMIT_NUMBER_TAKEN = 10;
/**
 * get notification when f5 page
 * just 10 item one time
 * @param {String} currentUserId 
 * @param {Number} limit 
 */
let getNotification = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);
      //console.log(notifications);
      let getNotifContents = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });

      //console.log(await Promise.all(getNotifContents));
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Count all notificaition unread
 * @param {string} currentUserId 
 */
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Read more notification max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumberNotificaction 
 */
let readMore = (currentUserId, skipNumberNotificaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotificaitions = await NotificationModel.model.readMore(currentUserId, skipNumberNotificaction, LIMIT_NUMBER_TAKEN);
      //console.log(newNotificaitions);

      let getNotifContents = newNotificaitions.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.content.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });

      //console.log(await Promise.all(getNotifContents));
      resolve(await Promise.all(getNotifContents));

    } catch (error) {
      reject(error);
    }
  });
};
/**
 *  mark notification as readd
 * @param {String} currentUserId 
 * @param {Array} targetUser 
 */
let markAllAsRead = (currentUserId, targetUser) => {
  console.log(currentUserId);
  console.log(targetUser);
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAllAsRead(currentUserId, targetUser);
      resolve(true);

    } catch (error) {
      console.log(`Error when mark notification as read: ${error}`);
      reject(false);
    }
  });
};


module.exports = {
  getNotification: getNotification,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead
};