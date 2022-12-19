export function initSR() {
  setupListeners();
}

////////////// TIME CONTROL LISTENERS FOR EVENTS FORM CHROME DEVTOOL /////////////////////
function setupListeners() {
  sender.listenFor('BACK', travelBack);
  sender.listenFor('FORWARD', travelForward);
  sender.listenFor('COPY_STATE', copyState);
  sender.listenFor('LOAD_STATE', loadState);
}

// CHANGE STACKS
const changeStack = [];
const changeFutureStack = [];

export const addToChangeStack = ( change ) => {
  changeStack.push(change);
  clearFutureStack();
}

const clearFutureStack = () => {
  changeFutureStack.length = 0;
}

// GO BACK IN TIME
const reverse = () => {
  // if stack is empty, do nothing
  if (changeStack.length === 0) return;
  // get the change to reverse
  const rev = changeStack.pop();

  // execute change
  setState();

  // add change to future stack
  changeFutureStack.push(rev);
}


// GO FORWARD IN TIME
const next = () => {
  // if stack is empty, do nothing
  if (changeFutureStack.length === 0) return;
  // get the next change
  const next = changeFutureStack.pop();
  
  // excute change
  setState();

  // add change to change stack
  changeStack.push(next);
}

// Travel back or forth multiple steps
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

    // set state
    setState();
  }

  // clear future stack
  clearFutureStack();
}





//// FUNCTION FOR ROBBIE TO DO ////

const setState = (x, y, z) => {

}
