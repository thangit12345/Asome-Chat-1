import {pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io lib 
 */
let userOnlineOffline = (io) => {
  let clients = {};
  io.on("connection", (socket) => { //connnection khi nguoi dung vao trng web no sex chay
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id );
   

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id );
   });

    // when has new group chat
    socket.on("new-group-created", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id );
    });
    socket.on("member-received-group-chat", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id );
    });
    
    socket.on("check-status", () => {
      //step 01: Emit to user affter loggin or f5 web page
      let listUserOnline = Object.keys(clients);
      socket.emit("server-send-when-list-user-online", listUserOnline);

      //step 02 Emit to all another users when has user online
      socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);
    })
   
  socket.on("disconnect", () => {
    clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
    socket.request.user.chatGroupIds.forEach(group => {
      clients = removeSocketIdFromArray(clients, group._id, socket );
      });
      //step 03:Emit to all another users when has user offline
      socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);
  });
  });
}

module.exports = userOnlineOffline;