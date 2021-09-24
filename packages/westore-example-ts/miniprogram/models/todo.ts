export interface TodoType {
  id: number;
  title: string;
  completed: boolean;
}

export class Todo {
  id: number;
  todos: TodoType[];
  onChanges: any[];
  constructor() {
    this.id = 0;
    this.todos = [
      {
        id: 0,
        title: "测试",
        completed: false,
      },
    ];
    this.onChanges = [];
  }

  subscribe(onChange: any) {
    this.onChanges.push(onChange);
  }

  inform() {
    this.onChanges.forEach(function (cb) {
      cb();
    });
  }

  addTodo(title: string) {
    this.todos.unshift({
      id: ++this.id,
      title: title,
      completed: false,
    });
    this.inform();
  }

  clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed;
    });
    this.inform();
  }

  destroy(todo: TodoType) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo;
    });
    this.inform();
  }

  toggleAll(checked: boolean) {
    this.todos.map(function (todo) {
      todo.completed = checked;
    });
    this.inform();
  }

  toggle(todoToToggle: TodoType) {
    todoToToggle.completed = !todoToToggle.completed;
    this.inform();
  }
}
