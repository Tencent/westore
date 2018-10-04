# Westore Cloud 

## 小程序云开发简介

开发者可以使用云开发开发微信小程序、小游戏，无需搭建服务器，即可使用云端能力。

云开发为开发者提供完整的云端支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代，同时这一能力，同开发者已经使用的云服务相互兼容，并不互斥。

目前提供三大基础能力支持：

* 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写自身业务逻辑代码
* 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 数据库
* 存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理

关于小程序云更多信息的官方文档可以[点击这里](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## Westore Cloud 简介

Westore Cloud 在基于小程序云的数据库能力，让开发者感知不到数据库的存在，只需要专注于本地数据、本地数据逻辑和本地数据的流动，通过简单的 pull、push、add 和 remove 同步本地数据库和云数据库。数据库相关的官方文档可以[点这里](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html)。

## API

### this.store.pull(collectionName, [where])

拉取云数据库集合的 JSON 数据

#### 参数

| 名称 | 是否可选  |类型|描述|
| ------ | ------  |------  |------  |
| collectionName | 	必须	  |	字符串	  |集合名称	  |
| where | 不必须	  |	JSON Object  |查询条件，如查询18岁 {age : 18}	  |

更多 where 的构建查询条件的 API 可以[点击这里](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/query.html)。
#### 返回值

返回 Promise 对象的实例。

#### 实例

查询 18 岁的用户:

``` js
this.store.pull('user', {age: 18}).then(res => {
  this.store.data.user = res.data
  this.update()
})
```


## License

MIT [@dntzhang](https://github.com/dntzhang)
