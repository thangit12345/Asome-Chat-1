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
  
  removeContact(userId, contactId) {
    return this.remove({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": true}
        ]},
        {$and: [
          {"userId": contactId},
          {"contactId": userId},
          {"status": true}
        ]}
      ]
    }).exec();
  },
  /**
   * Remove request Contact
   * @param {string} userId 
   * @param {string} contactId 
   */
  removeRequestContactSent(userId, contactId) {
    return this.remove({
      $and: [
        {"userId": userId},
        {"contactId": contactId},
        {"status": false}
      ]
    }).exec();
  },

  removeRequestContactReceived(userId, contactId) {
    return this.remove({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
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
    }).sort({"updateAt": -1}).limit(limit).exec(); //-1 lay tu cao xuong thap
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
    }).sort({"createAt": -1}).limit(limit).exec();
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
    }).sort({"createAt": -1}).limit(limit).exec();
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
  },

  readMoreContacts(userId, skip, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updateAt": -1}).skip(skip).limit(limit).exec();
  },

  /* read more contacts sent max 10 item one time
  * @param {string} userid 
  * @param {number} skip 
  * @param {number} limit
  */
  readMoreContactsSent(userId, skip, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createAt": -1}).skip(skip).limit(limit).exec();
  },

  readMoreContactsReceived(userId, skip, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createAt": -1}).skip(skip).limit(limit).exec();
  },
  /**
   * Approve contact 
   * @param {string} userId 
   * @param {string} contactId 
   */
  approveRequestContactReceived(userId, contactId) {
    return this.update({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }, {
      "status": true,
      "updateAt": Date.now()
    }).exec();
  },
  /**
   * update contact (chat personal) when has new message
   * @param {string} userId  current userId
   * @param {string} contactId contact id
   */
  updateWhenHasNewMessage(userId, contactId) {
    return this.update({
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
    }, {
      "updateAt": Date.now()
    }).exec();
  },
  
   /**
   * get contact friend by userId 
   * @param {string} userId 
   */
  getFriends(userId) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"updateAt": -1}).exec(); //-1 lay tu cao xuong thap
  },
};


module.exports = mongoose.model("contact", ContactSchema);
