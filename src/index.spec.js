const { expect } = require('chai');
const sinon = require('sinon');
const suppressLogs = require('mocha-suppress-logs');
const Madig = require('./index');
const Db = require('./resources/db/db');
const TodoController = require('./resources/todo/todo.controller');
const TodoRepository = require('./resources/todo/todo.repository');
const TodoService = require('./resources/todo/todo.service');
const ModuleHello = require('./resources/module/module');
const ModuleHelloBis = require('./resources/module/module-2');
const hugeConf = require('./resources/huge-load');

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

  it('should inject huge configuration (300 items) in less than 50ms', () => {
    const start = new Date();
    const madig = new Madig(hugeConf);
    madig.load();
    const duration = new Date() - start;
    expect(duration < 50).to.eql(true);
  });

  it('should throw error on invalid configuration', () => {
    expect(
      () =>
        new Madig([
          {
            dependsOn: [TodoService],
          },
        ])
    ).to.throw('Invalid injectable configuration');
  });

  it('should throw error during injection if injectable not found', () => {
    const madig = new Madig([
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
    ]);
    expect(() => madig.resolveInjectable('InvalidMod')).to.throw(
      'Configuration error, injectable InvalidMod not found'
    );
  });
});
