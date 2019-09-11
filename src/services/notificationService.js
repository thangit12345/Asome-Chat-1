import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

/**
 * get notification when f5 page
 * just 10 item one time
 * @param {String} currentUserId 
 * @param {Number} limit 
 */
let getNotification = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);
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

module.exports = {
  getNotification: getNotification
};