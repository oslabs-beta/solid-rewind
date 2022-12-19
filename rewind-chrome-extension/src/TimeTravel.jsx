/* global chrome */
import { style } from 'solid-js/web';
import styles from './App.module.css';
import SendBack from './SendBack';
import TimelineScrubber from './TimelineScrubber';
import StateCopyWindow from './StateCopyWindow';

function TimeTravel() {

  return (
    <div class={styles.container}>
      <TimelineScrubber />
      <StateCopyWindow />
    </div>
  );
}

export default TimeTravel;
