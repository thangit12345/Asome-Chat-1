
function removeRequestContactSent() {
  $(".user-remove-request-contact-sent").unbind("click").on("click", function() {
    // unbind co nghia la dõ bỏ các sự kiện click trước đó...
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    $.ajax({
      url: "/contact/remove-request-contact-sent",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        //console.log(data);
        if(data.success) {
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).hide();//tim ra class user-add-new-contact ma co data-uid = tagetId
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css("display", "inline-block");
         
          decreaseNumberNotification("noti_contact_counter", 1);

          decreaseNumberNotisContact("count-request-contact-sent");

          //xoa o modal tab dang cho xac nhan
          $("#request-contact-sent").find(`li[data-uid=${targetId}]`).remove();
          // xu ly realtimes
          socket.emit("remove-request-contact-sent", {contactId: targetId}); 
        }
      }
    });
  });
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-remove-request-contact-sent", function(user) {
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove(); //remove within popup notification
  $(".list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove(); //remove within modal notification
  //cai tren chi xoa the div co data-uid ma ko xoa the li vi vay ta them parent de xoa the li ko de bi du
  //xoa o modal tab yeu cau ket bans
  $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();
  
  decreaseNumberNotisContact("count-request-contact-received", 1);
  

  decreaseNumberNotification("noti_contact_counter", 1);
  decreaseNumberNotification("noti_counter", 1);

});

$(document).ready(function() {
  removeRequestContactSent();
});