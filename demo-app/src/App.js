import React, { useEffect, useState } from 'react';
import Amplify, { API, graphqlOperation, input } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

const initialState = { name: '', description: '' };

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const response = await API.graphql(graphqlOperation(listTodos));
      const todos = response.data.listTodos.items;
      setTodos(todos);
    } catch (error) {
      console.log(`Failed to fetch todos, error:${error}`);
    }
  }

  function formHandleChange({ name: key, value }) {
    setFormState({ ...formState, [key]: value });
  }

  async function formHandleSubmit(event) {
    try {
      event.preventDefault();

      if (!formState.name) alert('please enter a name');
      if (!formState.description) alert('please enter a description');

      const todo = { ...formState };
      await API.graphql(graphqlOperation(createTodo, { input: todo }));

      setTodos([...todos, todo]);
      setFormState(initialState);
    } catch (error) {
      console.log(`Failed to create todo, error:${error}`);
    }
  }

  return (
    <form onSubmit={formHandleSubmit} style={styles.container}>
      <h2>Todo List</h2>

      <label>Todo</label>
      <input
        name='name'
        value={formState.name}
        style={styles.input}
        onChange={(event) => formHandleChange(event.target)}
      />

      <label>Description</label>
      <input
        name='description'
        value={formState.description}
        style={styles.input}
        onChange={(event) => formHandleChange(event.target)}
      />

      <input style={styles.button} type='submit' value='Submit' />

      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))}
    </form>
  );
};

const styles = {
  container: {
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: 'black',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
  },
};

export default withAuthenticator(App);
