/* global chrome */
import { createSignal } from 'solid-js';
import { style } from 'solid-js/web';
import styles from './App.module.css';
import TimeTravelControls from './TimeTravelControls';
import CopyPasteState from './CopyPasteState';

function TimeTravel() {

  return (
    <div class={styles.container}>
      <TimeTravelControls />
      {/* <CopyPasteState /> */}
    </div>
  );
}

export default TimeTravel;
