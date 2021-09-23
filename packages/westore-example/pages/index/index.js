// index.js
// 获取应用实例
const userStore = require('../../store/user-store')

Page({
  data: userStore.data,

  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad() {
    userStore.bind('userPage', this)
  },

  getUserProfile() {
    userStore.getUserProfile()
  },

  gotoOtherPage() {
    wx.navigateTo({
      url: '../other/other'
    })
  },

  gotoGamePage() {
    wx.navigateTo({
      url: '../game/game'
    })
  },
})
