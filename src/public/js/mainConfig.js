/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function resizeNineScrollLeft() {
  $(".left").getNiceScroll().resize();
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop($(`.right .chat[data-chat=${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function(editor, event) {
        // gan gia tri thay doi vao the input an
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function() {
        // bat lang nge DOM cho viec chat tin nhan van ban emoji
        textAndEmojichat(divId);
        // bat chuc nang nguoi dung go tro chuyen
        typingOn(divId);
      },
      blur: function() {
        //tat chuc nang nguoi dung go phim
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function(event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function() {
      spinLoading();
    })
    .ajaxStop(function() {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function() {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function() {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function() {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function() {
    let href = $(this).attr("href");
    let modalImageId = href.replace("#", ""); //bo dau #
    
    let originDataImage = $(`#${modalImageId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImageId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`#${modalImageId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function() {
        $(`#${modalImageId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImageId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });
    // bat su kien dong modal
    $(`#${modalImageId}`).on('hidden.bs.modal', function () {
      $(this).find("div.modal-body").html(originDataImage);
  })
  });
  
}

// function showButtonGroupChat() {
//   $('#select-type-chat').bind('change', function() {
//     if ($(this).val() === 'group-chat') {
//       $('.create-group-chat').show();
//       // Do something...
//     } else {
//       $('.create-group-chat').hide();
//     }
//   });
// }



function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7); //co scri[t cua thu vien nay]
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function() {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    }else {
      $(".create-group-chat").show();
    }
  });
}

function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function() {
    //cau hinh thanh cuon ben box chat rightSide.ejs moi khi ma minh click chuot vao 1 cuoc tro chuyen
    let divId = $(this).find("li").data("chat");
    
    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab('show');
    //23
    

    nineScrollRight(divId);

    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);
    // Lang nge cho viet chat tin nhan hinh anh
    imageChat(divId);
     // Lang nge cho viet chat tin nhan tep dinh kem
     attachChat(divId);
     //goi video 
     videoChat(divId);
  });
}

function convertEmoji() {
  $(".convert-emoji").each(function() {
    var original = $(this).html();
    var converted = emojione.toImage(original);
    $(this).html(converted);
  });
}

function bufferToBase64(buffer) {
  return base64 = btoa( new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}

// khi click vao anh tren message thi zoom to le
function zoomImageChat() {
  $(".show-image-chat").unbind("click").on("click", function() {
    $("#img-chat-modal").css("display", "block");
    $("#img-chat-modal-content").attr("src", $(this)[0].src);

    $("#img-chat-modal").on("click", function() {
      $(this).css("display", "none");
    });
  });
}
// khi click vao nut tro chuyen
function userTalk() {
  $(".user-talk").unbind("click").on("click", function() {
    let dataChat = $(this).data("uid");
    $("ul.people").find(`a[href="#uid_${dataChat}"]`).click();
    $(this).closest("div.modal").modal("hide");
  });
}
// extras
function notYetConversation() {
  if(!$("ul.people").find("a").length) {
    Swal.fire({
      title: "Bạn chưa có bạn bè? Hãy tìm kiếm bạn bè để trò chuyên !",
      type: "info",
      showCancelButton: false,
      confirmButtonColor: "#2ECC71",
      confirmButtonText: "Xác Nhận"
    }).then((result) => {
      $("#contactsModal").modal("show");
    });
  }
}

$(document).ready(function() {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();
  



  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị button mở modal tạo nhóm trò chuyện
  // showButtonGroupChat();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);



  //flash message o man hinh master
  flashMasterNotify();
  // thay doi kieu tro chuyen
  changeTypeChat();
  //thay doiman hinh chat
  changeScreenChat();
  // kiểm tra chưa có bạn bè thì thông báo để kết bạn
  notYetConversation();

  // click vao tro chuyen
  userTalk() ;
  zoomImageChat();
  if($("ul.people").find("a").length) {
    $("ul.people").find("a")[0].click(); //khi load trang mac dinh se click then dung dau danh sach conversation
  }
  
  
  $("#video-chat-group").bind("click", function() {
    alertify.notify("Khong kha dung tinh nang nay voi nhom tro chuyen, Vui long thu lai voi tro chuyen ca nhan", "error", 7);
  });
});
