const { Store, update } = require('westore')
const User = require('../models/user')

class UserStore extends Store {
  constructor(options) {
    super()
    this.options = options
    this.data = {
      motto: '',
      userInfo: {}
    }

    this.user = new User({
      onUserInfoLoaded: () => {
        this.data.motto = this.user.motto
        this.data.userInfo = this.user.userInfo
        update(this.views.userPage)
      }
    })
  }

  getUserProfile() {
    this.user.getUserProfile()
  }


}


module.exports = new UserStore
