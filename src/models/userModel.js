import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: {type: String, default: "male"},
  phone: {type: String, default: null},
  address: {type: String , default: null},
  avatar: {type: String , default: "avatar-default.jpg"},
  role: {type: String, default: "user"},
  local: {
    email: {type: String , trim: true},
    password: String,
    isActive: {type: Boolean, default:false},
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String ,
    email: {type: String, trim: true}
  },
  google: {
    uid: String,
    token: String ,
    email: {type: String, trim: true}
  },
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({"local.email": email}).exec();
  },
  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
  findByToken(token) {
    return this.findOne({"local.verifyToken": token}).exec();
  },
  verify(token) {
    return this.findOneAndUpdate(
      {"local.verifyToken": token},
      {"local.isActive": true, "local.verifyToken": null}
    ).exec();
  }, 
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },
  findUserByIdForSessionToUse(id) {
    return this.findById(id, {"local.password": 0}).exec(); //loai bo truong password ko lay
  },
  findByFacebookId(uid) {
    return this.findOne({"facebook.uid": uid}).exec();
  },
  findByGoogleId(uid) {
    return this.findOne({"google.uid": uid}).exec();
  },
  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec(); //return old item affter updates
  },
  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, {"local.password": hashedPassword}).exec();
    },

  /**
   * find all user for add contact
   * @param {array: deprecatedUserIds}
   * @param {string: keyword search}
   */
  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$nin: deprecatedUserIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i")}}, //chu i la ko phan biet chu hoa thuong
          {"local.email": {"$regex": new RegExp(keyword, "i")}},
          {"facebook.email": {"$regex": new RegExp(keyword, "i")}},
          {"google.email": {"$regex": new RegExp(keyword, "i")}}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },

  getNormalUserDataById(id) {
    return this.findById(id, {_id: 1, username: 1, address: 1, avatar: 1}).exec(); //cho lay cac truong nay ra thoi 
  },

  /**
   * find all user for add contact
   * @param {array: friendIds}
   * @param {string: keyword search}
   */
  findAllToAddGroupChat(friendIds, keyword) {
    return this.find({
      $and: [
        {"_id": {$in: friendIds}},
        {"local.isActive": true},
        {$or: [
          {"username": {"$regex": new RegExp(keyword, "i")}}, //chu i la ko phan biet chu hoa thuong
          {"local.email": {"$regex": new RegExp(keyword, "i")}},
          {"facebook.email": {"$regex": new RegExp(keyword, "i")}},
          {"google.email": {"$regex": new RegExp(keyword, "i")}}
        ]}
      ]
    }, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
  },
  
};
//static duoc dung de lay ra doi tuong can lay .con khi dung chung de thao tac ()so sanh..thi dung methods
UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password); //return a promise has result true or false
  }
};

module.exports = mongoose.model("user", UserSchema);