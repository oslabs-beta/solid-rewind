import styles from './App.module.css';

import { createSignal } from 'solid-js';
import { listenFor } from './listener';
import { sendData } from './sender';


const [copyiedState, setCopiedState] = createSignal('');

function displayFullState( state ) {
  console.log("state recieved:", state);
  setCopiedState(state);
  copyTextToClipboard(state);
  //navigator.clipboard.writeText(JSON.stringify(state));
}

// copy and load state
const copyState = () => {
  sendData(undefined, 'COPY_STATE');
}
const loadState = () => {
  sendData(copyiedState(), 'LOAD_STATE');
}

const copyToClipboard = (e) => {
  e.preventDefault();
  // console.log('copy event:', e.target[0].value);
  // navigator.clipboard.writeText(e.target[0].value); 

  copyTextToClipboard(e.target[0].value);
}

// crazy workaround to get copying to work in the extention window.
function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

function StateCopyWindow() {


  listenFor('COPY_OF_STATE', displayFullState);

  return (
    <div>
      <div class={ styles.timeButtonContainer }>
        <button variant="primary" onClick={copyState}>COPY STATE</button>
        <button variant="primary" onClick={loadState}>LOAD STATE</button>
      </div>
      <br></br>
      {/* <form onSubmit={copyToClipboard}>
        <textarea value={copyiedState()} class={styles.copyStateTextArea}></textarea>
        <button type='submit'>COPY</button>
      </form> */}
    </div>
  );
}

export default StateCopyWindow;
