import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lib 
 */
let chatTextEmoji = (io) => {
  let clients = {};
  //moi lan dang nhap hay f5 hoac mo sang tab moi thi no tao ra mot socket id khac nhau vi vay ta luu cliens voi key : userid va value: mang socket id
  //sau moi lan refresh ,f5 hay moi sang tab  moi ta xoa socket id cu va push sockeet id cu vao mang 
  io.on("connection", (socket) => { //connnection khi nguoi dung vao trng web no sex chay
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id );
   

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id );
   });
    socket.on("chat-text-emoji", (data) => {
      //console.log(data);
      //console.log(socket.request.user); //muon lay cai nay thi phai cai them
      //thu vien passports.socketio va cookieparse
      if(data.groupId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
          currentGroupId: data.groupId
        };
        if(clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji", response);
        }
      }
      if(data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
        };
        if(clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji", response);
        }
      }
    });
    //khi f5  thi vao su kien nay
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket );
       });
    });
   // console.log(clients);
  });
}

module.exports = chatTextEmoji;