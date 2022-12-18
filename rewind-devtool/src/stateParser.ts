
type StateObject = {
  name: string,
  path: string,
  store: boolean,
  value: any
}

type changeObj = {
  name: string,
  prev: any,
  next: any,
  path: string,
  store: boolean
}

// change stacks
const changeStack: any = [];
const changeFutureStack: any = [];

// stack of state changes
//const stateStack: Array<Array<StateObject>> = [];
const stateStack: any = [];

export const createDummyStateHistory = ( amountOfHistory: number = 2 ) => {
  // creates inital state
  createInitialDummyState();
  // builds a changed state
  createChangedState();
  // console log the two states
  console.log('state stack:', stateStack);

  // compare states and find changes
  findStateChanges();
}



// compare states to find changes
const findStateChanges = () => {
  // gets old keys to itterate over
  const oldKeys = Object.keys(stateStack[0]);

  // a copy of the new state. we'll remove items from here as we check them off. left over items will be anything that was added to the state on this render.
  const remainingNewKeys = {...stateStack[1]}

  // log of changes that occured this render
  const changes = [];

  // checks for elements that were changed or removed
  for (const k of oldKeys) {
    console.log(k);
    // key removed
    if (!stateStack[1][k]) {
      console.log('key ', k, ' was removed');
      const change = createChange(stateStack[0][k], '__removed__');
      changes.push(change);
    }
    // change occured
    else if (stateStack[0][k].value != stateStack[1][k].value) {
      const change = createChange(stateStack[0][k], stateStack[1][k].value);
      changes.push(change);
    }
    // remove key from list
    if (stateStack[1][k]) delete remainingNewKeys[k]// remove key from both
  }

  // next add changes that are new elements
  const newKeys = Object.keys(remainingNewKeys);
  for (const k of newKeys) {
    const change = createChange(stateStack[1][k], stateStack[1][k].value, true);
    changes.push(change);
  }

  // long changes and push them to the change stack
  console.log('CHANGES:', changes);
  changeStack.push(changes);
}

const createChange = (obj:StateObject, changedTo = '', newItem = false) => {
  const change: changeObj = {
    name: obj.name,
    prev: newItem ? '__new__' : obj.value,
    next: changedTo,
    path: obj.path,
    store: obj.store
  }
  return change;
}






// BUILDS DUMMY STATES FOR TESTING PUROOSES
// create dummy state
const createInitialDummyState = (numStateEl: number = 5, forceChange: number = -1, addStates: number = 0 ): void => {
  const cState = {};

  for (let i: number = 0; i < numStateEl + addStates; i++) {
    const name = ('name_'+i);
    const newStateObj: StateObject = { name, path: '/', store: false, value: i };
    cState[name] = newStateObj;
  }

   console.log('generated initial object:', cState);
   // push to stack
   stateStack.push(cState);
}

// create new, changed state
const createChangedState = (remove = false): void => {
  const nState = [];

  let addedElements = Math.random() < 0.5 ? 0 :  Math.floor(Math.random() * 4);

  // keys of the state
  const stateKeysToCopy = Object.keys(stateStack[0]);

  // chooses which part of state will be altered.
  const stateChangeItem: number =  Math.floor(Math.random() * stateKeysToCopy[0].length);


  // duplicate state and change a few random values
  for (let i: number = 0; i < stateKeysToCopy.length; i++) {
    const key = stateKeysToCopy[i]
    const name = stateStack[0][key].name;
    const newStateObj: StateObject = { name, path: stateStack[0][key].path, store: stateStack[0][key].store, value: stateStack[0][key].value };
    if (i === stateChangeItem) newStateObj.value = Math.random();
    nState[name] = newStateObj;
  }

  // add some random new state elements
  while (addedElements > 0 && !remove) {
    const name = 'new_'+ Math.floor(Math.random() * 10000);
    const newStateObj: StateObject = { name, path: '/new/', store: false, value: Math.random() };
    nState[name] = newStateObj;
    //const addAt = Math.floor(Math.random() * nState.length)
    //nState.splice(addAt, 0, newStateObj);
    addedElements--;
  }

  // if remove is on, it removes a state elment instead of adding one
  if (remove) {
    // element to remove
    const keys = Object.keys(nState);
    const key = keys[Math.random() * keys.length];
    delete nState[key];
    //const removeElement: number =  Math.floor(Math.random() * nState.length);
    //nState.splice(removeElement, 1);
  }

  // log and push to stack
  console.log('generated initial state:', nState);
  stateStack.push(nState);
}
