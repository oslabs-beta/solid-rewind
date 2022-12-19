// import { srInit } from './solid-rw-wr'; // DELETE THIS 
import { senderInit } from './sender';
import * as stateParser from './stateParser';
import { initSR } from './solid-rw';


export function init() {
  // srInit();   // DELETE THIS 
  initSR();
  senderInit();
  stateParser.createDummyStateHistory();  //  CREATES DUMMY DATA FOR TESTING. SHOULD DELETE
}


// example of exporting default funcitons
export function helloWorld() { return 'Hello World from my example modern npm package!'; }
export function goodBye() { return 'Goodbye from my example modern npm package!'; }


// export * from './solid-rw-wr';  // willem version. will delete once I am confident we don't need any of this code as an example
export * from './sender';

export default {
  init,
  helloWorld,
  goodBye,
};