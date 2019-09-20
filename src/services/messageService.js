import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";
import MessageModel from "./../models/messageModel";
import {transErrors} from "./../../lang/vi";
import {app} from "./../config/app";

const LIMIT_CONSERVATION_TAKEN = 15;
const LIMIT_MESSAGE_TAKEN = 15;
/**
 * get all coversation
 * @param {string} currentUserId 
 */
let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONSERVATION_TAKEN);
      let usersConversationsPromise = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) { //tring == object ..vi vay ta so sanh hai dau bang , neu so sanh 3 dau bang(ss tuyert doi) thi ko ra ket qua

          let getUserContact = await UserModel.getNormalUserDataById(contact.userId);
          // getUserContact = getUserContact.toObject();
          getUserContact.updateAt = contact.updateAt;
          return getUserContact;
        }else {
          let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
          // getUserContact = getUserContact.toObject();
          getUserContact.updateAt = contact.updateAt;
          return getUserContact;
        }
        
      });
      let userConversations = await Promise.all(usersConversationsPromise);
      let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONSERVATION_TAKEN);
      let allConversations = userConversations.concat(groupConversations);
      allConversations = _.sortBy(allConversations, (item) => {
        return  -item.updateAt; //sap xep theo lon ve nho
      });

      //get message to apply to screen chat
      let allConversationWithMessagesPromise = allConversations.map(async (conversation) =>{
        conversation = conversation.toObject();

        if(conversation.members) { //rtro chuyen nhom
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGE_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGE_TAKEN);
          conversation.messages = _.reverse(getMessages);
        }
        
        return conversation;
      });

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sort by updateAt desending
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });
      //console.log(allConversationWithMessages);
      resolve({
        // userConversations: userConversations,
        // groupConversations: groupConversations,
        // allConversations: allConversations,
        allConversationWithMessages: allConversationWithMessages
      });

    } catch (error) {
      reject(error);
    }
  });
};
/**
 * add new message text and emoji
 * @param {object} sender  current user
 * @param {string} receiverId id of an user or a group
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createAt: Date.now()
        };
         // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
        // update group chat
        await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messageAmount + 1);
        resolve(newMessage);
      }else {
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createAt: Date.now()
        };
        // create new message
        let newMessage = await MessageModel.model.createNew(newMessageItem);
         // updata contact 
        await ContactModel.updateWhenHasNewMessage(sender._id, getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji
};