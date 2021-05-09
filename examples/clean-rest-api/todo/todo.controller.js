const { getPostBody } = require('../utils');

class TodoController {
  constructor(service) {
    this.service = service;
  }

  getTodos(req, res) {
    const todos = this.service.getAll();
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    return res.end(JSON.stringify(todos));
  }

  getTodo(req, res) {
    const id = req.url.split('/')[3];
    const todo = this.service.findTodo(id);
    if (!todo) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Todo Not Found' }));
    }

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    return res.end(JSON.stringify(todo));
  }

  async createTodo(req, res) {
    const todo = await getPostBody(req);
    const id = this.service.createTodo(todo);
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    return res.end(
      JSON.stringify({
        created: `/api/todos/${id}`,
      })
    );
  }

  markAsDone(req, res) {
    const id = req.url.split('/')[3];
    const updated = this.service.markAsDone(id);
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    return res.end(JSON.stringify(updated));
  }
}

module.exports = TodoController;
