
function removeRequestContact() {
  $(".user-remove-request-contact").bind("click", function() {
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    $.ajax({
      url: "/contact/remove-request-contact",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        //console.log(data);
        if(data.success) {
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide();//tim ra class user-add-new-contact ma co data-uid = tagetId
          $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).css("display", "inline-block");
          decreaseNumberNotisContact("count-request-contact-sent");
          // xu ly realtimes
          socket.emit("remove-request-contact", {contactId: targetId}); 
        }
      }
    });
  });
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-remove-request-contact", function(user) {
  $(".noti_content").find(`span[data-uid = ${user.id}]`).remove();
  //xoa o modal tab yeu cau ket ban
  decreaseNumberNotisContact("count-request-contact-received");

  decreaseNumberNotification("noti_contact_counter");
  decreaseNumberNotification("noti_counter");

});