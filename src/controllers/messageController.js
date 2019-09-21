import {validationResult} from "express-validator/check";
import {message} from "./../services/index";
import multer from "multer";
import {app} from "./../config/app";
import {transErrors, transSuccess} from "./../../lang/vi"
import fsExtra from "fs-extra";

// handel text and emojji chat
let addNewTextEmoji = async(req, res) => {
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
   let sender = {
     id: req.user._id,
     name: req.user.username,
     avatar: req.user.avatar,
   };

   let receiverId = req.body.uid;
   let messageVal = req.body.messageVal;
   let isChatGroup = req.body.isChatGroup;

   let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);
   return res.status(200).send({message: newMessage});

  } catch (error) {
    console.log('thang',error);
    return res.status(500).send(error);
  }
};

// handel image chat
let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
   // console.log(file.mimetype);
    let match = app.image_type;
    if(match.indexOf(file.mimetype) === -1) {
      return callback(transErrors.image_type, null);

    }

    let imageName = `${file.originalname}`;
    callback(null, imageName);
  }
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: {fileSize: app.image_limit_size}
}).single("my-image-chat");

let addNewImage = async(req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.image_size);
      }
      return res.status(500).send(transErrors.image_type); //cai nay ko reload laij trang con send thi reload lai nhe !
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };
   
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
   
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
      
      //remove image , because this image saved to mongodb
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`)
      return res.status(200).send({message: newMessage});
   
     } catch (error) {
       console.log('thang',error);
       return res.status(500).send(error);
     }
  });
  
};
// handel attachment chat
let storageAttachChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attach_message_directory);
  },
  filename: (req, file, callback) => {
   // console.log(file.mimetype);

    let attachName = `${file.originalname}`;
    callback(null, attachName);
  }
});

let attachMessageUploadFile = multer({
  storage: storageAttachChat,
  limits: {fileSize: app.attach_limit_size}
}).single("my-attach-chat");

let addNewAttach = async(req, res) => {
  attachMessageUploadFile(req, res, async (error) => {
    if(error) {
      if(error.message) {
        return res.status(500).send(transErrors.attach_size);
      }
      return res.status(500).send(error); //cai nay ko reload laij trang con send thi reload lai nhe !
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };
   
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
   
      let newMessage = await message.addNewAttach(sender, receiverId, messageVal, isChatGroup);
      
      //remove attach , because this image saved to mongodb
      await fsExtra.remove(`${app.attach_message_directory}/${newMessage.file.fileName}`)
      return res.status(200).send({message: newMessage});
   
     } catch (error) {
       console.log('thang',error);
       return res.status(500).send(error);
     }
  });
  
};


module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttach: addNewAttach
};