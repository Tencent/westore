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
      this.update({
        userInfo:app.globalData.userInfo,
        hasUserInfo:true
      })
    } else if (this.data.canIUse) {

      app.userInfoReadyCallback = res => {
        this.store.data.userInfo = res.userInfo
        this.store.data.hasUserInfo = true
        this.update()
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.data.userInfo = res.userInfo
          this.store.data.hasUserInfo = true
          this.update()
        }
      })
    }

    setTimeout(() => {
      // this.store.data.motto = 'Hello Store222'
      // this.store.data.b.arr.push({ name: 'ccc' })
      this.update({
        motto:'Hello Store222',
        [`b.arr[${this.store.data.b.arr.length}]`]:{name:'ccc'}
      })

    }, 4000)

    setTimeout(() => {

      this.store.data.b.arr.splice(1, 1)
      this.update()

    }, 6000)

    setTimeout(() => {
      //测试函数属性
      this.store.data.firstName = 'DNT'
      this.update()

    }, 8000)
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.store.data.userInfo = e.detail.userInfo
    this.store.data.hasUserInfo = true
    this.update()
  }
})