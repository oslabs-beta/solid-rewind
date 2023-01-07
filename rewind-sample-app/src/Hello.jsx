import { createSignal, For, Show } from "solid-js";
import { createStore  } from "solid-js/store";
import StoreComp from "./Store-comp";



const [newName, setNewName] = createSignal('AboveHello')


const Hello = (props) => {
  
  let input;
  let todoId = 0;
  const [todos, setTodos] = createStore([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: ++todoId, text, completed: false }]);
  }

  const toggleTodo = (id) => {
    setTodos(todo => todo.id === id, "completed", completed => !completed);
  }

  const [hiddenCompOpen, setHidden] = createSignal(false);
  const toggleHidden = () => setHidden(!hiddenCompOpen()); 

  return (
    <>
    <Show
      when={hiddenCompOpen()}
      fallback={<button onClick={toggleHidden}>Click Me to Open Component</button>}
    >
      <button onClick={toggleHidden}>Hide Component</button>
      <StoreComp/>
    </Show>
      <div>
        count:
        {props.count}<br></br>
        <input ref={input} />
        <button
          onClick={(e) => {
            if (!input.value.trim()) return;
            addTodo(input.value);
            input.value = "";
          }}
        >
          Add Todo
        </button>

        <div>{newName()}</div>
        <storeComp/>
        <button
          onClick={(e) => {
            setNewName("BrandNewName");
          }}
        >
          Set NewName to BrandNew Name
        </button>
      </div>
      <For each={todos}>
        {(todo) => {
          const { id, text } = todo;
          return <div>
            <input
              type="checkbox"
              checked={todo.completed}
              onchange={[toggleTodo, id]}
            />
            <span
              style={{ "text-decoration": todo.completed ? "line-through" : "none" }}
            >{text}</span>
          </div>
        }}
      </For>
    </>
  );
};

export default Hello;