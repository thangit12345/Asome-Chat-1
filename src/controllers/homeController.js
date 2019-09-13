import {notification, contact} from "./../services/index";

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
    countAllContactsReceived: countAllContactsReceived
  });
 };

 module.exports = {
   getHome: getHome
 };
