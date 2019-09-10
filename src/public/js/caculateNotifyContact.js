function decreaseNumberNotisContact(className) {
  let currentValue = +$(`.${className}`).find("em").text();//dau cong dang truoc de chuyen string thanh number, neu no rong thi tra ve so 0 la mac dinh
  //console.log(currentValue);
  //console.log(typeof currentValue);
  currentValue -= 1;

  if(currentValue === 0) {
    $(`.${className}`).html("");
  }else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`)
  }
}

function increaseNumberNotisContact(className) {
  let currentValue = +$(`.${className}`).find("em").text();//dau cong dang truoc de chuyen string thanh number, neu no rong thi tra ve so 0 la mac dinh
  //console.log(currentValue);
  //console.log(typeof currentValue);
  currentValue += 1;

  if(currentValue === 0) {
    $(`.${className}`).html("");
  }else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`)
  }
}