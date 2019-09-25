import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String,
  },
  receiver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contentType: String, fileName: String},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

MessageSchema.statics = {
  /**
   *  create new message
   * @param {object} item 
   */
  createNew(item) {
    return this.create(item);
  },
  /**
   * get limited item of personal one time
   * @param {string} senderId  current Id
   * @param {string} receiverId  id of contact
   * @param {number} limit 
   */
  getMessagesInPersonal(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"receiverId": senderId},
          {"senderId": receiverId}
        ]}
      ]
    }).sort({"createAt": -1}).limit(limit).exec();
  },
  readMoreMessageInPersonal(senderId, receiverId, skip, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"receiverId": senderId},
          {"senderId": receiverId}
        ]}
      ]
    }).sort({"createAt": -1}).skip(skip).limit(limit).exec();
  },
 // 41
  /**
   * get message in group
   * @param {string} receiverId  id of group chat
   * @param {number} limit 
   */
  getMessagesInGroup(receiverId, limit) {
    return this.find({"receiverId": receiverId}).sort({"createAt": -1}).limit(limit).exec();
  },

  readMoreMessageInGroup(receiverId, skip, limit) {
    return this.find({"receiverId": receiverId}).sort({"createAt": -1}).skip(skip).limit(limit).exec();
  }
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group"
};

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
};


module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationTypes: MESSAGE_CONVERSATION_TYPES,
  messageTypes: MESSAGE_TYPES
};
