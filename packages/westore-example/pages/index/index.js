// index.js
// 获取应用实例
const userStore = require('../../stores/user-store')

Page({
  data: userStore.data,

  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad() {
    userStore.bind(this)
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
