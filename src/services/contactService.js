import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import NotifycationModel from "./../models/notificationModel";
import _ from "lodash";

const LIMIT_NUMBER_TAKEN = 1;

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

let getContacts = (currentUserId) => {

  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContacts(currentUserId, LIMIT_NUMBER_TAKEN);
      let users = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) { //tring == object ..vi vay ta so sanh hai dau bang , neu so sanh 3 dau bang(ss tuyert doi) thi ko ra ket qua

          return await UserModel.getNormalUserDataById(contact.userId);
        }else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
        
      });

      resolve(await Promise.all(users));
    } catch (error) {
     reject(error); 
    }
  }); 
}

let getContactsSend = (currentUserId) => {

  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsSend(currentUserId, LIMIT_NUMBER_TAKEN);
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
     reject(error); 
    }
  }); 
}

let getContactsReceived = (currentUserId) => {

  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await ContactModel.getContactsReceived(currentUserId, LIMIT_NUMBER_TAKEN);
      let users = contacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      resolve(await Promise.all(users));
    } catch (error) {
     reject(error); 
    }
  }); 
}

let countAllContacts = (currentUserId) => {

  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
     reject(error); 
    }
  }); 
}

let countAllContactsSend = (currentUserId) => {

  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsSend(currentUserId);
      resolve(count);
    } catch (error) {
     reject(error); 
    }
  }); 
}

let countAllContactsReceived = (currentUserId) => {

  return new Promise(async (resolve, reject) => {
    try {
      let count = await ContactModel.countAllContactsReceived(currentUserId);
      resolve(count);
    } catch (error) {
     reject(error); 
    }
  }); 
}

/**
 * read more contacts  max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContact 
 */
let readMoreContacts = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts= await ContactModel.readMoreContacts(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
      //console.log(newNotificaitions);

      let users = newContacts.map(async (contact) => {
        if(contact.contactId == currentUserId) { //tring == object ..vi vay ta so sanh hai dau bang , neu so sanh 3 dau bang(ss tuyert doi) thi ko ra ket qua

          return await UserModel.getNormalUserDataById(contact.userId);
        }else {
          return await UserModel.getNormalUserDataById(contact.contactId);
        }
      });

      //console.log(await Promise.all(getNotifContents));
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

/**
 * read more contacts sent max 10 item one time
 * @param {string} currentUserId 
 * @param {number} skipNumberContact 
 */
let readMoreContactsSent = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts= await ContactModel.readMoreContactsSent(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
      //console.log(newNotificaitions);

      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      //console.log(await Promise.all(getNotifContents));
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

let readMoreContactsReceived = (currentUserId, skipNumberContact) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts= await ContactModel.readMoreContactsReceived(currentUserId, skipNumberContact, LIMIT_NUMBER_TAKEN);
      //console.log(newNotificaitions);

      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.contactId);
      });

      //console.log(await Promise.all(getNotifContents));
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};



module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContact: removeRequestContact,
  getContacts: getContacts,
  getContactsSend: getContactsSend,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSend: countAllContactsSend,
  countAllContactsReceived: countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived

}