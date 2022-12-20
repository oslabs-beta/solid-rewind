import styles from './App.module.css';
import { createSignal} from 'solid-js';
import Hider from './Hider';


function Level4() {

  const [state, setStateData] = createSignal('level4');
  const [hider, setHider] = createSignal([]);

  const updateStaet = () => {
    if (state() === 'level4-set') setStateData( 'level4' );
    else setStateData( 'level4-set' );

    showHide();
  }

  const showHide = () => {
    if (!hider.length) setHider([<Hider/>]);
    else setHider([]);
  }

  return (
    <div id='top' class='level'>
      level4: {state()}<br></br>
      {hider()}
      <button onclick={updateStaet}>Level 4</button>
    </div>
  );
}



export default Level4;
