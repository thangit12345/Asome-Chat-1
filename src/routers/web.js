import express from "express";
import {home, auth,user, contact, notification, message, groupChat} from "./../controllers/index"
import {authValid, userValid, contactValid, messageValid, groupChatValid} from "./../validation/index";
import initPassportLocal from "./../controllers/passportController/local";
import passport from "passport";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";


//init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

/**
 * Init all router
 * @param app from exactly express
 */
let initRoutes = (app) => {

  router.get("/login-register",auth.checkLoggedOut, auth.getLoginRegister);
  router.post("/register", auth.checkLoggedOut, authValid.register ,auth.postRegister);
  router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/", //thanh con chuyen ve trang chu
    failureRedirect: "/login-register", //that bai
    successFlash: true, //de no truyen request flash ve va show rthog bao ra
    failureFlash: true
  }));

  router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", {scope: ["email"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", {scope: ["email"]}));
  router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  
  router.get("/",auth.checkLoggedIn, home.getHome);
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn,userValid.updateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedIn,userValid.updatePassword, user.updatePassword);

  router.get("/contact/find-users/:keyword", auth.checkLoggedIn, contactValid.findUserContact, contact.findUsersContact);
  router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-request-contact-sent", auth.checkLoggedIn, contact.removeRequestContactSent);
  router.delete("/contact/remove-request-contact-received", auth.checkLoggedIn, contact.removeRequestContactReceived);
  router.put("/contact/approve-request-contact-received", auth.checkLoggedIn, contact.approveRequestContactReceived);
  router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);
  router.get("/contact/read-more-contacts-sent", auth.checkLoggedIn, contact.readMoreContactsSent);
  router.get("/contact/read-more-contacts-received", auth.checkLoggedIn, contact.readMoreContactsReceived);
  router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
  router.get("/contact/search-friends/:keyword", auth.checkLoggedIn, contactValid.searchFriends, contact.searchFriends);
  
  router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
  router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);
  
  router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
  router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
  router.post("/message/add-new-attach", auth.checkLoggedIn, message.addNewAttach);
  router.get("/message/read-more-all-chat", auth.checkLoggedIn, message.readMoreAllChat);
  router.get("/message/read-more", auth.checkLoggedIn, message.readMore);
  
  router.post("/group-chat/add-new", auth.checkLoggedIn, groupChatValid.addNewGroup, groupChat.addNewGroup);

  router.get("/conversation/find-conversation/:keyword", auth.checkLoggedIn, contactValid.checkFindConversation, contact.findMessageNameOrEmail);

   return app.use("/", router)
};

module.exports = initRoutes;