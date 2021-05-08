class TodoService {
  constructor(repository) {
    this.repository = repository;

    console.log('[TodoService] constructor - instance mounted with :', {
      repository,
    });
  }

  getAllTodos() {
    console.log('[TodoService] getAllTodos called');
    return this.repository.findAll();
  }
}

module.exports = TodoService;
