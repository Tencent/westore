const util = require('../utils/util.js')

class Log {
  constructor() {
    this.logs = []
  }


  loadLogs() {
    this.logs = (wx.getStorageSync('logs') || []).map(log => {
      return {
        date: util.formatTime(new Date(log)),
        timeStamp: log
      }
    })


  }
}

module.exports = Log