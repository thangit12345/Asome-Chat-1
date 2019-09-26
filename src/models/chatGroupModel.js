import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: {type: String, min: 3, max: 100},
  messageAmount: {type: Number, default: 0},
  userId: String,
  members: [
    {userId: String}
  ],
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: Date.now},
  deleteAt: {type: Number, default: null}
});

ChatGroupSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  /**
   *  get chat group items by userId and limit
   * @param {sting} userId  current user id
   * @param {number} limit 
   */
  getChatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}} //neu ma userId ton tai trong mang nay thi lay ca mang
    }).sort({"updateAt": -1}).limit(limit).exec();
  },
  getChatGroupById(id) {
    return this.findById(id).exec();
  },
  /**
   * Update group chat whe add new message
   * @param {string} id id of group chat 
   * @param {number} newMessageAmount 
   */
  updateWhenHasNewMessage(id, newMessageAmount) {
    return this.findByIdAndUpdate(id, {
      "messageAmount": newMessageAmount,
      "updateAt": Date.now()
    }).exec();
  },
  getChatGroupIdsByUser(userId) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}} //neu ma userId ton tai trong mang nay thi lay ca mang
    }, {_id: 1}).exec();
  },
  readMoreChatGroups(userId, skip, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}} //neu ma userId ton tai trong mang nay thi lay ca mang
    }).sort({"updateAt": -1}).skip(skip).limit(limit).exec();
  },

  findByNameGroupChat(currentUserId, keyword) {
    return this.find({
      $and: [
        {"members": {$elemMatch: {"userId": currentUserId}}},
        {$or: [
          {"name": {"$regex": new RegExp(keyword, "i")}}
        ]}
      ]
    }).exec();
  },
}


module.exports = mongoose.model("chat-group", ChatGroupSchema);
