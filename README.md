# Westore - 更好的小程序项目架构

> 更好的小程序项目架构、分层和模块划分

## 背景

随着小程序承载的项目越来越复杂，合理的架构可以提升小程序的扩展性和维护性。把逻辑写到 Page/Component 是一种罪恶，当业务逻辑变得复杂的时候 Page/Component 会变得越来越臃肿难以维护， westore 定义了一套合理的小程序架构适用于任何复杂度的小程序，让项目底座更健壮，易维护可扩展。

![](./assets/westore-class-diagram.png)

Westore 架构和 MVP 架构很相似，但是有许多不同。

* View 和 Store 是双向通讯
* View 与 Model 不发生联系，都通过 Store 传递
* View 非常薄，不部署任何业务逻辑，称为"被动视图"（Passive View），即没有任何主动性
* Store 非常薄，只复杂维护 View 需要的数据和桥接 View 和 Model
* Model 非常厚，所有逻辑都部署在那里，Model 可以脱离 Store 和 View 完整表达所有业务/游戏逻辑

## 解决方案

目录如下:

```
├─ models    // 业务模型实体
│   └─ snake-game
│       ├─ game.js
│       └─ snake.js   
│  
│  ├─ log.js
│  ├─ todo.js   
│  └─ user.js   
│
├─ pages     // 页面
│  ├─ game
│  ├─ index
│  ├─ logs   
│  └─ other.js  
│
├─ stores    // 页面的数据逻辑以及 page 和 models 的桥接器
│  ├─ game-store.js   
│  ├─ log-store.js      
│  ├─ other-store.js    
│  └─ user-store.js   
│
├─ utils

```

## 快速上手


### 安装

```bash
npm i westore --save
```
安装完记得在小程序里构建 npm

### 使用

定义 user 实体:

```js
class User {

  constructor(options) {
    this.motto = 'Hello World'
    this.userInfo = {}
    this.options = options
  }

  getUserProfile() {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        this.userInfo = res.userInfo
        this.options.onUserInfoLoaded && this.options.onUserInfoLoaded()
      }
    })
  }

}

module.exports = User
```

定义 user store:

```js
const { Store } = require('westore')
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
        this.update('userPage')
      }
    })
  }

  getUserProfile() {
    this.user.getUserProfile()
  }
}

module.exports = new UserStore
```

页面使用 user store:

```js
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
})
```

## 官方例子

<img src="./assets/mp.jpg" width="200px">


## License

MIT [@dntzhang](https://github.com/dntzhang)
