
function approveRequestContactReceived() {
  $(".user-approve-request-contact-received").unbind("click").on("click", function() {
    // unbind co nghia la dõ bỏ các sự kiện click trước đó...
    let targetId = $(this).data("uid"); //lay data-uid cua the inpyt
    let targetName = $(this).parent().find("div.user-name>p").text().trim();
    let targetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");

    $.ajax({
      url: "/contact/approve-request-contact-received",
      type: "put",
      data: {uid: targetId},
      success: function(data) {
        if(data.success) {
          let userInfo = $("#request-contact-received").find(`ul li[data-uid=${targetId}]`);
          $(userInfo).find("div.user-approve-request-contact-received").remove();
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          $(userInfo).find("div.contactPanel")
            .append(
              `
              <div class="user-talk" data-uid="${targetId}">
                  Trò chuyện
              </div>
              <div class="user-remove-contact action-danger" data-uid="${targetId}">
                  Xóa liên hệ
              </div>
              `);
      
          let userInfoHtml = userInfo.get(0).outerHTML;
          $("#contacts").find("ul").prepend(userInfoHtml);
          $(userInfo).remove();
      
          decreaseNumberNotisContact("count-request-contact-received");
          increaseNumberNotisContact("count-contacts");

          decreaseNumberNotification("noti_contact_counter", 1);

          removeContact();
        // xu ly realtimes
          socket.emit("approve-request-contact-received", {contactId: targetId}); 
          // all steps handle chat after approve contact
          //step 01
          //$("#contactsModal").modal("hide");

          // step 02: handel leftside.ejs
          let subUserName = targetName;
          if(subUserName.length > 15) {
            subUserName = subUserName.substr(0, 14)+"...";
          }
          let leftSideData = `
                  <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
                  <li class="person" data-chat="${targetId}">
                      <div class="left-avatar">
                          <div class="dot"></div>
                          <img src="${targetAvatar}" alt="">
                      </div>
                      <span class="name">
                             ${subUserName}
                      </span>
                      <span class="time">
                      </span>
                      <span class="preview">
                         </span>
                       </li>
                     </a>
          `;
          $("#all-chat").find("ul").prepend(leftSideData);
          $("#user-chat").find("ul").prepend(leftSideData);

          let rightSideData = `
                      <div class="right tab-pane " data-chat="${targetId}" id="to_${targetId}" >
                        <div class="top">
                          <span>To: <span class="name">${targetName}</span></span>
                          <span class="chat-menu-right">
                              <a href="#attachsModal_${targetId}" class="show-attachs" data-toggle="modal">
                                  Tệp đính kèm
                                  <i class="fa fa-paperclip"></i>
                              </a>
                          </span>
                          <span class="chat-menu-right">
                              <a href="javascript:void(0)">&nbsp;</a>
                          </span>
                          <span class="chat-menu-right">
                              <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                                  Hình ảnh
                                  <i class="fa fa-photo"></i>
                              </a>
                          </span>
                        </div>
                        <div class="content-chat">
                            <div class="chat" data-chat="${targetId}"></div>
                      </div>
                      <div class="write" data-chat="${targetId}">
                          <input type="text" class="write-chat" id="write-chat-${targetId}" data-chat="${targetId}">
                          <div class="icons">
                              <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                              <label for="image-chat-${targetId}">
                                  <input type="file" id="image-chat-${targetId}" name="my-image-chat" class="image-chat" data-chat="${targetId}">
                                  <i class="fa fa-photo"></i>
                              </label>
                              <label for="attach-chat-${targetId}">
                                  <input type="file" id="attach-chat-${targetId}" name="my-attach-chat" class="attach-chat" data-chat="${targetId}">
                                  <i class="fa fa-paperclip"></i>
                              </label>
                              <a href="javascript:void(0)" id="video-chat-${targetId}" class="video-chat" data-chat="${targetId}">
                                  <i class="fa fa-video-camera"></i>
                              </a>
                          </div>
                      </div>
                     </div>
                   `;
        $("#screen-chat").prepend(rightSideData);
        //step 04: call function changeScreenChat
        changeScreenChat();

        // step 05: handle image madal
       let imageModalData =  `
       <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
       <div class="modal-dialog modal-lg">
               <div class="modal-content">
                   <div class="modal-header">
                       <button type="button" class="close" data-dismiss="modal">&times;</button>
                       <h4 class="modal-title">All Images in this conversation. ${targetId}</h4>
                   </div>
                   <div class="modal-body">
                       <div class="all-images" style="visibility: hidden;">
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        $("body").append(imageModalData);
          
        // step 06 : call function gridphotos 
        gridPhotos(5);

        // step 07: hadel attachment modal 
        let attachModalData = `
                <div class="modal fade" id="attachsModal_${targetId}" role="dialog">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">All Attachs in this conversation.</h4>
                          </div>
                          <div class="modal-body">
                              <ul class="list-attachs">
                              </ul>
                          </div>
                      </div>
                  </div>
                </div>
        `;

        $("body").append(attachModalData);

        // step 8: update online
        socket.emit("check-status");
        }
      }
    });
  });
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-approve-request-contact-received", function(user) {
  let notify = `<div class="notif-readed-false" data-uid="${ user.id }">
                  <img class="avatar-small" src="images/users/${ user.avatar }" alt=""> 
                  <strong>${ user.username }</strong> đã chấp nhận lời mời kết bạn của bạn !
                </div>`;
  
  //add notify within notification popup
  $(".noti_content").prepend(notify);
  //add notify within notification modal
  $("ul.list-notifications").prepend(`<li>${notify}</li>`);
   //sử lý count number bên nguoir gửi
  decreaseNumberNotification("noti_contact_counter", 1);
  increaseNumberNotifycation("noti_counter", 1);

  decreaseNumberNotisContact("count-request-contact-sent");
  increaseNumberNotisContact("count-contacts");
  
  $("#request-contact-sent").find(`ul li[data-uid=${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid=${user.id}]`).remove();
  let userInfoHtml = `
      <li class="_contactList" data-uid="${user.id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>&nbsp ${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user.id}">
                Trò chuyện
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Xóa liên hệ
            </div>
        </div>
      </li>
  `;
  
  $("#contacts").find("ul").prepend(userInfoHtml);
  removeContact();

  // all steps handle chat after approve contact
  //truong hop sau khi nhan dong y ket ban
  //step 01: handel leftside.ejs

    $("#contactsModal").modal("hide");
    // step 02: handel leftside.ejs
    let subUserName = user.username;
    if(subUserName.length > 15) {
      subUserName = subUserName.substr(0, 14)+"...";
    }
    let leftSideData = `
            <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
            <li class="person" data-chat="${user.id}">
                <div class="left-avatar">
                    <div class="dot"></div>
                    <img src="images/users/${user.avatar}" alt="">
                </div>
                <span class="name">
                        ${subUserName}
                </span>
                <span class="time">
                </span>
                <span class="preview">
                    </span>
                  </li>
                </a>
    `;
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#user-chat").find("ul").prepend(leftSideData);

    let rightSideData = `
                <div class="right tab-pane " data-chat="${user.id}" id="to_${user.id}" >
                  <div class="top">
                    <span>To: <span class="name">${user.username}</span></span>
                    <span class="chat-menu-right">
                        <a href="#attachsModal_${user.id}" class="show-attachs" data-toggle="modal">
                            Tệp đính kèm
                            <i class="fa fa-paperclip"></i>
                        </a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="javascript:void(0)">&nbsp;</a>
                    </span>
                    <span class="chat-menu-right">
                        <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                            Hình ảnh
                            <i class="fa fa-photo"></i>
                        </a>
                    </span>
                  </div>
                  <div class="content-chat">
                      <div class="chat" data-chat="${user.id}"></div>
                </div>
                <div class="write" data-chat="${user.id}">
                    <input type="text" class="write-chat" id="write-chat-${user.id}" data-chat="${user.id}">
                    <div class="icons">
                        <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                        <label for="image-chat-${user.id}">
                            <input type="file" id="image-chat-${user.id}" name="my-image-chat" class="image-chat" data-chat="${user.id}">
                            <i class="fa fa-photo"></i>
                        </label>
                        <label for="attach-chat-${user.id}">
                            <input type="file" id="attach-chat-${user.id}" name="my-attach-chat" class="attach-chat" data-chat="${user.id}">
                            <i class="fa fa-paperclip"></i>
                        </label>
                        <a href="javascript:void(0)" id="video-chat-${user.id}" class="video-chat" data-chat="${user.id}">
                            <i class="fa fa-video-camera"></i>
                        </a>
                    </div>
                </div>
                </div>
              `;
  $("#screen-chat").prepend(rightSideData);
  //step 04: call function changeScreenChat
  changeScreenChat();

  // step 05: handle image madal
  let imageModalData =  `
  <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
  <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">All Images in this conversation. ${user.id}</h4>
              </div>
              <div class="modal-body">
                  <div class="all-images" style="visibility: hidden;">
                      
                  </div>
              </div>
          </div>
      </div>
  </div>
  `;
  $("body").append(imageModalData);
    
  // step 06 : call function gridphotos 
  gridPhotos(5);

  // step 07: hadel attachment modal 
  let attachModalData = `
          <div class="modal fade" id="attachsModal_${user.id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">All Attachs in this conversation.</h4>
                    </div>
                    <div class="modal-body">
                        <ul class="list-attachs">
                        </ul>
                    </div>
                </div>
            </div>
          </div>
  `;

  $("body").append(attachModalData);

  // step 8: update online
  socket.emit("check-status");
});

$(document).ready(function() {
  approveRequestContactReceived();
});