/* global chrome */
import { createSignal } from 'solid-js';

function SendBack() {

  const [text, updateText] = createSignal('');

  const displayAndSend = (e) => {
    // display text in app
    updateText(e.target.value);
    // send text back to client
    sendMessageBackToWebpage(e.target.value);
  }

  const sendMessageBackToWebpage = async (msg) => {
    console.log("try to send message back to webpage...", msg);
    const response = await chrome.runtime.sendMessage({reply: msg});
  }
  
  return (
    <div className="sendBack">
      <input onInput={displayAndSend}></input><br></br>
      sendback: {text}
    </div>
  );
}

export default SendBack;
