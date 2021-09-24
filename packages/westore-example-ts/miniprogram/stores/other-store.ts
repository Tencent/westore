import { Store } from "westore";
import { Log } from "../models/log";
import { Todo, TodoType } from "../models/todo";

class OtherStore extends Store<{
  logsSize: number;
  todoTitle: string;
  todos: TodoType[];
  count: number;
}> {
  log: Log;
  todo: Todo;
  constructor() {
    super();
    this.data = {
      logsSize: 0,
      todoTitle: "",
      todos: [],
      count: 18,
    };

    this.log = new Log();
    this.todo = new Todo();

    this.todo.subscribe(() => {
      this.data.todos = this.todo.todos;
      this.update();
    });
  }

  init() {
    this.data.todos = this.todo.todos;
    this.log.loadLogs();
    this.data.logsSize = this.log.logs.length;
    this.update();
  }

  addTodo() {
    this.todo.addTodo(this.data.todoTitle);

    this.data.todoTitle = "";
    this.update();
  }
}

const otherStore = new OtherStore();
export default otherStore;
