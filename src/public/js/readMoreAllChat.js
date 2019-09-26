
$(document).ready(function() {
  $("#link-read-more-all-chat").bind("click", function() {
    let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
    let skipGroup = $("#all-chat").find("li.group-chat").length;

    //cho cai loader hien thi(cai xoay trong as)
    $("#link-read-more-all-chat").css("display", "none");
    $(".read-more-all-chat-loader").css("display", "inline-block");
  
   
      $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data) {
       if(data.leftSideData.trim() === "") {
        alertify.notify("Ban khong con cuoc tro chuyen nao de xem nua ca", "error", 7);
  
        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loader").css("display", "none");
        return false;
       }
       // step 01: hadle leftside
       $("#all-chat").find("ul").append(data.leftSideData);

       // step 02: handel scroll
       resizeNineScrollLeft();
       nineScrollLeft();
       ///console.log(data.rightSideData);

       // step 03: handle rightside
       $("#screen-chat").append(data.rightSideData);

       // step 04: call function screenChat
       changeScreenChat();
       
       // step 05: convert emoji 
       // steo 06 handle imagemodal
       $("body").append(data.imageModalData);

       // step 07: call function grid photo
       gridPhotos(5);

       // step 08: handle attach modal
       $("body").append(data.attachModalData);
       $("body").append(data.membersModalData);

       // step 09: update-online
       socket.emit("check-status");
       // step 10: remove loading
        $("#link-read-more-all-chat").css("display", "inline-block");
        $(".read-more-all-chat-loader").css("display", "none");

        // Step 11: call readMoreMessage
        // kiểm tra chưa có bạn bè thì thông báo để kết bạn
     
        readMoreMessages();

        notYetConversation();
        // click vao tro chuyen
        userTalk() ;
        zoomImageChat();
      });
  });
});