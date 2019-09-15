
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
           // sau nay lam chu nang chat thi se xoa tiep user o phan chat
  
          // xu ly realtimes
            socket.emit("remove-contact", {contactId: targetId}); 
          }
        }
      });
    });
  });

 
}

//khi nguoi dung huy yeu cau ket ban thi xao thong bao
socket.on("response-remove-contact", function(user) {
  console.log(user);
  $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotisContact("count-contacts");
   // sau nay lam chu nang chat thi se xoa tiep user o phan chat

});

$(document).ready(function() {
  removeContact();
});