import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type:Boolean, default: false},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  /**
   * find all item that related with user
   * @param {string} userId 
   */
  findAllByUser(userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },

  /**
   * Check exit of 2 user
   * @param {string} userId 
   * @param {string} contactId 
   */
  checkExit(userId, contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }).exec();
  },
  /**
   * Remove request Contact
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContact(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId": contactId}
      ]
    }).exec();
  }
};

module.exports = mongoose.model("contact", ContactSchema);
