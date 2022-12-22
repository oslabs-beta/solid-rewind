import { senderInit } from './sender';
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




