// logs.js

const logStore = require('../../store/log-store')

Page({
  data: logStore.data,
  onLoad() {
    logStore.bind('logPage', this)
    logStore.loadLogs()
  }
})
