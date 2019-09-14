
function removeRequestContactReceived() {
  $(".user-remove-request-contact-received").unbind("click").on("click", function() {
    // unbind co nghia la dõ bỏ các sự kiện click trước đó...
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        //console.log(data);
        if(data.success) {
          //chuc nang nay ko muon lam(khong muon xoa thong bao )
          // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //remove within popup notification
          // $(".list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); 
          //  decreaseNumberNotification("noti_counter", 1);
          
          decreaseNumberNotification("noti_contact_counter", 1);

          decreaseNumberNotisContact("count-request-contact-received");

          //xoa o modal tab yeu cau ket bans
          $("#request-contact-received").find(`li[data-uid=${targetId}]`).remove();
          // xu ly realtimes
          socket.emit("remove-request-contact-received", {contactId: targetId}); 
        }
      }
    });
  });
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-remove-request-contact-received", function(user) {
  $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();//tim ra class user-add-new-contact ma co data-uid = tagetId
  $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css("display", "inline-block");
        
  
   //xoa o modal tab dang cho xac nhan
   $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();
  
  
  decreaseNumberNotisContact("count-request-contact-sent");
  

  decreaseNumberNotification("noti_contact_counter", 1);


});

$(document).ready(function() {
  removeRequestContactReceived();
});