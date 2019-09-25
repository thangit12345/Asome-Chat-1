function readMoreMessages() {
  $(".right .chat").unbind("scroll").on("scroll", function() {
    // get the fist message
    let firstMessage = $(this).find(".bubble:first");
    // get position of first message
    let currentOffset = firstMessage.offset().top - $(this).scrollTop();

    if($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
      $(this).prepend(messageLoading);

      let targetId = $(this).data("chat");
      let skipMessage = $(this).find('div.bubble').length;
      let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;

      let thisDom = $(this);
      setTimeout(() => {
        $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data) {
          if(data.rightSideData.trim() === "") {
            alertify.notify("Ban khong con cuoc Tin nhan nao de xem nua ca", "error", 7);
      
            thisDom.find("img.message-loading").remove();
            return false;
           }
            // extras
            notYetConversation();

            // click vao tro chuyen
            userTalk() ;
            zoomImageChat();
           // Step 01: hadle rightSide
           $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
  
           // Step 02: prepent Scroll
           $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffset);
           
           // Step 03: covert emoji
  
           // Step 04: handle imagemodal
           $(`#imagesModal_${targetId}`).find("div.all-image").append(data.imageModalData);
  
           // Step 05: call gridphoto
           gridPhotos(5);
  
           // Step 06 handle attach modal
           $(`#attachModal_${targetId}`).find("ul.list-attachs").append(data.attachModalData);
  
           // Step 07: remove message loading
           thisDom.find("img.message-loading").remove();

          
        });
      }, 1000);
    }
  });
}

$(document).ready(function() {
  readMoreMessages();
});