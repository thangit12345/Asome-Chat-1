

function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    $.post("/contact/add-new", {uid: targetId}, function(data) {
     // console.log(data);
      if(data.success) {
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();//tim ra class user-add-new-contact ma co data-uid = tagetId
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display", "inline-block");
        increaseNumberNotisContact("count-request-contact-sent", 1);
        // xu ly realtime
        socket.emit("add-new-contact", {contactId: targetId}); //bien socket da khoi taoj trong file main.js
        
      }
    })
  });
}

socket.on("response-add-new-contact", function(user) {
  let notify = `<div class="notif-readed-false" data-uid="${ user.id }">
                  <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                  <strong>${ user.username }</strong> đã gửi cho bạn lời mời kết bạn !
                </div>`;
  
  //add notify within notification popup
  $(".noti_content").prepend(notify);
  //add notify within notification modal
  $("ul.list-notifications").prepend(`<li>${notify}</li>`);
  //prepend : cai moi nhat nam o tren
  //append: cai moi nhat nam o duoi,
  increaseNumberNotisContact("count-request-contact-received", 1);

  increaseNumberNotifycation("noti_contact_counter", 1);
  increaseNumberNotifycation("noti_counter", 1);

});

