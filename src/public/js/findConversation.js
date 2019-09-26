function callFindConversation(element) {
  if(element.which === 13) {
    let keyword = $("#input-find-conversation").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    
    if(!keyword.length) {
      alertify.notify("Chua nhap noi dung tim kiem", "error", 7);
      return false;
    }
    if(!regexKeyword.test(keyword)) {
      alertify.notify("Loi tu khoa tim kiem chi cho phep ky tu va so va khoang trang", "error", 7);
      return false;
    }
   // console.log(keyword);
    //cai nay giong vs $.ajax 
    $.get(`/conversation/find-conversation/${keyword}`, function(data) {

       $("#search-results").css("display", "block");
       $("#search_content").html(data);
      // addContact(); // js/addContact.js
      // removeRequestContactSent(); //js/removeRequestContactSent.js
      //console.log(data);
      // $("body").on("click", function() {
      //   $("#search-results").css("display", "none");
      // });
      userTalk();
    });
  } 
}

$(document).ready(function() {
 
  $("#input-find-conversation").bind("keypress", callFindConversation);
});