import UserModel from "./../models/userModel";
import {transErrors} from "./../../lang/vi";
import bcrypt from "bcrypt";

const saltRounds = 7;
/**
 * update user info
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

/**
 * update password for user
 * @param {userId} id 
 * @param {data update} dataUpdate 
 */
let updatePassword = (id, dataUpdate) => {
  return new Promise(async (result, reject) => {
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
    if(!currentUser) {
      return reject(transErrors.accout_undifined);
    }
    
    let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
    // console.log(checkCurrentPassword);
    // console.log(dataUpdate.currentPassword);
    // console.log(currentUser);
    // console.log(currentUser.local.password);
    if(!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }

    let salt = bcrypt.genSaltSync(saltRounds);
    await UserModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt));
    result(true)
  });
};

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
}