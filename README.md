# Madig

[![NPM version](https://img.shields.io/npm/v/madig.svg)](https://www.npmjs.com/package/madig) [![Build job](https://github.com/drouian-m/madig/actions/workflows/build.yml/badge.svg)](https://github.com/drouian-m/madig/actions/workflows/build.yml)

Madig is a Javascript dependency injection engine.

## Installation

```bash
npm add madig
```

## Usage

### Create configuration

Injectable configuration object needs to respect the following format :

```js
[{
  class: ClassFile, // the class to instanciate
  dependsOn: [Dep1ClassFile, Dep2ClassFile] // the classes to inject in the constructor
}]
```

#### Module injection

In addition to classes, it is possible to inject modules into the class constructor.
To do this, declare the dependency as follows.
```js
[{
  class: ClassFile, // the class to instanciate
  dependsOn: [{name: 'MyModule', MyModule}] // the classes to inject in the constructor
}]
```

#### Example :

```js
const Madig = require('madig');

// Create new injectable configuration
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
```
### Load configuration injection

`madig.load` method will instanciate all classes declared in the configuration object and inject them.
```js
// Load injection
madig.load();
```

#### How does it works

The loading function determines the classes order of instantiation to be able to instantiate them with constructor dependencies.

For example, the previous configuration 

```js
[
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
]
```

Will be injected in the following order :
- ModuleHelloBis
- Db
- ModuleHello
- TodoRepository
- TodoService
- TodoController

### Access to the IOC container

The IOC container is not necessary in a classic usage because all dependencies are automaticly injected.

If you still need access to the container, you can do it like this : `madig.container.get('ClassName');` 

Example :
```js
madig.container.get('TodoController'); // returns TodoController instance
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
