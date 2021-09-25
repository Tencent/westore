class Todo {
  constructor() {
    this.id = 1
    this.todos = [{
      id: 0,
      title: '测试',
      done: false,
    }, {
      id: 1,
      title: '学习 Westore',
      done: true,
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
      done: false
    })
    this.inform()
  }

  clearDone() {
    this.todos = this.todos.filter(function (todo) {
      return !todo.done
    })
    this.inform()
  }

  destroy(id) {
    this.todos = this.todos.filter(function (candidate) {
      return candidate.id !== id
    })
    this.inform()
  }

  toggleAll(checked) {
    this.todos.map(function (todo) {
      todo.done = checked
    })
    this.inform()
  }

  toggle(id) {
    const todoToToggle = this.todos.find(todo => todo.id === id)
    todoToToggle.done = !todoToToggle.done
    this.inform()
  }
}


module.exports = Todo