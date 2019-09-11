/**
 * 
 * @param io from socket.io lib 
 */
let addNewContact = (io) => {
  io.on("connection", (socket) => { //connnection khi nguoi dung vao trng web no sex chay
    socket.on("add-new-contact", (data) => {
      console.log(data);
      console.log(socket.request.user); //muon lay cai nay thi phai cai them
      //thu vien passports.socketio va cookieparse
      
    });
  });
}

module.exports = addNewContact;