/* eslint-disable no-param-reassign */
class TodoService {
  constructor(respository) {
    this.respository = respository;
    this.increment = 1;
  }

  getAll() {
    return this.respository.find();
  }

  findTodo(id) {
    return this.respository.findById(id);
  }

  createTodo(todo) {
    todo.id = this.increment;
    todo.done = false;
    this.respository.insert(todo);
    this.increment += 1;
    return todo.id;
  }

  markAsDone(id) {
    const todo = this.respository.findById(id);
    todo.done = true;
    this.respository.updateOne(id, todo);
    return todo;
  }
}

module.exports = TodoService;
