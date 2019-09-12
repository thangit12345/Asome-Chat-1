function decreaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text();//dau cong dang truoc de chuyen string thanh number, neu no rong thi tra ve so 0 la mac dinh
  //console.log(currentValue);
  //console.log(typeof currentValue);
  currentValue -= number;

  if(currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  }else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}

function increaseNumberNotifycation(className, number) {
  let currentValue = +$(`.${className}`).text();//dau cong dang truoc de chuyen string thanh number, neu no rong thi tra ve so 0 la mac dinh
  //console.log(currentValue);
  //console.log(typeof currentValue);
  currentValue += number;

  if(currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  }else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}