import styles from './App.module.css';
import TimeTravelControls from './TimeTravelControls';
import CopyPasteState from './CopyPasteState';
import Disclaimer from '../Disclaimer';

function TimeTravel() {

  return (
    <div class={styles.container}>
      <Disclaimer/>
      <TimeTravelControls />
      {/* <CopyPasteState /> */}
    </div>
  );
}

export default TimeTravel;
