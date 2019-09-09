import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess, transMail} from "./../../lang/vi";
import sendMail from "./../config/mailer";

let saltRounds = 7;
let register =  (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    if (userByEmail) {
      if (userByEmail.deleteAt != null) {
        return reject(transErrors.account_remove);
      }
      if (!userByEmail.local.isActive) {
        return reject(transErrors.account_not_active);
      }
      return reject(transErrors.account_in_use);
    }
    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4() //caif theem module uuid 
      }
    };

    let user = await UserModel.createNew(userItem);
    //send email ==> cai module nodemailer
    let linkVerify = `${protocol}:${host}/verify/${user.local.verifyToken}`
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async (error) => {
        //remove user
        console.log(error);
        await UserModel.removeById(user._id);
        reject(transMail.sendFail);
      });//phai len google search "ung dung kems oan toan "de cau hinh laij de email cho phep guis
  });
  
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    let userByToken = await UserModel.findByToken(token);
    if (!userByToken) {
      return reject(transErrors.token_undifined);
    }
    
    await UserModel.verify(token);
    resolve(transSuccess.account_active);
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount
};