# Clean REST API

Simple TODO app with dependency injection.

## Create TODO

```sh
POST http://localhost:8080/api/todos

{
    "task": "Add project examples"
}
```

## List TODOS

```sh
GET http://localhost:8080/api/todos
```

## Get a TODO

```sh
GET http://localhost:8080/api/todos/1
```

## Mark a TODO as done

```sh
POST http://localhost:8080/api/todos/1/mark-as-done
```