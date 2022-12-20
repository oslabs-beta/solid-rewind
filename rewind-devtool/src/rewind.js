import { senderInit } from './sender';
import * as stateParser from './stateParser';
import { initSR } from './solid-rw';


// failsafe to be sure this can only be initilized once
let initilized = false;

// call this ince to initilize stuff
export function init() {
  if (initilized) return;

  initSR();
  senderInit();
  
  // initialization complete
  initilized = true;
}

// do i need this
export * from './sender';



// example of exporting default funcitons
// export function helloWorld() { return 'Hello World from my example modern npm package!'; }
// export function goodBye() { return 'Goodbye from my example modern npm package!'; }
// export default {
//   init,
//   helloWorld,
//   goodBye,
// };