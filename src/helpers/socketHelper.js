export let pushSocketIdToArray = (clients, userId, socketId) => {
  if(clients[userId]) {
    clients[currentUserId].push(socket.id);  //khi nguoi dung f5 hoac sang tab moi thi push vao
    
  }else {
    clients[userId] = [socketId]; //nguoi dung lan dau truy cap khoi tao lun gias tri 
  }
  return clients;
};
export let emitNotifyToArray = (clients, userId, io, eventName, data) => {
  clients[userId].forEach(socketId => {
    //io.sockets.emit("response-add-new-contact", currentUser); truong hop nay ca ben gui va ben nhan dau nhan duoc ke qua
    return io.sockets.connected[socketId].emit(eventName, data); //chi co ben nhan moi nhan duoc
  })
};
export let removeSocketIdFromArray = (clients, userId, socket) => {
  clients[userId] = clients[userId].filter(socketId => {
    return socketId !== socket.id; //xoa cai socket id cu va giu lai socket id moi
  });
  //khi nguoi dung tat di ngu hoac dang xuat
  if(!clients[userId].length) {
    delete clients[userId];
  }
  return clients;
};