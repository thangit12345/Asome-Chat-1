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
  },

  /**
   * get contact by userId and limit
   * @param {string} userId 
   * @param {string} limit 
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"createAt": 1}).limit(limit).exec();
  },
  /**
   * get contact send by userId and limit
   * @param {string} userId 
   * @param {string} limit 
   */
  getContactsSend(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createAt": 1}).limit(limit).exec();
  },
  /**
   * get contact receiver by userId and limit
   * @param {string} userId 
   * @param {string} limit 
   */
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createAt": 1}).limit(limit).exec();
  },
  countAllContacts(userId) {
    return this.count({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec();
  },
  /**
   * count all contact send by userId and limit
   * @param {string} userId 
   */
  countAllContactsSend(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },
  /**
   * count all  contact receiver by userId and limit
   * @param {string} userId 
   */
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  }


};


module.exports = mongoose.model("contact", ContactSchema);
