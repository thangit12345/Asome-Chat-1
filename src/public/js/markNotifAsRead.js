function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: {targetUsers: targetUsers},
    success: function(result) {
      // console.log(result);
      if(result) {
        targetUsers.forEach(function(uid) {
          $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif-readed-false");
          $("ul.list-notifications").find(`li>div[data-uid=${uid}]`).removeClass("notif-readed-false");;

        });
        decreaseNumberNotification("noti_counter", targetUsers.length);
      }
    }
  });
}

$(document).ready(function() {
  //link at popup notification
  $("#popup-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];
    $(".noti_content").find("div.notif-readed-false").each(function(index, notification) {
      targetUsers.push($(notification).data("uid"));
    });//cai tren tra ve ket qua mang cua jquery nen ko dung forEach dc ma dung each cua jquery
    //console.log(targetUsers);
    if(!targetUsers) {
      alertify.notify("Ban khong co thong bao nao chua doc", "error", 7);
      return false;
    }
    markNotificationsAsRead(targetUsers);
  });
  //link at modal notification
  $("#modal-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];
    $("ul.list-notifications").find("li>div.notif-readed-false").each(function(index, notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers) {
      alertify.notify("Ban khong co thong bao nao chua doc", "error", 7);
      return false;
    }
    markNotificationsAsRead(targetUsers);
    //console.log(targetUsers);
  });
});