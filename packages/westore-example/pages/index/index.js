// index.js
// 获取应用实例
const userStore = require('../../store/user-store')

Page({
  data: userStore.data,
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    userStore.bind('userPage', this)
    userStore.getUserProfile()
  },
  getUserProfile() {
    userStore.getUserProfile()
  },

  gotoOtherPage() {
    wx.navigateTo({
      url: '../other/other'
    })
  },
})
