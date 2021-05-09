class TodoRepository {
  constructor() {
    this.todos = [];
  }

  find() {
    return this.todos;
  }

  findById(id) {
    return this.todos.find((todo) => todo.id === parseInt(id, 10));
  }

  insert(todo) {
    return this.todos.push(todo);
  }

  updateOne(id, update) {
    const todo = this.findById(id);
    todo.done = update.done;
  }
}

module.exports = TodoRepository;
