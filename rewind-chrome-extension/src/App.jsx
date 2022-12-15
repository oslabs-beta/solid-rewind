import logo from './logo.svg';
import styles from './App.module.css';

import TimeTravel from './TimeTravel';

// import {listenFor} from './listener';

// function copyStateToClipboard( state ) {
//   console.log("GOT HERE!!!!");
//   navigator.clipboard.writeText(JSON.stringify(state));
// }

function App() {

  // listenFor('COPY_OF_STATE', copyStateToClipboard);

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <TimeTravel />
      </header>
    </div>
  );
}

export default App;
