const { expect } = require('chai');
const sinon = require('sinon');
const suppressLogs = require('mocha-suppress-logs');
const Madig = require('./index');
const Db = require('./examples/db/db');
const TodoController = require('./examples/todo/todo.controller');
const TodoRepository = require('./examples/todo/todo.repository');
const TodoService = require('./examples/todo/todo.service');
const ModuleHello = require('./examples/module/module');
const ModuleHelloBis = require('./examples/module/module-2');

describe('Madig', () => {
  suppressLogs(); // hide successful tests logs

  it('should inject configuration and use controller instance', () => {
    const serviceSpy = sinon.spy(TodoService.prototype, 'getAllTodos');
    const configuration = [
      {
        class: TodoController,
        dependsOn: [TodoService],
      },
      {
        class: TodoService,
        dependsOn: [TodoRepository, { name: 'ModuleHelloBis', ModuleHelloBis }],
      },
      {
        class: TodoRepository,
        dependsOn: [Db, { name: 'ModuleHello', ModuleHello }],
      },
    ];
    const madig = new Madig(configuration);
    madig.load();
    madig.container.get('TodoController').todolist();
    expect(serviceSpy.callCount).to.eql(1);
  });
});
