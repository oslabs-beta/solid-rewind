/* global chrome */
import { createSignal } from 'solid-js';
import { style } from 'solid-js/web';
import styles from './App.module.css';
import TimeTravelControls from './TimeTravelControls';
import CopyPasteState from './CopyPasteState';

function TimeTravel() {
  const [data, updateData] = createSignal('waiting...');
  
  // put here so this only gets added once
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.type === 'TEXT') {
        console.log("DevTab --- App.js:", request)
        updateData(request.payload);
      }
    }
  );//let data = { type: "FROM_PAGE", value: 'STATE_INCREMENT' };

  return (
    <div class={styles.container}>
      <TimeTravelControls />
      {/* <CopyPasteState /> */}
    </div>
  );
}

export default TimeTravel;
