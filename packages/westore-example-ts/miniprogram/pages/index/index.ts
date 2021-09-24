// index.ts
// 获取应用实例
// const app = getApp<IAppOption>()

import userStore from '../../stores/user-store'

Page({
  data: userStore.data,
  
  // 事件处理函数
  bindViewTap() {
    this.gotoPage('logs')
  },

  onLoad() {
    userStore.bind('userPage', this)
  },
  
  getUserProfile() {
    userStore.getUserProfile()
  },

  gotoPage(name: 'game' | 'other' | 'logs') {
    wx.navigateTo({
      url: `../${name}/${name}`
    })
  }
})
