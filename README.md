# madig
Javascript dependency injection engine

WIP...

## Example

```js
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
madig.load();
```