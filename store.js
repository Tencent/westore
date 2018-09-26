export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: [],
    b: { arr: [{ name: 'abc' }] }
  },
  logMotto: function () {
    console.log(this.data.motto)
  }
}