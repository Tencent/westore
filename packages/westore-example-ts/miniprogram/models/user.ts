export interface UserOptions {
  onUserInfoLoaded: () => void
}

export class User {
  motto: string
  userInfo: Partial<WechatMiniprogram.UserInfo>
  options: UserOptions
  constructor(options: UserOptions) {
    this.motto = "Hello World";
    this.userInfo = {};
    this.options = options;
  }

  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: "展示用户信息", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.userInfo = res.userInfo;
        this.options.onUserInfoLoaded && this.options.onUserInfoLoaded();
      },
    });
  }
}
