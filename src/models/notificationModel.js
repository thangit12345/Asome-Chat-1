import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now}
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  removeRequestContactSentNotification(senderId, receiverId, type) {
    return this.remove({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },
  /**
   * get by userid va limit
   * @param {String} userId 
   * @param {String} limit 
   */
  getByUserIdAndLimit(userId, limit) {
    return this.find({"receiverId": userId}).sort({"createdAt": -1}).limit(limit).exec();
  },
  /**
   * Count all notification unread
   * @param {String} userId 
   */
  countNotifUnread(userId) {
    return this.count({
      $and: [
        {"receiverId": userId},
        {"isRead": false}
      ]
    }).exec();
  },

  //readmore
  readMore(userId, skip, limit) {
    return this.find({"receiverId": userId}).sort({"createdAt": -1}).skip(skip).limit(limit).exec();
  },

  /**
   * mark notification as read
   * @param {string} userId 
   * @param {Array} targetUsers 
   */
  markAllAsRead(userId, targetUsers) {
    return this.updateMany({
      $and: [
        {"receiverId": userId}, 
        {"senderId": {$in: targetUsers}}
      ]
    }, {"isRead": true}).exec();

  }
}

const NOTIICATION_TYPES = {
  ADD_CONTACT: "add_contact",
  APPROVE_CONTACT: "approve_contact"
};

const NOTIFICATION_CONTENS = {
  getContent: (notificationType, isRead, userId, username, userAvatar) => {
    if(notificationType === NOTIICATION_TYPES.ADD_CONTACT) {
      if(!isRead) {
        return `<div class="notif-readed-false" data-uid="${ userId }">
        <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
        <strong>${ username }</strong> đã gửi cho bạn lời mời kết bạn !
       </div>`
      }
      return `<div class="" data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
      <strong>${ username }</strong> đã gửi cho bạn lời mời kết bạn !
     </div>`
  }

  if(notificationType === NOTIICATION_TYPES.APPROVE_CONTACT) {
    if(!isRead) {
      return `<div class="notif-readed-false" data-uid="${ userId }">
      <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
      <strong>${ username }</strong> đã chấp nhân lời mời kết bạn của bạn !
     </div>`
    }
    return `<div class="" data-uid="${ userId }">
    <img class="avatar-small" src="images/users/${ userAvatar }" alt=""> 
    <strong>${ username }</strong> dã chấp nhân lời mời kết bạn của bạn !
   </div>`
}
      
    return "No match with any notification type";
  }
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIICATION_TYPES,
  content: NOTIFICATION_CONTENS
};
