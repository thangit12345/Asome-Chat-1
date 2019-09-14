function callFindUsers(element) {
  if(element.which === 13 || element.type === "click") {
    let keyword = $("#input-find-users-contact").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    // if(!keyword.length) {
    //   alertify.notify("Chua nhap noi dung tim kiem", "error", 7);
    //   return false;
    // }
    // if(!regexKeyword.test(keyword)) {
    //   alertify.notify("Loi tu khoa tim kiem chi cho phep ky tu va so va khoang trang", "error", 7);
    //   return false;
    // }
    //cai nay giong vs $.ajax 
    $.get(`/contact/find-users/${keyword}`, function(data) {
      $("#find-user ul").html(data);
      addContact(); // js/addContact.js
      removeRequestContactSent(); //js/removeRequestContactSent.js
    });
  } 
}

$(document).ready(function() {
  // $("#input-find-users-contact").bind("keypress", function(element) {
  //   if(element.which === 13) {
  //     let keyword =  $("#input-find-users-contact").val();
  //     console.log(keyword);
  //   }
  // });

  // $("#btn-find-users-contact").bind("click", function(element) {
  //     let keyword =  $("#input-find-users-contact").val();
  //     console.log(keyword);
   
  // });
  //cach viet ngan gon cho hai cai tren
  $("#input-find-users-contact").bind("keypress", callFindUsers);
  $("#btn-find-users-contact").bind("click", callFindUsers);
});