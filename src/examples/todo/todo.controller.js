class TodoController {
  constructor(service) {
    this.service = service;

    console.log('[TodoController] constructor - instance mounted with :', {
      service,
    });
  }

  todolist() {
    console.log('[TodoController] todolist called');
    return this.service.getAllTodos();
  }
}

module.exports = TodoController;
