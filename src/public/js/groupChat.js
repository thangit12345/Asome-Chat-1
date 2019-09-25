function addFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").bind("click", function() {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function(resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function(success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function() {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function(index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(element) {
  if(element.which === 13 || element.type === "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    if(!keyword.length) {
      alertify.notify("Chua nhap noi dung tim kiem", "error", 7);
      return false;
    }
    if(!regexKeyword.test(keyword)) {
      alertify.notify("Loi tu khoa tim kiem chi cho phep ky tu va so va khoang trang", "error", 7);
      return false;
    }
    //cai nay giong vs $.ajax 
    $.get(`/contact/search-friends/${keyword}`, function(data) {
      $("ul#group-chat-friends").html(data);
        // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
        addFriendsToGroup();

        // Action hủy việc tạo nhóm trò chuyện
        cancelCreateGroup();
    });
  } 
}
function callCreateGroupChat() {
  $("#btn-create-group-chat").unbind("click").on("click", function() {
    let countUsers = $("ul#friends-added").find("li");
    if(countUsers.length < 2) {
      alertify.notify("Chon it nhat toi thieu 2 nguoi ..Vui long chon lai","error", 7);
      return false;
    }
    let groupChatName = $("#input-name-group-chat").val();
    let regexGroupChatName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regexGroupChatName.test(groupChatName) || groupChatName.length < 5 || groupChatName.length > 30) {
      alertify.notify("Vui long nhap tên cuộc trò chuyên. giới hạn 5-30 ký tự và không chứa ký tự đặc biệt ! ","error", 7);
      return false;
    }

    let arrayIds = [];
    $("ul#friends-added").find("li").each(function(index, item) {
      arrayIds.push({"userId" :$(item).data("uid")});
    });

    Swal.fire({
      title: `Bạn có chắc muốn tạo nhóm &nbsp; ${groupChatName} ?`,
      type: "info", //warning
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      //console.log(result);
      if(!result.value) { // kích vào nut hủy
        return false;
      }
      $.post('/group-chat/add-new', {
        arrayIds: arrayIds,
        groupChatName: groupChatName
      }, function(data) {
        //success
       // step 01: hide modal create groupchat 
       $("#input-name-group-chat").val("");
       $("btn-cancel-group-chat").click();
       $("#groupChatModal").modal("hide");
       // step 02: handel leftside.ejs
       let subGroupChatName = data.groupChat.name;
       if(subGroupChatName.length > 15) {
        subGroupChatName = subGroupChatName.substr(0, 14)+"...";
       }
       let leftSideData = `
                        <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
                        <li class="person group-chat" data-chat="${data.groupChat._id}">
                            <div class="left-avatar">
                                <img src="images/users/group-avatar-trungquandev.png" alt="">
                            </div>
                            <span class="name">
                                <span class="group-chat-name">
                                 ${subGroupChatName}
                                </span> 
                            </span>
                            <span class="time"></span>
                            <span class="preview"></span>
                        </li>
                        </a>
                       `;
       
        $("#all-chat").find("ul").prepend(leftSideData);
        $("#group-chat").find("ul").prepend(leftSideData);

        //step 03: handel rightside
        let rightSideData = `
                    <div class="right tab-pane " data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}" >
                    <div class="top">
                        <span>To: <span class="name">${data.groupChat.name}</span></span>
                        <span class="chat-menu-right">
                            <a href="#attachsModal_${data.groupChat._id}" class="show-attachs" data-toggle="modal">
                                Tệp đính kèm
                                <i class="fa fa-paperclip"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                                Hình ảnh
                                <i class="fa fa-photo"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                                <span class="show-number-members">${data.groupChat.userAmount}</span>
                                <i class="fa fa-users"></i>
                            </a>
                        </span>

                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                                <span class="show-number-messages">${data.groupChat.messageAmount}</span>
                                <i class="fa fa-comment-o"></i>
                            </a>
                        </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat chat-in-group" data-chat="${data.groupChat._id}">
            
                        </div>
                    </div>
                    <div class="write" data-chat="${data.groupChat._id}">
                        <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${data.groupChat._id}">
                                <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attach-chat-${data.groupChat._id}">
                                <input type="file" id="attach-chat-${data.groupChat._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${data.groupChat._id}">
                                <i class="fa fa-paperclip"></i>
                            </label>
                            <a href="javascript:void(0)" id="video-chat-group">
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
                  <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
                  <div class="modal-dialog modal-lg">
                          <div class="modal-content">
                              <div class="modal-header">
                                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                                  <h4 class="modal-title">All Images in this conversation. ${data.groupChat._id}</h4>
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
                <div class="modal fade" id="attachsModal_${data.groupChat._id}" role="dialog">
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

        //step 08: Emit new group created
        socket.emit("new-group-created", {groupChat: data.groupChat});
       // step 09: nothing to code
       
        // step 10: update online
        socket.emit("check-status");
      })
      .fail(function(response) {
        alertify.notify(response.responseText,"error", 7);
      });
    });
  }); 
}

$(document).ready(function() {
  $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
  callCreateGroupChat();

  socket.on("response-new-group-created", function(response) {
    // step 01: hide modal create groupchat : nothing to code
    // step 02: handel leftside.ejs
    let subGroupChatName = response.groupChat.name;
    if(subGroupChatName.length > 15) {
     subGroupChatName = subGroupChatName.substr(0, 14)+"...";
    }
    let leftSideData = `
                     <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
                     <li class="person group-chat" data-chat="${response.groupChat._id}">
                         <div class="left-avatar">
                             <img src="images/users/group-avatar-trungquandev.png" alt="">
                         </div>
                         <span class="name">
                             <span class="group-chat-name">
                              ${subGroupChatName}
                             </span> 
                         </span>
                         <span class="time"></span>
                         <span class="preview"></span>
                     </li>
                     </a>
                    `;
    
     $("#all-chat").find("ul").prepend(leftSideData);
     $("#group-chat").find("ul").prepend(leftSideData);

     //step 03: handel rightside
     let rightSideData = `
                 <div class="right tab-pane " data-chat="${response.groupChat._id}" id="to_${response.groupChat._id}" >
                 <div class="top">
                     <span>To: <span class="name">${response.groupChat.name}</span></span>
                     <span class="chat-menu-right">
                         <a href="#attachsModal_${response.groupChat._id}" class="show-attachs" data-toggle="modal">
                             Tệp đính kèm
                             <i class="fa fa-paperclip"></i>
                         </a>
                     </span>
                     <span class="chat-menu-right">
                         <a href="javascript:void(0)">&nbsp;</a>
                     </span>
                     <span class="chat-menu-right">
                         <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
                             Hình ảnh
                             <i class="fa fa-photo"></i>
                         </a>
                     </span>
                     <span class="chat-menu-right">
                         <a href="javascript:void(0)">&nbsp;</a>
                     </span>
                     <span class="chat-menu-right">
                         <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                             <span class="show-number-members">${response.groupChat.userAmount}</span>
                             <i class="fa fa-users"></i>
                         </a>
                     </span>

                     <span class="chat-menu-right">
                         <a href="javascript:void(0)">&nbsp;</a>
                     </span>
                     <span class="chat-menu-right">
                         <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                             <span class="show-number-messages">${response.groupChat.messageAmount}</span>
                             <i class="fa fa-comment-o"></i>
                         </a>
                     </span>
                 </div>
                 <div class="content-chat">
                     <div class="chat chat-in-group" data-chat="${response.groupChat._id}">
         
                     </div>
                 </div>
                 <div class="write" data-chat="${response.groupChat._id}">
                     <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
                     <div class="icons">
                         <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                         <label for="image-chat-${response.groupChat._id}">
                             <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                             <i class="fa fa-photo"></i>
                         </label>
                         <label for="attach-chat-${response.groupChat._id}">
                             <input type="file" id="attach-chat-${response.groupChat._id}" name="my-attach-chat" class="attach-chat chat-in-group" data-chat="${response.groupChat._id}">
                             <i class="fa fa-paperclip"></i>
                         </label>
                         <a href="javascript:void(0)" id="video-chat-group">
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
               <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
               <div class="modal-dialog modal-lg">
                       <div class="modal-content">
                           <div class="modal-header">
                               <button type="button" class="close" data-dismiss="modal">&times;</button>
                               <h4 class="modal-title">All Images in this conversation. ${response.groupChat._id}</h4>
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
             <div class="modal fade" id="attachsModal_${response.groupChat._id}" role="dialog">
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

     //step 08: Emit new group created : nothing to code

     // step 09: Emit when number received a group chat
     socket.emit("member-received-group-chat", {groupChatId: response.groupChat._id});
  
    // step 10: update online
    socket.emit("check-status");
    });
});