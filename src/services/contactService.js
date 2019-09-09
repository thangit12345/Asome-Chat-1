import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";
import { resolve } from "url";
import { user } from ".";

let findUsersContact = (currentUserId, keyword) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    try {
      let deprecatedUserIds = [];
      let contactsByUser = await ContactModel.findAllByUser(currentUserId);
      contactsByUser.forEach((contact) => {
        deprecatedUserIds.push(contact.userId);
        deprecatedUserIds.push(contact.contactId);
      });
      console.log(deprecatedUserIds);
      deprecatedUserIds = _.uniqBy(deprecatedUserIds);
      let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
      console.log('service', users);
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  findUsersContact: findUsersContact
}