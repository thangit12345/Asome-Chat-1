import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/userModel";
let localStrategy = passportLocal.Strategy;
import {transErrors, transSuccess} from "./../../../lang/vi";
/**
 * valid user account type: local
 */

 let initPassportLocal = () => {
  passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password", //truong nay lay tu form dang nhap
    passReqToCallback: true
  },async (req, email, password, done) => {
    try {
      let user = await  UserModel.findByEmail(email);
      if (!user) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }
      if (!user.local.isActive) {
        return done(null, false, req.flash("errors", transErrors.account_not_active));
      }
      let checkPassword = await user.comparePassword(password);
      console.log('checkpassword :',checkPassword);
      if (!checkPassword) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }

      return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)))
    } catch (error) {
      console.log(error);
      return done(null, false, req.flash("errors", transErrors.server_error))
    }
  }));
  //save userid to session
  passport.serializeUser((user, done) => {
    done(null, user._id)
  });

  passport.deserializeUser((id, done) => { //then passport.session se goi then nay, con then tren minh luu bien session
    UserModel.findUserByIdForSessionToUse(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      })
  });
 };

 module.exports = initPassportLocal;