
function textAndEmojichat(divId) {
  $(".emojionearea ").unbind("keyup").on("keyup", function(element) {
    let currentEmojioneArea = $(this);
    if(element.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal =  $(`#write-chat-${divId}`).val();

      if(!targetId.length || !messageVal.length) {
        return false;
      }
      //23
      let dataTextEmojiForSend = {
        uid: targetId,
        messageVal: messageVal
      };
      
      if($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }
      //console.log(dataTextEmojiForSend);
      //call send message
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
        //success
        let dataToEmit = {
          message: data.message
        };
        // step 01: handle message data before show
        let messageOfMe = $(` <div class="bubble me" data-mess-id="${data.message._id}"></div>`)
        
        if(dataTextEmojiForSend.isChatGroup) {
         let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />${data.message.text}`;
          messageOfMe.html(`${senderAvatar}`);
         // messageOfMe.text(data.message.text);
          //console.log(messageOfMe.html());
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        }else {
          messageOfMe.text(data.message.text);
          dataToEmit.contactId = targetId;
        }
        // step 02: append messge data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // step 03 : remove all data at cell input
        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");
     
        // step 04 : change data preview & time in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf('seconds').fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);

        // step 05: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("levanthang.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove); //tim cai gan nhat
          $(this).off("levanthang.moveConversationToTheTop"); //dong su kien nay lai
        });
        //$(`.person[data-chat=${divId}]`).click();     
        $(`.person[data-chat=${divId}]`).trigger("levanthang.moveConversationToTheTop");

        // step 06 L emit realtime
        socket.emit("chat-text-emoji", dataToEmit);

        // step 07: emit  remove typing real-time
        typingOff(divId);

        // step 08: if this has typing , remove that imediately
        let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
        if(checkTyping.length) {
          checkTyping.remove();
        }

      }).fail(function(response) {
        //error
        alertify.notify(response.responseText, "error", 7);
      });
    }
  });
}

$(document).ready(function() {
  socket.on("response-chat-text-emoji", function(response) {
   let divId = "";
   // step 01: handle message data before show
    let messageOfYou = $(` <div class="bubble you" data-mess-id="${response.message._id}"></div>`)
        
        if(response.currentGroupId) {
         let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />${response.message.text}`;
          messageOfYou.html(`${senderAvatar}`);

          divId = response.currentGroupId;

          if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
           increaseNumberMessageGroup(divId);
          }
        }else {
          messageOfYou.text(response.message.text);
          divId = response.currentUserId;
        }
        // step 02: append messge data to screen
        if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
          $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
          nineScrollRight(divId);
          $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
        }
        // step 03 : remove all data at cell input: nothing to code

        // step 04 : change data preview & time in leftside
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createAt).locale("vi").startOf('seconds').fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text);

        // step 05: move conversation to the top
        $(`.person[data-chat=${divId}]`).on("levanthang.moveConversationToTheTop", function() {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove); //tim cai gan nhat
          $(this).off("levanthang.moveConversationToTheTop"); //dong su kien nay lai
        });
        //$(`.person[data-chat=${divId}]`).click();     
        $(`.person[data-chat=${divId}]`).trigger("levanthang.moveConversationToTheTop");
         // step 06 L emit realtime : nothing to code
         // step 07: emit remove typing realtime: nothing to code
         //step 08: if this has typing , remove that imediately: nothing to code
  });
});