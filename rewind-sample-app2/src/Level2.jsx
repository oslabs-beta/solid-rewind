import styles from './App.module.css';
import { createSignal} from 'solid-js';
import Level3 from './Level3';



function Level2(props) {

  const [state, setStateData] = createSignal('level2');

  const updateStaet = () => {
    if (state() === 'level2-set') setStateData( 'level2' );
    else setStateData( 'level2-set' );
  }

  return (
    <div id='top' class='level'>
    level2: {state()}<br></br>
      <Level3 drill={props.drill}/>
      <Level3 drill={props.drill}/>
      <button onclick={updateStaet}>Level 2</button>
    </div>
  );
}



export default Level2;
