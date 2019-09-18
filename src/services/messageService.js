import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";
import MessageModel from "./../models/messageModel";

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
        let getMessages = await MessageModel.model.getMessages(currentUserId, conversation._id, LIMIT_MESSAGE_TAKEN);
        
        conversation = conversation.toObject();
        conversation.messages = getMessages;
        return conversation;
      });

      let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
      //sort by updateAt desending
      allConversationWithMessages = _.sortBy(allConversationWithMessages, (item) => {
        return -item.updateAt;
      });
      //console.log(allConversationWithMessages);
      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations,
        allConversationWithMessages: allConversationWithMessages
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems
};