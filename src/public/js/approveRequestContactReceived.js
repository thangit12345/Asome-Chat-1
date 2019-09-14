
function approveRequestContactReceived() {
  $(".user-approve-request-contact-received").unbind("click").on("click", function() {
    // unbind co nghia la dõ bỏ các sự kiện click trước đó...
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
   
    $.ajax({
      url: "/contact/approve-request-contact-received",
      type: "put",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          let userInfo = $("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
          $(userInfo).find("div.user-approve-request-contact-received").remove();
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          $(userInfo).find("div.contactPanel")
            .append(
              `
              <div class="user-talk" data-uid="${targetId}">
                  Trò chuyện
              </div>
              <div class="user-remove-contact action-danger" data-uid="${targetId}">
                  Xóa liên hệ
              </div>
              `);
      
          let userInfoHtml = userInfo.get(0).outerHTML;
          $("#contacts").find("ul").prepend(userInfoHtml);
          $(userInfo).remove();
      
          decreaseNumberNotisContact("count-request-contact-received");
          increaseNumberNotisContact("count-contacts");

          decreaseNumberNotification("noti_contact_counter", 1);
        // xu ly realtimes
          socket.emit("approve-request-contact-received", {contactId: targetId}); 
        }
      }
    });
  });
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-approve-request-contact-received", function(user) {
  let notify = `<div class="notif-readed-false" data-uid="${ user.id }">
                  <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                  <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn của bạn !
                </div>`;
  
  //add notify within notification popup
  $(".noti_content").prepend(notify);
  //add notify within notification modal
  $("ul.list-notifications").prepend(`<li>${notify}</li>`);
   //sử lý count number bên nguoir gửi
  decreaseNumberNotification("noti_contact_counter", 1);
  increaseNumberNotifycation("noti_counter", 1);

  decreaseNumberNotisContact("count-request-contact-sent");
  increaseNumberNotisContact("count-contacts");
  
  $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
  let userInfoHtml = `
      <li class="_contactList" data-uid="${user.id}">
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
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
      </li>
  `;
  $("#contacts").find("ul").prepend(userInfoHtml);
});

$(document).ready(function() {
  approveRequestContactReceived();
});