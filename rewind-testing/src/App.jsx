import { createSignal, createMemo} from 'solid-js';
import 'solid-devtools';




const [outside, setOutisde] = createSignal("outside");

function App() {

  const [count, setCount] = createSignal(1);
  const doubleCount = () => count() * 2;

  function fibonacci(num) {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  const fib = createMemo(() => fibonacci(count()));

  const increment = () => {
    setCount(count() + 1);
  }
  const decrement = () => {
    setCount(count() - 1);
  }

  return (
    
    <div>

        <div>COUNT: {count()}</div>
        
        <button onclick={increment}>Incremen</button>

        <button onclick={decrement}>Decrement</button>

        <div>{doubleCount()}</div>

        <div>1. {fib()} </div>

    </div>
  );
}



export default App;
