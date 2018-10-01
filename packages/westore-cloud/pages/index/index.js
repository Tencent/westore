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

    this.store.db.collection('user').doc('W7FWJQ6qgQy38iWu').get().then(res => {
       this.store.data.item.user = res.data
      console.log(res.data)
       this.update()
    })
    this.store.db.collection('user').get().then(res => {
      this.store.data.list.user = res.data
      console.log(res.data)
      this.update()
    })

  },

  getUserInfo: function (e) {
    // app.globalData.userInfo = e.detail.userInfo
    // this.store.data.userInfo = e.detail.userInfo
    // this.store.data.hasUserInfo = true
    // this.update()
  }
})