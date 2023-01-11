import styles from './App.module.css';

import TimeTravel from './TimeTravel';
import TreeView from './TreeView';
import './index.css';

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
