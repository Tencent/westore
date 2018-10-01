export default {
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logs: [],
    b: { arr: [{ name: '数值项目1' }] },
    firstName: 'dnt',
    lastName: 'zhang',
    fullName:function(){
      return this.firstName + this.lastName
    },
    pure: 'pure2'
  },
  logMotto: function () {
    console.log(this.data.motto)
  }
}