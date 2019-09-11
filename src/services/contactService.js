import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import NotifycationModel from "./../models/notificationModel";
import _ from "lodash";


let findUsersContact = (currentUserId, keyword) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    try {
      let deprecatedUserIds = [currentUserId];
      let contactsByUser = await ContactModel.findAllByUser(currentUserId);
      contactsByUser.forEach((contact) => {
        deprecatedUserIds.push(contact.userId);
        deprecatedUserIds.push(contact.contactId);
      });
     // console.log(deprecatedUserIds);
      deprecatedUserIds = _.uniqBy(deprecatedUserIds);
      let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
     // console.log('service', users);
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
}

let addNew = (currentUserId, contactId) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExit(currentUserId, contactId);
    if(contactExists) {
      return reject(false);
    }
    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };
    //create notifycation 
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotifycationModel.types.ADD_CONTACT,
    };
    await NotifycationModel.model.createNew(notificationItem);


    let newContact = await ContactModel.createNew(newContactItem);
    resolve(newContact);
  }); 
}

let removeRequestContact = (currentUserId, contactId) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
    //console.log(removeReq.result);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    // remove notifycation 
    let notifTypeContact = NotifycationModel.types.ADD_CONTACT; 
    await NotifycationModel.model.removeRequestContactNotification(currentUserId, contactId, notifTypeContact);
    resolve(true);
  }); 
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact
}