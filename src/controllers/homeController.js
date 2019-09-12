import {notification} from "./../services/index";

let getHome = async (req, res) => {
  //load notification
  let notifications = await notification.getNotification(req.user._id);
  //get amount notification unread
  let countNotifUnRead = await notification.countNotifUnread(req.user._id);

  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnRead: countNotifUnRead
  });
 };

 module.exports = {
   getHome: getHome
 };
