function attachChat(divId) {
  $(`#attach-chat-${divId}`).unbind("change").on("change", function() {
    let fileData = $(this).prop("files")[0];
    let limit = 1048576; //byte = 1MB

    if(fileData.size > limit) {
      alertify.notify("Tệp tin đính kèm toi da cho phep 1mb", "error", 7);
      $(this).val(null);
      return false;
    }
    let targetId = $(this).data("chat");
    let isChatGroup = false;

    let messageFormData = new FormData();
    messageFormData.append("my-attach-chat", fileData);
    messageFormData.append("uid", targetId);

    if($(this).hasClass("chat-in-group")) {
      messageFormData.append("isChatGroup", true);
      isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-attach",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function(data) {
        let dataToEmit = {
          message: data.message
        };
        // step 01: handle message data before show
        let messageOfMe = $(` <div class="bubble me bubble-attach-file"  data-mess-id="${data.message._id}"></div>`)
       
        let attachChat = ` <a href="data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)} "  download="${bufferToBase64(data.message.file.fileName)}">
                              ${data.message.file.fileName}
                          </a>`;

        if(isChatGroup) {
         let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${attachChat}`);
         // messageOfMe.text(data.message.text);
          //console.log(messageOfMe.html());
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        }else {
          messageOfMe.html(`${attachChat}`);

          dataToEmit.contactId = targetId;
        }

        // step 02: append messge data to screen
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        // step 03 : remove all data at cell input: nothing to code

         // step 04 : change data preview & time in leftside
         $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf('seconds').fromNow());
         $(`.person[data-chat=${divId}]`).find("span.preview").html("Tep dinh kem...");

          //step 05
          $(`.person[data-chat=${divId}]`).on("levanthang.moveConversationToTheTop", function() {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove); //tim cai gan nhat
            $(this).off("levanthang.moveConversationToTheTop"); //dong su kien nay lai
          });
          //$(`.person[data-chat=${divId}]`).click();     
          $(`.person[data-chat=${divId}]`).trigger("levanthang.moveConversationToTheTop");
          
          // step 06 L emit realtime
          socket.emit("chat-attach", dataToEmit);

           // step 07: emit  remove typing real-time: nothing to code
        // step 08: if this has typing , remove that imediately : nothing to code
          //37
        //step 09: add image to model attachment
        
        let attachChatToAddModal = `<li>
                                      <a href="data: ${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)} "  download="${data.message.file.fileName}">
                                      ${data.message.file.fileName}
                                      </a>
                                  </li>`;

        $(`#attachsModal__${divId}`).find("ul.list-attachs").append(attachChatToAddModal);
      },
      error: function(error) {
       alertify.notify(error.responseText, "error", 7);
      }
    });

  });
}

$(document).ready(function() {
  socket.on("response-chat-attach", function(response) {
    let divId = "";
    // step 01: handle message data before show
    let messageOfYou = $(` <div class="bubble you bubble-attach-file" data-mess-id="${response.message._id}"></div>`);
    
    let attachChat = ` <a href="data: ${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)} "  download="${bufferToBase64(response.message.file.fileName)}">
                          ${response.message.file.fileName}
                        </a>`;
                          
    if(response.currentGroupId) {
     let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${attachChat}`);

      divId = response.currentGroupId;

      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
       increaseNumberMessageGroup(divId);
      }
    }else {
      messageOfYou.html(attachChat);
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
      $(`.person[data-chat=${divId}]`).find("span.preview").html("Tep dinh kem...");

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

       //step 09: add image to model image
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        let attachChatToAddModal = `<li>
                                        <a href="data: ${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)} "  download="${response.message.file.fileName}">
                                        ${response.message.file.fileName}
                                        </a>
                                    </li>`;

        $(`#attachsModal__${divId}`).find("ul.list-attachs").append(attachChatToAddModal);
      }

  });
});