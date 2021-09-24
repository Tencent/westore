import { Store } from "westore";
import { Log } from "../models/log";

class LogStore extends Store<Partial<Log>> {
  log: Log;
  constructor() {
    super();
    this.data = {
      logs: [],
    };

    this.log = new Log();
  }

  loadLogs() {
    this.log.loadLogs();
    this.data.logs = this.log.logs;
    this.update("logPage");
  }
}

const logStore = new LogStore();
export default logStore;
