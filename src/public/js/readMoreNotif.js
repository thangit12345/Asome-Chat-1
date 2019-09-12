$(document).ready(function() {
  $("#link-read-more-notif").bind("click", function() {
    let skipNumber = $("ul.list-notifications").find("li").length;
    
    //cho cai loader hien thi(cai xoay trong as)
    $("#link-read-more-notif").css("display", "none");
    $(".read-more-notif-loader").css("display", "inline-block");
  
    setTimeout(() => {
      $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(newNotifications) {
        console.log(newNotifications.length);
        if(!newNotifications.length) {
          alertify.notify("Ban khong con thong bao nao de xem nua ca", "error", 7);
  
          $("#link-read-more-notif").css("display", "inline-block");
          $(".read-more-notif-loader").css("display", "none");
          return false;
        }
        newNotifications.forEach(function(notification) {
          $("ul.list-notifications").append(`<li>${notification}</li>`); //modal notif
        });
  
        $("#link-read-more-notif").css("display", "inline-block");
        $(".read-more-notif-loader").css("display", "none");
      });
    }, 1000);
  });
});