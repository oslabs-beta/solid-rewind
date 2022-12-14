/* global chrome */
import { createSignal } from 'solid-js';
import SendBack from './SendBack';

function Listener() {

  const [data, updateData] = createSignal('waiting...');

  // put here so this only gets added once
  console.log('ONCE: adding event listener to listen for incoming messages from page');
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("DevTab --- App.js:", request)
      updateData(request.text);
    }
  );

  return (
    <div className="App">
      <header className="App-header">
        {data}
        <SendBack />
      </header>
    </div>
  );
}

export default Listener;
