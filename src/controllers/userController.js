import multer from "multer";
import {app} from "./../config/app";
import {transErrors, transSuccess} from "./../../lang/vi"
import uuidv4 from "uuid/v4";
import {user} from "./../services/index";
import fs_extra from "fs-extra";
import {validationResult} from "express-validator/check";

let storageAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
   // console.log(file.mimetype);
    let match = app.avatar_type;
    if(match.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type, null);

    }

    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarName);
  }
});

let avatarUploadFile = multer({
  storage: storageAvatar,
  limits: {fileSize: app.avatar_limit_size}
}).single("avatar");//trong append avatar trong form data ben file updataUser

let updateAvatar = (req, res) => {
   avatarUploadFile(req, res, async (error) => {
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.avatar_size);
      }
      return res.status(500).send(transErrors.avatar_type); //cai nay ko reload laij trang con send thi reload lai nhe !
    }
   // console.log(req.file);
   try {
     let updateUserItem = {
      avatar: req.file.filename,
      updateAt: Date.now()
     };
     //console.log(req.user._id, updateUserItem);
     //update users
     let userUpdate = await user.updateUser(req.user._id, updateUserItem);

     //remove old user avatar //cai module fs-extra
     //ko xoa avatar cu cua nguoi dung vi trong bangr message can de su dung
     //await fs_extra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
     let result = {
       message: transSuccess.avatar_updated,
       imageSrc: `/images/users/${req.file.filename}`
     };
     return res.status(200).send(result);
    } catch (error) {
      console.log('thang',error);
      return res.status(500).send(error);
   }
  });
};

let updateInfo = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    //cài module connect-flash để chuyển error sang cho client
    //khi sài flash thì yêu cầu phải cài module session
   
    return res.status(500).send(errorArr);
  }

  try {
    let updateUserItem = req.body;
    console.log('tha1', updateUserItem);
    await user.updateUser(req.user._id, updateUserItem);
    let result = {
      message: transSuccess.user_info_updated
    };
    return res.status(200).send(result);

  } catch (error) {
    console.log('thang',error);
    return res.status(500).send(error);
  }
};

let updatePassword = async (req, res) => {
  let errorArr = [];
  
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    return res.status(500).send(errorArr);
  }

  try {
    let updateUserItem = req.body;
    await user.updatePassword(req.user._id, updateUserItem);

    let result = {
      message: transSuccess.user_password_updated
    };
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  updateAvatar: updateAvatar,
  updateInfo: updateInfo,
  updatePassword: updatePassword
};