import ContactModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import ChatGroupModel from "./../models/chatGroupModel";
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

let removeContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeContact= await ContactModel.removeContact(currentUserId, contactId);
    //console.log(removeReq.result);
    if(removeContact.result.n === 0) {
      return reject(false);
    }
    resolve(removeContact);
  }); 
 }

let removeRequestContactSent = (currentUserId, contactId) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactSent(currentUserId, contactId);
    //console.log(removeReq.result);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    // remove notifycation 
    let notifTypeContact = NotifycationModel.types.ADD_CONTACT; 
    await NotifycationModel.model.removeRequestContactSentNotification(currentUserId, contactId, notifTypeContact);
    resolve(true);
  }); 
}

let removeRequestContactReceived = (currentUserId, contactId) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    let removeReq = await ContactModel.removeRequestContactReceived(currentUserId, contactId);
    //console.log(removeReq.result);
    if(removeReq.result.n === 0) {
      return reject(false);
    }
    // chuc nang nay chua muon lam
    // remove notifycation 
    // let notifTypeContact = NotifycationModel.types.ADD_CONTACT; 
    // await NotifycationModel.model.removeRequestContactReceivedNotification(currentUserId, contactId, notifTypeContact);
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
      //console.log(newContacts);

      let users = newContacts.map(async (contact) => {
        return await UserModel.getNormalUserDataById(contact.userId);
      });

      //console.log(await Promise.all(users));
      resolve(await Promise.all(users));

    } catch (error) {
      reject(error);
    }
  });
};

let approveRequestContactReceived = (currentUserId, contactId) => {
  
  return new Promise(async (resolve, reject) => {
    let approveReq = await ContactModel.approveRequestContactReceived(currentUserId, contactId);
    //console.log(approveReq.nModified);
    if(approveReq.nModified === 0) { //1 la thanh cong , 0 la bi loi
      return reject(false);
    }
    // create notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: NotifycationModel.types.APPROVE_CONTACT,
    };
    await NotifycationModel.model.createNew(notificationItem);
    resolve(true);
  }); 
};

let searchFriends = (currentUserId, keyword) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    try {
      let friendIds = [];
      let friends = await ContactModel.getFriends(currentUserId);
      friends.forEach((item) => {
        friendIds.push(item.userId);
        friendIds.push(item.contactId);
      });
      friendIds = _.uniqBy(friendIds); //loc het trung lap
      friendIds = friendIds.filter(userId => userId != currentUserId); // ly do != cho ko phai !== la vi: typeOf(userid) = string, typeof(currentuserid) = object
    
      let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
}


let findMessageNameOrEmail = (currentUserId, keyword) => {
  //o day chu yeu tim nhung user khac da khong co trong danh sach contac de addfriend
  return new Promise(async (resolve, reject) => {
    try {
      let friendIds = [];
      let friends = await ContactModel.getFriends(currentUserId);
      friends.forEach((item) => {
        friendIds.push(item.userId);
        friendIds.push(item.contactId);
      });
      friendIds = _.uniqBy(friendIds); //loc het trung lap
      friendIds = friendIds.filter(userId => userId != currentUserId); // ly do != cho ko phai !== la vi: typeOf(userid) = string, typeof(currentuserid) = object
    
      let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);
      let group = await ChatGroupModel.findByNameGroupChat(currentUserId, keyword);
      let merger = users.concat(group);
   
      resolve(merger);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  getContacts: getContacts,
  getContactsSend: getContactsSend,
  getContactsReceived: getContactsReceived,
  countAllContacts: countAllContacts,
  countAllContactsSend: countAllContactsSend,
  countAllContactsReceived: countAllContactsReceived,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  removeContact: removeContact,
  searchFriends: searchFriends,
  findMessageNameOrEmail: findMessageNameOrEmail

}