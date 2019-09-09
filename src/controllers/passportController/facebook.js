import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/userModel";
let facebookStrategy = passportFacebook.Strategy;
import {transErrors, transSuccess} from "./../../../lang/vi";
/**
 * valid user account type: facebook, can cai passport-facebook
 * khi test o local thi cai them goi 'Pem' de hack duong dan thanh https
 */
let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallBack = process.env.FB_CALLBACK_URL;

 let initPassportFacebook = () => {
  passport.use(new facebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbCallBack,
    passReqToCallback: true,
    profileFields: ["email", "gender", "displayName"] //cac truong minh lay tren facebook
  },async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await  UserModel.findByFacebookId(profile.id);
      if (user) {
        return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)))
      }
      
      console.log(profile);

      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        facebook: {
          uid: profile.id,
          token: accessToken ,
          email: profile.emails[0].value
        }
      };

      let newUser = await UserModel.createNew(newUserItem);
      return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)))

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
    UserModel.findUserById(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      })
  });
 };

 module.exports = initPassportFacebook;