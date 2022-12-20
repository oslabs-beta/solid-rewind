import styles from './App.module.css';
import { createSignal} from 'solid-js';



function Level4() {

  const [state, setStateData] = createSignal('level4');

  const updateStaet = () => {
    if (state() === 'level4-set') setStateData( 'level4' );
    else setStateData( 'level4-set' );
  }

  return (
    <div id='top' class='level'>
      level4: {state()}<br></br>
      <button onclick={updateStaet}>Level 4</button>
    </div>
  );
}



export default Level4;
