import styles from './App.module.css';

import { createSignal } from 'solid-js';
import {listenFor} from './listener';
import { sendData } from './sender';


const [copyiedState, setCopiedState] = createSignal('');

function copyStateToClipboard( state ) {
  console.log("state recieved:", state);
  setCopiedState(state);
  //navigator.clipboard.writeText(JSON.stringify(state));
}

// copy and load state
const copyState = () => {
  sendData(undefined, 'COPY_STATE');
}
const loadState = () => {
  sendData(copyiedState(), 'LOAD_STATE');
}

function StateCopyWindow() {


  listenFor('COPY_OF_STATE', copyStateToClipboard);

  return (
    <div>
      <div class={ styles.timeButtonContainer }>
        <button variant="primary" onClick={copyState}>COPY STATE</button>
        <button variant="primary" onClick={loadState}>LOAD STATE</button>
      </div>
      <textarea value={copyiedState()}></textarea>
    </div>
  );
}

export default StateCopyWindow;
