import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  memo
} from "react";
import logo from "./logo.svg";
import { render } from "react-dom";
import "./App.css";

let idSeq = Date.now();

const Control = memo(function Control(props) {
  const { dispatch } = props;
  const inputRef = useRef();
  const onSubmit = e => {
    e.preventDefault();
    const newText = inputRef.current.value.trim();
    if (newText.length === 0) {
      return;
    }
    // addTodo({
    //   id: ++idSeq,
    //   text: newText,
    //   complete: false
    // });
    dispatch({
      type: "add",
      payload: {
        id: ++idSeq,
        text: newText,
        complete: false
      }
    });
    inputRef.current.value = "";
  };
  return (
    <div className="control">
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="new-todo"
          placeholder="what needs to be done"
        />
      </form>
    </div>
  );
});
const TodoItem = memo(function TodoItem(props) {
  const {
    todo: { id, text, complete },
    dispatch
  } = props;
  const onChange = () => {
    dispatch({ type: "toggle", payload: id });
  };
  const onRemove = () => {
    dispatch({ type: "remove", payload: id });
  };
  return (
    <li>
      <input type="check-box" onChange={onChange} checked={complete} />
      <label className>{text}</label>
      <button onClick={onRemove}>&#xd7;</button>
    </li>
  );
});
const Todos = memo(function Todos(props) {
  const { todos, dispatch } = props;

  return (
    <ul>
      {todos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />;
      })}
    </ul>
  );
});

let LS_KEY = "1231";

const TodoList = memo(function TodoList() {
  const [todos, setTodos] = useState([]);
  // const addTodo = useCallback(todo => {
  //   setTodos(todos => [...todos, todo]);
  // }, []);
  // const removeTodo = useCallback(id => {
  //   setTodos(id =>
  //     todos.filter(todo => {
  //       return todo.id !== id;
  //     })
  //   );
  // }, []);
  // const toggleTodo = useCallback(id => {
  //   setTodos(todos =>
  //     todos.map(todo => {
  //       return todo.id === id
  //         ? {
  //             ...todo,
  //             complete: !todo.complete
  //           }
  //         : todo;
  //     })
  //   );
  // }, []);

  const dispatch = useCallback(action => {
    const { type, payload } = action;
    switch (type) {
      case "set":
        setTodos(payload);
        break;
      case "add":
        setTodos(todos => [...todos, payload]);
        break;
      case "remove":
        setTodos(id =>
          todos.filter(todo => {
            return todo.id !== payload;
          })
        );
        break;
      case "toggle":
        setTodos(todos =>
          todos.map(todo => {
            return todo.id === payload
              ? {
                  ...todo,
                  complete: !todo.complete
                }
              : todo;
          })
        );
        break;
      default:
    }
  }, []);

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    dispatch({ type: "set", payload: todos });
  }, []);
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos));
  }, [todos]);
  return (
    <div className="todo-list">
      <Control dispatch={dispatch}></Control>
      <Todos todos={todos} dispatch={dispatch}></Todos>
    </div>
  );
});
export default TodoList;
