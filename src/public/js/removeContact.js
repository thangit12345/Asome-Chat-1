
function removeContact() {
  $(".user-remove-contact").unbind("click").on("click", function() {
    // unbind co nghia la dõ bỏ các sự kiện click trước đó...
    let targetId = $(this).data("uid");
    let username = $(this).parent().find("div.user-name p").text(); //lay data-uid cua the inpyt
    console.log(targetId,username);
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ ?`,
      text: "Bạn không thể hoàn tác lại quá trình này !",
      type: "warning", //warning
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      //console.log(result);
      if(!result.value) {
        return false;
      }
     
      $.ajax({
        url: "/contact/remove-contact",
        type: "delete",
        data: {uid: targetId},
        success: function(data) {
          if(data.success) {
            console.log("thang");
            $("#contacts").find(`ul li[data-uid=${targetId}]`).remove();
            decreaseNumberNotisContact("count-contacts");
        
          // xu ly realtimes
            socket.emit("remove-contact", {contactId: targetId}); 

            // all step handel chat after remove contact
            //step 0: Check active
            let checkActive = $("#all-chat").find(`li[data-chat=${targetId}]`).hasClass("active");
            //step 01: remove leftside
            $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
            $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

            //step 02: remove rightside.ejs
            $("#screen-chat").find(`div#to_${targetId}`).remove();
            //step 03: remove imageModal
            $("body").find(`#imagesModal_${targetId}`).remove();
            //step 04: remove attachModal
            $("body").find(`#attachsModal_${targetId}`).remove();
            // step 05: click fish conversation on leftbar
            if(checkActive) {
              $("ul.people").find("a")[0].click(); //click vao then dau tien
            }
          }
        }
      });
    });
  });

 
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-remove-contact", function(user) {
  //console.log(user);
  $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotisContact("count-contacts");
   
  // all step handel chat after remove contact
  //step 0: Check active
  let checkActive = $("#all-chat").find(`li[data-chat=${user.id}]`).hasClass("active");
  //step 01: remove leftside
  $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

  //step 02: remove rightside.ejs
  $("#screen-chat").find(`div#to_${user.id}`).remove();
  //step 03: remove imageModal
  $("body").find(`#imagesModal_${user.id}`).remove();
  //step 04: remove attachModal
  $("body").find(`#attachsModal_${user.id}`).remove();
  // step 05: click fish conversation on leftbar
  if(checkActive) {
    $("ul.people").find("a")[0].click(); //click vao then dau tien
  }
});

$(document).ready(function() {
  removeContact();
});