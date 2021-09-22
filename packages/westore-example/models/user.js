class User {

  constructor(options) {
    this.motto = 'Hello World'
    this.userInfo = {}
    this.options = options
  }

  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.userInfo = res.userInfo
        this.options.onUserInfoLoaded && this.options.onUserInfoLoaded()
      }
    })
  }

}

module.exports = User