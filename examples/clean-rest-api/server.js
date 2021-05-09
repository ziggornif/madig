const http = require('http');
const Madig = require('../../src');
const { TodoController, TodoService, TodoRepository } = require('./todo');

const madig = new Madig([
  {
    class: TodoController,
    dependsOn: [TodoService],
  },
  {
    class: TodoService,
    dependsOn: [TodoRepository],
  },
  {
    class: TodoRepository,
    dependsOn: [],
  },
]);

madig.load();

// Simple native API
const server = http.createServer((req, res) => {
  if (req.url === '/api/todos' && req.method === 'GET') {
    madig.container.get('TodoController').getTodos(req, res);
  } else if (req.url.match(/\/api\/todos\/\w+/) && req.method === 'GET') {
    madig.container.get('TodoController').getTodo(req, res);
  } else if (req.url === '/api/todos' && req.method === 'POST') {
    madig.container.get('TodoController').createTodo(req, res);
  } else if (req.url.match(/\/api\/todos\/\w+\/mark-as-done/) && req.method === 'POST') {
    madig.container.get('TodoController').markAsDone(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route Not Found' }));
  }
});
server.listen(8080);
