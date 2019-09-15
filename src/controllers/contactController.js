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
    //console.log("thang");
    let users = await contact.findUsersContact(currentUserId, keyword);
    //console.log(users);
    return res.render("main/contact/sections/_fileUserContact", {users});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addNew = async (req, res) => {
  let errorArr = [];
  
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);
    //console.log(newContact);
    //conssole.log(!!newContact); true or false
    return res.status(200).send({success: !!newContact});
    
  } catch (error) {
     return res.status(500).send(error);
 }
};

let removeRequestContactSent = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactSent(currentUserId, contactId);
    //console.log(newContact);
    //conssole.log(!!newContact); true or false
    return res.status(200).send({success: !!removeReq});
    
  } catch (error) {
     return res.status(500).send(error);
 }
};

let readMoreContacts = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberContact = +(req.query.skipNumber);
    //get more item
    let newContactUsers = await contact.readMoreContacts(req.user._id, skipNumberContact);
    //console.log(newContactUsers);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsSent = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberContact = +(req.query.skipNumber);
    //get more item
    let newContactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberContact);
    //console.log(newContactUsers);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContactsReceived = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberContact = +(req.query.skipNumber);
    //get more item
    let newContactUsers = await contact.readMoreContactsReceived(req.user._id, skipNumberContact);
    //console.log(newContactUsers);
    return res.status(200).send(newContactUsers);
  } catch (error) {
    return res.status(500).send(error);
  }
};
let removeRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequestContactReceived(currentUserId, contactId);
    //console.log(newContact);
    //conssole.log(!!newContact); true or false
    return res.status(200).send({success: !!removeReq});
    
  } catch (error) {
     return res.status(500).send(error);
 }
};

let approveRequestContactReceived = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approveReq = await contact.approveRequestContactReceived(currentUserId, contactId);
    //console.log(newContact);
    //conssole.log(!!newContact); true or false
    return res.status(200).send({success: !!approveReq});
    
  } catch (error) {
     return res.status(500).send(error);
 }
};

let removeContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeContact = await contact.removeContact(currentUserId, contactId);
    //console.log(newContact);
    //conssole.log(!!newContact); true or false
    //console.log("tr", removeContact)
    return res.status(200).send({success: !!removeContact});
    
  } catch (error) {
     return res.status(500).send(error);
 }
};

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequestContactSent: removeRequestContactSent,
  readMoreContacts: readMoreContacts,
  readMoreContactsSent: readMoreContactsSent,
  readMoreContactsReceived: readMoreContactsReceived,
  removeRequestContactReceived: removeRequestContactReceived,
  approveRequestContactReceived: approveRequestContactReceived,
  removeContact: removeContact
}