export const transValidation = {
  email_incorect: "Email phải có dạng example@gmail.com!",
  gender_incorect: "Ủa tại sao trường giới tính lại bị sai!",
  password_incorect: "Mật khẩu chứa ít nhất 8 ký tự bao gôm chưa hoa thương và ký tự đặc biệt!",
  password_confirmation_incorect: "Nhập lại mật khẩu chưa chính xác!",
  update_username: "Username gioi han trong khoan 1-17 ky tu va ko chua ky tu dac biet !",
  update_gender: "Oops! Du lieu gioi tinh co van de , ban hacker chang !",
  update_address: "Dia chi gioi tinh khoang 3-30 ky tu !",
  update_phone: "So dien thoai bat dau voi so 0 va gioi han trong khoang 10-11 ky tu !"
}

export const transErrors = {
  account_in_use: "Email nay da duoc su dung",
  account_remove: "Tai khoan da bi remove khoi he thong .",
  account_not_active: "Tai khoa chua kich hoat.Vui long check email de kich hoat ",
  accout_undifined: "Tai nguyen khong ton tai",
  token_undifined: "token khong ton tai, co the da duoc active!",
  login_failed: "Sai tai khoan hoac mat khau",
  server_error: "Co loi o phia server, vui long kiem tra lau",
  avatar_type: "Kieu file khong hop le, chi chap nhan jpg, png",
  avatar_size: "Anh up load toi da cho phep la 1mb !",
  user_current_password_failed: "Mat khau hien tai chua chinh xac !"
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tai khoan <strong>${userEmail}</strong> da duoc tao ! Vui long kiem tra email de kich hoat tai khoa`;

  },
  account_active: "Kich hoat tai khoan thanh cong , ban co the dang nhap vao ung dung",
  loginSuccess: (username) => {
    return `Xin Chao ${username}, chuc ban mot ngay tot lanh !`;
  },
  logout_success: "Dang xuat tai khoan thanh cong !",
  avatar_updated: "Cap nhat anh dai dien thanh cong !",
  user_info_updated: "Cap nhat thong tin nguoi dung thanh cong",
  user_password_updated: "Cap nhat mat khau thanh cong !"
};

export const transMail = {
  subject: "Awsome Chat: Xac nhan kich hoat tai khoa",
  template: (linkVerify) => {
    return `
      <h2>Ban nhan duoc email nay thi dang ky tai khoan tren ung dung awsomechat</h2>
      <h3>Vui long click vao lien ket xac nhan tai khoan</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Cam On </h4>
    `;
  },
  sendFail: "Co loi trong qua trinh gui mail , vui long lien he vs bo phan ho tro"
};