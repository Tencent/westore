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
      this.store.data.userInfo = app.globalData.userInfo
      this.store.data.hasUserInfo = true
    } else if (this.data.canIUse) {

      app.userInfoReadyCallback = res => {
        this.store.data.userInfo = res.userInfo
        this.store.data.hasUserInfo = true
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.store.data.userInfo = res.userInfo
          this.store.data.hasUserInfo = true
        }
      })
    }

    setTimeout(() => {
      this.store.data.motto = 'Hello Store222'
      this.store.data.b.arr.push({ name: 'ccc' })
    }, 2000)

    setTimeout(() => {
      this.store.data.b.arr.splice(1, 1)
    }, 4000)

    setTimeout(() => {
      this.store.data.firstName = 'DNT'
      this.update({
        'motto': 'Update from update'
      })
    }, 6000)

    setTimeout(() => {
      this.store.data.firstName = 'dnt'
      Object.assign(this.store.data, {
        'motto': 'Update from assign',
        b: { arr: [{ name: 'assign' }, { name: 'assign2' }] }
      })
    }, 8000)
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.store.data.userInfo = e.detail.userInfo
    this.store.data.hasUserInfo = true
  }
})

setTimeout(() => {
  store.data.firstName = 'dnt'
  store.update({
    'motto': 'Update from store.update'
  })
}, 10000)