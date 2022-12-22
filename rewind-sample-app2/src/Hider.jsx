import styles from './App.module.css';
import { createSignal} from 'solid-js';



function Hider() {

  const [state, setStateData] = createSignal('hiderState');

  const updateStaet = () => {
    if (state() === 'hiderState-set') setStateData( 'hiderState' );
    else setStateData( 'hiderState-set' );
  }

  return (
    <div id='hiderComp' class='level'>
      hider: {state()}<br></br>
      <button onclick={updateStaet}>SetHider</button>
    </div>
  );
}



export default Hider;
