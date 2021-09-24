import * as util from "../utils/util";

export class Log {
  logs: (string | number)[];
  constructor() {
    this.logs = [];
  }

  loadLogs() {
    this.logs = (wx.getStorageSync("logs") || []).map(
      (log: string | number) => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log,
        };
      }
    );
  }
}
