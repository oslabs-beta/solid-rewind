import { createEffect, createSignal, getOwner } from "solid-js";
import { render } from "solid-js/web";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { debugComputation, debugOwnerComputations, debugSignals, debugSignal, debugOwnerSignals, debugProps } from '@solid-devtools/logger'


// createEffect(() => {
//   // console.log("ABOVEHello__debugComputation")
//   // debugComputation()
//   // console.log("ABOVEHello__debugOwnerComputation")
//   // debugOwnerComputations()
//   // console.log("ABOVEHello__debugSignal")
//   // debugSignal()
//   // console.log("ABOVEHello__debugOwnerSignal")
//   // debugOwnerSignals()
//   // console.log("ABOVEHello__debugProps")
//   // debugProps()
//   // console.log("ABOVEHello__debugSignals")
//   // debugSignals()

// })

const [newName, setNewName] = createSignal('AboveHello')


const Hello = () => {
  
  // createEffect(() => {
  //   // console.log("Hello__debugComputation")
  //   // debugComputation()
  //   // console.log("Hello__debugOwnerComputation")
  //   // debugOwnerComputations()
  //   // console.log("Hello__debugSignal")
  //   // debugSignal()
  //   // console.log("Hello__debugOwnerSignal")
  //   // debugOwnerSignals()
  //   // console.log("Hello__debugProps")
  //   // debugProps()
  //   // console.log("Hello__debugSignals")
  //   // debugSignals()
  
  // })
  let input;
  let todoId = 0;
  const [todos, setTodos] = createStore(['storeArr']);

  const addTodo = (text) => {
    setTodos([...todos, { id: ++todoId, text, completed: false }]);
  }

  const toggleTodo = (id) => {
    setTodos(todo => todo.id === id, "completed", completed => !completed);
  }

  return (
    <>
      <div>
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