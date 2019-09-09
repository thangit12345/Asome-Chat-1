import {contact} from "./../services/index"
import {validationResult} from "express-validator/check";

let findUsersContact = async (req, res) => {
  let errorArr = [];
  
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    //Logging
    console.log(errorArr);
    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;
    console.log("thang");
    let users = await contact.findUsersContact(currentUserId, keyword);
    console.log(users);
    return res.render("main/contact/sections/_fileUserContact", {users});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  findUsersContact: findUsersContact
}