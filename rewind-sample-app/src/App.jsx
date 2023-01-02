import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, createEffect, getOwner, DEV, runWithOwner, useContext, createMemo} from 'solid-js';
import Hello from './Hello';
import 'solid-devtools';
import { debugComputation, debugOwnerComputations, debugSignals, debugSignal, debugOwnerSignals, debugProps } from '@solid-devtools/logger'
import { buildComponentTree } from './assets/compTree';


const [first, setFirst] = createSignal("AboveApp");

function App() {

  async function logCompTree() {
    const rewind = await getOwner(); 
    console.log('full tree', rewind);

    console.log('SG', DEV.serializeGraph(rewind));
    
    const compTree = await buildComponentTree(rewind);
    console.log('COMP TREE', compTree);
  }

  const [count, setCount] = createSignal(1);

  const doubleCount = () => count() * 2;
  function fibonacci(num) {
    if (num <= 1) return 1;
  
    return fibonacci(num - 1) + fibonacci(num - 2);
  }
  const fib = createMemo(() => fibonacci(count()));

  createEffect(() => {
    // console.log("App__debugComputation")
    // debugComputation()
    // console.log("App__debugOwnerComputation")
    // debugOwnerComputations()
    // console.log("App__debugSignal")
    // debugSignal()
    // console.log("App__debugOwnerSignal")
    // debugOwnerSignals()
    // console.log("App__debugProps")
    // debugProps()
    // console.log("App__debugSignals")
    // debugSignals(first, count, doubleCount)
  
  })

  return (
    <div id='firstInsideApp' class={styles.App}>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit {first()}<code> src/App.jsx</code> and save to reload.
        </p>
        < Hello count={count}/>
        <div>The current count is... {count()}</div>
        <button onclick={[setFirst, 'jim']}>changename to Jim</button>
        <button onclick={[setFirst, 'jeff']}>changename to Jeff</button>
        <button onclick={() => {
          // debugSignals(count)
          setCount(count() + 1)
        }}>+</button>
        
        <button onclick={() => {
          // debugSignals(count)
          setCount(count() + 1)
        }}>Fib Button</button>
        <button onclick={() => {
          // debugSignals(count)
          setCount(count() - 1)
        }}>-</button>
        <div>{doubleCount()}</div>
        <div>1. {fib()} {fib()} {fib()} {fib()} {fib()}</div>

      </header>
    </div>
  );
}



export default App;
