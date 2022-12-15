/* global chrome */
import { createSignal } from 'solid-js';

import { sendData } from './sender';

function SendBack() {

  const [text, updateText] = createSignal('');

  const displayAndSend = (e) => {
    // display text in app
    updateText(e.target.value);

    // send text back to client
    sendData(e.target.value, 'INCOMING_TEXT');
  }
  
  return (
    <div className="sendBack">
      <input onInput={displayAndSend}></input><br></br>
      sendback: {text}
    </div>
  );
}

export default SendBack;
