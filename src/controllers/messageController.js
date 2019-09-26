import {validationResult} from "express-validator/check";
import {message} from "./../services/index";
import multer from "multer";
import {app} from "./../config/app";
import {transErrors, transSuccess} from "./../../lang/vi"
import fsExtra from "fs-extra";
import ejs from "ejs";
import {lastItemOfArray, convertTimestampToHumanTime, bufferToBase64} from "./../helpers/clientHelper";
import {promisify} from "util";

// make ejs function renderFile available with await
const renderFile = promisify(ejs.renderFile).bind(ejs); // sau buoc nay no se san sang tra ve 1 loi hua
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
let readMoreAllChat = async(req, res) => {
  try {
    // get skip number from query param
    let skipPersonal = +(req.query.skipPersonal);
    let skipGroup = +(req.query.skipGroup);
    //get more item
    let newAllConversations = await message.readMoreAllChat(req.user._id, skipPersonal, skipGroup);
    //console.log(newAllConversation);

    let dataToRender = {
      newAllConversations: newAllConversations,
      lastItemOfArray: lastItemOfArray,
      convertTimestampToHumanTime: convertTimestampToHumanTime,
      bufferToBase64: bufferToBase64,
      user: req.user
    };
    // do ejs.renderFile chua ho tro asyst await ,,nen phai viet theo callback hell ...de tranh truong hop su dung callback hell thi ta chuyen no ve de co the dung duoc asyst await theo cach promisify cua uti
    let leftSideData = await renderFile("src\\views\\main\\readMoreConversations\\_leftSide.ejs", dataToRender);
    // ejs.renderFile("src\\views\\main\\readMoreConversations\\_leftSide.ejs", dataToRender, {}, function(err, str){
    //   if(err) {
    //     console.log(err);
    //     return ;
    //   }
    //   console.log(str)
    // });
    // cach nay goi la server render
    let rightSideData = await renderFile("src\\views\\main\\readMoreConversations\\_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src\\views\\main\\readMoreConversations\\_imageModal.ejs", dataToRender);
    let attachModalData = await renderFile("src\\views\\main\\readMoreConversations\\_attachModal.ejs", dataToRender);
    let membersModalData = await renderFile("src\\views\\main\\readMoreConversations\\_memberModal.ejs", dataToRender);
    // console.log(rightSideData);

    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachModalData: attachModalData,
      membersModalData: membersModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};
let readMore = async(req, res) => {
  try {
    // get skip number from query param
    let skipMessage = +(req.query.skipMessage);
    let targetId = req.query.targetId;
    let chatInGroup = (req.query.chatInGroup === "true"); // convert string to boolean
    
    //get more item
    let newMessages = await message.readMore(req.user._id, skipMessage, targetId, chatInGroup);
    //console.log();

    let dataToRender = {
      newMessages: newMessages,
      bufferToBase64: bufferToBase64,
      user: req.user
    };
    //console.log(newMessages);
    // do ejs.renderFile chua ho tro asyst await ,,nen phai viet theo callback hell ...de tranh truong hop su dung callback hell thi ta chuyen no ve de co the dung duoc asyst await theo cach promisify cua uti
    let rightSideData = await renderFile("src\\views\\main\\readMoreMessages\\_rightSide.ejs", dataToRender);
    let imageModalData = await renderFile("src\\views\\main\\readMoreMessages\\_imageModal.ejs", dataToRender);
    let attachModalData = await renderFile("src\\views\\main\\readMoreMessages\\_attachModal.ejs", dataToRender);
   //sconsole.log(rightSideData);

    return res.status(200).send({
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachModalData: attachModalData
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};




module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttach: addNewAttach,
  readMoreAllChat: readMoreAllChat,
  readMore: readMore
};