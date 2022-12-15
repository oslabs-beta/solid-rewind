import logo from './logo.svg';
import styles from './App.module.css';
import { createSignal, createEffect, getOwner, DEV, runWithOwner, useContext} from 'solid-js';
import Hello from './Hello';
import 'solid-devtools';
import { debugComputation, debugOwnerComputations, debugSignals, debugSignal, debugOwnerSignals, debugProps } from '@solid-devtools/logger'



const [first, setFirst] = createSignal("AboveApp");

function App() {
  const [count, setCount] = createSignal(11);
  const doubleCount = () => count() * 2;

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
        < Hello/>
        <div>The current count is... {count()}</div>
        <button onclick={[setFirst, 'jim']}>changename to Jim</button>
        <button onclick={[setFirst, 'jeff']}>changename to Jeff</button>
        <button onclick={() => {
          // debugSignals(count)
          setCount(count() + 1)
        }}>+</button>
        <button onclick={() => {
          // debugSignals(count)
          setCount(count() - 1)
        }}>-</button>
        <div>{doubleCount()}</div>
      </header>
    </div>
  );
}



export default App;
