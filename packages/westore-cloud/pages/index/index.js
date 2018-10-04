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
    if (!(app.globalData.userInfo || this.data.canIUse)) {
      wx.getUserInfo()
    }

    this.store.pull('user').then(res => {
      this.store.data.user = res.data
      this.update()
      setTimeout(() => {
        this.store.data.user[0].name = 'dntzhang' + Math.floor(Math.random() * 100)
        //push === update cloud + update local
        this.store.push().then((res) => {
          console.log(res)
        })
      }, 2000)
    })

    //新增测试数据
    // this.store.add('product', {
    //   address:{
    //     province:'广东省',
    //     city:'深圳市',
    //   }
    // }).then((res) => {
    //   console.log(res)
    // })

    this.store.pull('product').then(res => {
      this.store.data.product = res.data
      this.update()
      setTimeout(() => {
        this.store.data.product[0].address.city = '广州市'
        this.store.data.product[0].agent[1] = 'QQ'
        this.store.data.product[0].agent[2] = '腾讯云'
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
  },

  addUser: function () {
    const user = {
      name: 'new user' + this.store.data.user.length,
      age: 1,
      city: '江西',
      gender: 2
    }
    this.store.data.user.push(user)
    this.update()
    this.store.add('user', user).then((res) => {
      //设置_id
      user._id = res._id
      this.update()
    })
  }
})