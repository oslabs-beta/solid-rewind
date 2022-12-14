import logo from './logo.svg';
import styles from './App.module.css';

import Listener from './Listener';

function App() {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Listener />
      </header>
    </div>
  );
}

export default App;
