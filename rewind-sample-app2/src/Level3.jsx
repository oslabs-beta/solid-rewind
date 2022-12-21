import styles from './App.module.css';
import { createSignal} from 'solid-js';
import Level4 from './Level4';



const Level33o = (props) => {

  const [state, setStateData] = createSignal('level3');

  const updateStaet = () => {
    if (state() === 'level3-set') setStateData( 'level3' );
    else setStateData( 'level3-set' );
  }

  return (
    <div id='top' class='level'>
      level3: {state()}<br></br>
      drilled: {props.drill()}<br></br>
      <Level4 />
      <button onclick={updateStaet}>Level 3</button>
    </div>
  );
}



export default Level33o;
