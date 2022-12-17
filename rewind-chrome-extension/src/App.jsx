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
        {/* <input type="radio" name="radio-1" className="radio" checked />
        <input type="radio" name="radio-1" className="radio" />
        <button class="btn" >Hello daisyUI</button>
        <button class="btn btn-primary">One</button> */}
        <TimeTravel />
      </header>
    </div>
  );
}

export default App;
