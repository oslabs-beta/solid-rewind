import styles from './App.module.css';
import { createSignal} from 'solid-js';
import Level2 from './Level2';



const [first, setFirst] = createSignal("AboveApp");

function App() {

  const [state, setStateData] = createSignal('app-level');

  const updateStaet = () => {
    if (state() === 'app-level-set') setStateData( 'app-level' );
    else setStateData( 'app-level-set' );
  }

  return (
    <div id='top' class='level'>
      top: {state()}<br></br>
      <Level2 drill={state} />
      <button onclick={updateStaet}>App Level</button>
    </div>
  );
}



export default App;
