import store from '../../store'
import create from '../../utils/create'

const app = getApp()

create(store, {

  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onShow() {
    this.update()
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      // this.update({
      //   userInfo:app.globalData.userInfo,
      //   hasUserInfo:true
      // })
    } else if (this.data.canIUse) {

      // app.userInfoReadyCallback = res => {
      //   this.store.data.userInfo = res.userInfo
      //   this.store.data.hasUserInfo = true
      //   this.update()
      // }
    } else {
      wx.getUserInfo({
        success: res => {
          // app.globalData.userInfo = res.userInfo
          // this.store.data.userInfo = res.userInfo
          // this.store.data.hasUserInfo = true
          // this.update()
        }
      })
    }

    this.store.pull('user').then(res => {
      this.store.data.list.user = res.data
      this.update()
    })

    this.store.pull('user', {
      _id: 'W7INq92AWotkUcwC'
    }).then((res) => {
      this.store.data.item.user = res.data[0]
      this.update()
      setTimeout(() => {
        this.store.data.item.user.name = 'dntzhang' + Date.now()
        //push === update cloud + update local
        this.store.push().then((res) => {
          console.log(res)
        })
      }, 2000)
    })


  },

  getUserInfo: function (e) {
    // app.globalData.userInfo = e.detail.userInfo
    // this.store.data.userInfo = e.detail.userInfo
    // this.store.data.hasUserInfo = true
    // this.update()
  }
})