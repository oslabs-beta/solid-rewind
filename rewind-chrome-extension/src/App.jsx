import logo from './logo.svg';
import styles from './App.module.css';

import TimeTravel from './TimeTravel';
import TreeView from './TreeView';

// import {listenFor} from './listener';

// function copyStateToClipboard( state ) {
//   console.log("GOT HERE!!!!");
//   navigator.clipboard.writeText(JSON.stringify(state));
// }

function App() {

  return (
    <div class={styles.App}>
      <TreeView />
      <header class={styles.header}>
        <TimeTravel />
      </header>
    </div>
  );
}

export default App;
