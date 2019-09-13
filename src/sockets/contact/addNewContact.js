import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lib 
 */
let addNewContact = (io) => {
  let clients = {};
  //moi lan dang nhap hay f5 hoac mo sang tab moi thi no tao ra mot socket id khac nhau vi vay ta luu cliens voi key : userid va value: mang socket id
  //sau moi lan refresh ,f5 hay moi sang tab  moi ta xoa socket id cu va push sockeet id cu vao mang 
  io.on("connection", (socket) => { //connnection khi nguoi dung vao trng web no sex chay
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id );
   
    socket.on("add-new-contact", (data) => {
      //console.log(data);
      //console.log(socket.request.user); //muon lay cai nay thi phai cai them
      //thu vien passports.socketio va cookieparse
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };
      //emit notication
      //khi no dang nhap
      if(clients[data.contactId]) {
        //vi du nguoi dung moi 2 tab thi goi cho ca 2 ben cua nguoi nhan
        emitNotifyToArray(clients, data.contactId, io, "response-add-new-contact", currentUser);
      }
    });
    //khi f5  thi vao su kien nay
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    });
    console.log(clients);
  });
}

module.exports = addNewContact;