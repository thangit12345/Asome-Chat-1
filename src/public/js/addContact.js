

function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    $.post("/contact/add-new", {uid: targetId}, function(data) {
      console.log(data);
      if(data.success) {
        $("#find-user").find(`div.user-add-new-contact[data-uid=${targetId}]`).hide();//tim ra class user-add-new-contact ma co data-uid = tagetId
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${targetId}]`).css("display", "inline-block");
        increaseNumberNotisContact("count-request-contact-sent");
        // xu ly realtime

      }
    })
  });
}

