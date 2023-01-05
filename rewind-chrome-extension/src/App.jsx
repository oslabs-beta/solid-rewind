import logo from './logo.svg';
import styles from './App.module.css';

import TimeTravel from './TimeTravel';
import TreeView from './TreeView';

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
