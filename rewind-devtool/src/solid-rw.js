import * as sender from "./sender";
import { DEV, runWithOwner } from 'solid-js';
import { flagDontRecordNextChange, reverseSavedStateHistory } from "./stateParser";
import { rewindStores } from "./rewind-store";
import log from "./logger";
import { sendData } from './sender';

const debugMode = true;
const logChangeStackIndivitually = false;
const clChangeStack = true;


//logic for mapping the children for purposes of mapping named components 
const childMap = [{}];

// get comp tree
export const getChildMap = () => childMap[0];
// set comp tree
export const setChildMap = cm => {
  Object.assign(childMap[0], cm);
}




// call this once to set up listeners
export function initSR() {
  setupListeners();
}

// call this once to save the original owner object //
export function saveOwner( ownerObj ) {
  if (owner.length === 0) owner.push( ownerObj );
}

////////////// TIME CONTROL LISTENERS FOR EVENTS FORM CHROME DEVTOOL /////////////////////
function setupListeners() {
  sender.listenFor('BACK', travelBack);
  sender.listenFor('FORWARD', travelForward);
  sender.listenFor('COPY_STATE', copyState);
  sender.listenFor('LOAD_STATE', loadState);
}

// REF TO ORIGINAL OWERN
const owner = [];


// CHANGE STACKS
const changeStack = [];
const changeFutureStack = [];


// debug function to log current change stack. attach this to a button or something for debugging
export const logChangeStack = () => {
  if (logChangeStackIndivitually) {
    const stringChangeStack = []
    for (const si of changeStack) {
      stringChangeStack.push(JSON.stringify(si));
      log([si, 'soid-rw.js'], `CS Item: ${changeStack.length}`, 'DarkViolet')
    }
    console.log('CS END');
  }
  //log([changeStack], `solid-rw.js: CHANGE STACK: ${changeStack.length}`, 'DarkViolet')
  else {
    log('', `CHANGE STACK: ${changeStack.length}`, 'DarkViolet')
    console.log ('CHANGE STACK:', changeStack);
  }
}

// pushes change to stack. called from stateParser
export const addToChangeStack = ( change ) => {
  if (debugMode) log([change], 'ADDED TO CHANGE STACK', 'BLUE');
  changeStack.push(change);
  if (clChangeStack) logChangeStack();
  clearFutureStack();

  // increment staet in chrome tool
  sendData([changeStack.length], 'STATE_INCREMENT');
}

// clear the future stack. used when recording new things while in the past.
const clearFutureStack = () => {
  changeFutureStack.length = 0;
}

// GO BACK IN TIME
export const reverse = () => {
  // if stack is empty, do nothing
  if (changeStack.length === 0) return;
  // get the change to reverse
  const rev = changeStack.pop();

  if (debugMode) {
    console.log("REVERSE CHANGE:", rev);
    console.log("REMAINING STACK:", changeStack);
  }

  if (rev.store) console.log("R-STORE");
  
  // execute change
  if (!rev.store) setState(rev.prev, rev.path);
  else rewindStores(true); // if it is a store

  // add change to future stack
  changeFutureStack.push(rev);

  // revese saved state history
  reverseSavedStateHistory();

  // log change stack
  if (debugMode) log(changeStack, 'solid-rw');
}


// GO FORWARD IN TIME
export const next = () => {
  // if stack is empty, do nothing
  if (changeFutureStack.length === 0) return;
  // get the next change
  const next = changeFutureStack.pop();

  if (next.store) console.log("N-STORE");

  // excute change
  if (!next.store) setState(next.next, next.path);
  else rewindStores(false); // handle stores

  // add change to change stack
  changeStack.push(next);

  // log change stack
  if (debugMode) log(changeStack, 'change stack');
}



// THESE ARE USED TO TRAVEL FORWARD IN BACK MULTIPLE STEPS AT A TIME
function travelBack( data ) {
  const steps = data.payload;
  for (let i = 0; i < steps; i++) {
    reverse();
  }
}
function travelForward( data ) {
  const steps = data.payload;
  for (let i = 0; i < steps; i++) {
    next();
  }
}




// COPY AND PASTE STATE //
export function copyState() {
  console.log('COPY STATE FUNCTION ENVOKED');
  copyTextToClipboard(JSON.stringify(changeStack));
}

// this method is nessesart to get around focus persmissions for copying data 
function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

// load state
export async function loadState (state) {
  console.log('LOAD STATE FUNCTION ENVOKED');
  console.log('incoming state to load:', state);

  // get state from payload
  let stateData = state?.payload;

  // return if empty
  if (stateData === "") return;

  // reverse saved state
  const stateToDo = JSON.parse(stateData).reverse();

  // execute all state
  while (stateToDo.length) {
    // get element of state to set
    const curr = stateToDo.pop();
    console.log(curr);

    // push change into past stack
    addToChangeStack( curr );

    // set state
    setState(curr.next, curr.path);
  }

  // clear future stack
  clearFutureStack();
}

// call this to set the state
const setState = ( value, path ) => {
  runWithOwner(owner[0], async () => {
    const source = getPathEnd(path);

    if (debugMode) console.log("SOURCE TO SET:", source, "  PATH", path);
    if (debugMode) console.log("TREE", owner[0]);

    // flag upcoming change as one not to record
    flagDontRecordNextChange();

    DEV.writeSignal(source, value);
  });
}

// traverses the string path to actually find the object who's data needs to be set
const getPathEnd = ( path ) => {
  // get path
  const splitPath = path.split('.');
  // will be the end of teh path
  let pathEnd = owner[0];
  // traverse the path
  for (const p of splitPath) {
    if (p === '') continue;
    const pathItem = p.split(/[[\]]+/);
    pathEnd = pathEnd[pathItem[0]][Number(pathItem[1])];
  }
  // return the path
  return pathEnd;
}
