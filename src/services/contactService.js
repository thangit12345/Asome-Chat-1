import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";
import { resolve } from "url";
import { user } from ".";

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

    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    };

    let newContact = await ContactModel.createNew(newContactItem);
    resolve(newContact);
  }); 
}

let removeRequestContact = (currentUserId, contactId) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
    console.log(removeReq.result);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    resolve(true);
  }); 
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact
}