function decreaseNumberNotification(className) {
  let currentValue = +$(`.${className}`).text();//dau cong dang truoc de chuyen string thanh number, neu no rong thi tra ve so 0 la mac dinh
  //console.log(currentValue);
  //console.log(typeof currentValue);
  currentValue -= 1;

  if(currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  }else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}

function increaseNumberNotifycation(className) {
  let currentValue = +$(`.${className}`).text();//dau cong dang truoc de chuyen string thanh number, neu no rong thi tra ve so 0 la mac dinh
  //console.log(currentValue);
  //console.log(typeof currentValue);
  currentValue += 1;

  if(currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  }else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}