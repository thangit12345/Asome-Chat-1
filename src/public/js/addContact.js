

function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    $.post("/contact/add-new", {uid: targetId}, function(data) {
     // console.log(data);
      if(data.success) {
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();//tim ra class user-add-new-contact ma co data-uid = tagetId
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).css("display", "inline-block");
        
        increaseNumberNotifycation("noti_contact_counter", 1);// js/caculateNotification.js

        increaseNumberNotisContact("count-request-contact-sent");// js/caculateNotifcontct.js
        // khi nhan vao them ban be thi ben tab dang cho xac nhan hien len
        let userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML;
        $("#request-contact-sent").find("ul").prepend(userInfoHtml);

        removeRequestContactSent(); //js/removeRequestContactSend.js
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
  increaseNumberNotisContact("count-request-contact-received");

  increaseNumberNotifycation("noti_contact_counter", 1);
  increaseNumberNotifycation("noti_counter", 1);

  //khi nhan them ban be thi ben tab yeu cau ket ban cua then khac add vao 
  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="">
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br>
                            <div class="user-address">
                                <span>&nbsp ${user.address}</span>
                            </div>
                            <div class="user-acccept-contact-received" data-uid="${user.id}">
                                Chấp nhận
                            </div>
                            <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                Xóa yêu cầu
                            </div>
                        </div>
                      </li>`;
  $("#request-contact-received").find("ul").prepend(userInfoHtml);

  removeRequestContactReceived(); //js/removeRequestContacteReceived.js

});

