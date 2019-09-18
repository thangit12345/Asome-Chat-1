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
  /**
   *  get chat group items by userId and limit
   * @param {sting} userId  current user id
   * @param {number} limit 
   */
  getChatGroups(userId, limit) {
    return this.find({
      "members": {$elemMatch: {"userId": userId}} //neu ma userId ton tai trong mang nay thi lay ca mang
    }).sort({"updateAt": -1}).limit(limit).exec();
  }
}


module.exports = mongoose.model("chat-group", ChatGroupSchema);
