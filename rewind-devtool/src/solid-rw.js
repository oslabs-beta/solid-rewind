import * as solid from "solid-js";

import seedrandom from 'seedrandom';


// create a subscription
const subscribe = (eventName, listener) => {
  document.addEventListener(eventName, listener); /// DONT DO THIS ON DUCCUMENT FOR THE REAL THING
}

// CALL THIS ONCE WHEN APP IS STARTED
// start listener
export function init() {
  subscribe('onStateChange', trackStateChange)
  console.log("FIRST");
  //Load the library and specify options
  // const replace = require('replace-in-file');
  // const options = {
  //   files: './src',
  //   from: /solid-js\'/g,
  //   to: '.\/solid-rw\'',
  // };
  // try {
  //   const results = replace.sync(options);
  //   console.log('Replacement results:', results);
  // }
  // catch (error) {
  //   console.error('Error occurred:', error);
  // }
}

////////////// setter dictionary /////////////
let seededRandom;
const setterDictionary = {}


///////////// OUR SIGNAL CREATOR /////////////
// if we go this route, this would istead be monkey-patched over createSingal, as well as something similar for any other way that a setter can be created.
export default function createSignal( _default ) {
  if (!seededRandom) seededRandom = seedrandom('willem_robbie_christain_jason');
  const uuid = seededRandom();

  // create actual singal
  const [g, s] = solid.createSignal(_default);
  
  // setter that we output that sends an event
  const setter = (v) => { 
    // create event
    const stateChangeEvent = new CustomEvent('onStateChange', {
      detail: {
        curr : g(),
        next : v,
        uuid: uuid,
        setter: s
      }
    });
    
    // dispatch event
    document.dispatchEvent(stateChangeEvent); // SHOULD NOT DISPATCH TO DOCUMENT
    
    // actually set the value
    s(v);
  }

  setterDictionary[uuid] = [g, setter, s];
  
  // maybe just output the normal getter?
  return [g, setter];
}


///////////// STATE REWIND AND STEP /////////////
// stacks
const stateStack = [];
const stateFutureStack = [];

// listen callback
function trackStateChange(e) {
  //console.log("event callback", e.detail);
  stateStack.push(e.detail);
}
// go back
export function reverse() {
  if (stateStack.length === 0) return;
  const rev = stateStack.pop();
  rev.setter(rev.curr);
  stateFutureStack.push(rev);
}
// go forward
export function next() {
  if (stateFutureStack.length === 0) return;
  const next = stateFutureStack.pop();
  next.setter(next.next);
  stateStack.push(next);
}

// save full state
export function copyState() {
  navigator.clipboard.writeText(JSON.stringify(stateStack));
}

// load state
export async function loadState () {
  // get state from clipboard. Normally this would be done elsewhere.
  const stateData = await navigator.clipboard.readText();

  // reverse saved state
  const stateToDo = JSON.parse(stateData).reverse();

  // execute all state
  while (stateToDo.length) {
    const curr = stateToDo.pop();
    console.log(curr);
    setterDictionary[curr.uuid][1](curr.next);
  }

  // clear future stack
  stateFutureStack.length = 0;
}



// everything from solid
export * from 'solid-js';
// my stuff
export {
  createSignal
}