import React, {Component} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import TodoForm from './TodoForm'
import TodoList from './TodoList'
import Footer from './Footer'

import {
  loadTodos,
  saveTodo,
  updateTodo,
  destroyTodo
} from '../lib/service';


export default class TodoApp extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTodo: '',
      todos: []
    }

    this.handleNewTodoChange = this.handleNewTodoChange.bind(this);
    this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleTodoSubmit = this.handleTodoSubmit.bind(this);
  }

  componentDidMount() {
    loadTodos()
      .then(({ data }) => this.setState({ todos: data }))
      .catch(() => this.setState({ error: true }));
  }

  handleNewTodoChange(evt) {
    this.setState({
      currentTodo: evt.target.value
    });
  }

  handleDeleteTodo(id) {
    destroyTodo(id)
      .then(() => this.setState({
        todos: this.state.todos.filter(todo => todo.id !== id)
      }))
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.find(todo => todo.id === id);
    const updatedTodo = {
      ...targetTodo,
      isComplete: !targetTodo.isComplete
    };

    updateTodo(updatedTodo)
      .then(({ data }) => {
        const todos = this.state.todos.map(
          todo => todo.id === data.id ? data : todo
        );
        this.setState({ todos: todos });
      });
  }

  handleTodoSubmit(evt) {
    evt.preventDefault();

    const newTodo = {
      name: this.state.currentTodo,
      isComplete: false
    };

    saveTodo(newTodo)
      .then(({ data }) => this.setState({
        todos: this.state.todos.concat(data),
        currentTodo: ''
      }))
      .catch(() => this.setState({ error: true }));
  }

  render () {
    const remaining = this.state.todos
      .filter(todo => !todo.isComplete).length;

    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {
              this.state.error &&
                <span className="error">Something went wrong!</span>
            }
            <TodoForm
              currentTodo={this.state.currentTodo}
              handleNewTodoChange={this.handleNewTodoChange}
              handleTodoSubmit={this.handleTodoSubmit}
            />
          </header>
          <section className="main">
            <TodoList
              todos={this.state.todos}
              handleToggleTodo={this.handleToggle}
              handleDeleteTodo={this.handleDeleteTodo}
            />
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    )
  }
}
