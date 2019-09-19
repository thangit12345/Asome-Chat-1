import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";
let getHome = async (req, res) => {
  //load notification
  let notifications = await notification.getNotification(req.user._id);
  //get amount notification unread
  let countNotifUnRead = await notification.countNotifUnread(req.user._id);

  //get contacts (10 item one time)
  let contacts = await contact.getContacts(req.user._id);
  //get contacts send (10 item one time)
  let contactsSend = await contact.getContactsSend(req.user._id);
  //get contacts receiver (10 item one time)
  let contactsReceived = await contact.getContactsReceived(req.user._id);
  // count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllContactsSend = await contact.countAllContactsSend(req.user._id);
  let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

  let getAllConversationItems = await message.getAllConversationItems(req.user._id);
  // let allConversations = getAllConversationItems.allConversations;
  // let userConversations = getAllConversationItems.userConversations;
  // let groupConversations = getAllConversationItems.groupConversations;
  //all message with conversation max 30 item
  let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;

  //console.log(req.user);
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnRead: countNotifUnRead,
    contacts: contacts,
    contactsSend: contactsSend,
    contactsReceived: contactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSend: countAllContactsSend,
    countAllContactsReceived: countAllContactsReceived,
    // allConversations: allConversations,
    // userConversations: userConversations,
    // groupConversations: groupConversations,
    allConversationWithMessages: allConversationWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimestampToHumanTime: convertTimestampToHumanTime
  });
 };

 module.exports = {
   getHome: getHome
 };
