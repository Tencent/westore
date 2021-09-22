class Todo {
  constructor() {
    this.id = 0
    this.todos = [{
      id: 0,
      title: '测试',
      completed: false
    }]
    this.onChanges = []
  }

  subscribe = function (onChange) {
    this.onChanges.push(onChange)
  }

  inform() {
    this.onChanges.forEach(function (cb) { cb() })
  }

  addTodo(title) {
    this.todos.unshift({
      id: ++this.id,
      title: title,
      completed: false
    })
    this.inform()
  }

  clearCompleted() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.completed
    })
    this.inform()
  }

  destroy(todo) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate !== todo
    })
    this.inform()
  }

  toggleAll(checked) {
    this.todos.map(function (todo) {
      todo.completed = checked
    })
    this.inform()
  }

  toggle(todoToToggle) {
    todoToToggle.completed = !todoToToggle.completed
    this.inform()
  }
}


module.exports = Todo