import { addToChangeStack, getChildMap } from './solid-rw';
import { sendData } from './sender';

type StateObject = {
  name: string,
  path: string,
  store: boolean,
  value: any
}

export type changeObj = {
  name: string,
  prev: any,
  next: any,
  path: string,
  store: boolean,
  observers: any
}

// new and old state
const stateChange: any = [];


const flagDontRecord = [false];

export const flagDontRecordNextChange = () => {
  flagDontRecord[0] = true;
}

export const unflagDontRecordNextChange = () => {
  flagDontRecord[0] = false;
}

export const getDontRecordFlag = () => {
  return flagDontRecord[0];
}

export const analizeStateChange = ( sourcesState: any ) => {

  console.log("INCOMING STATE CHANGE TO ANALIZE:", sourcesState);

  console.log('oldState initial:', stateChange);

  // add state to our last / newState
  stateChange.push( sourcesState );

  console.log('oldState:', stateChange[0]);
  console.log('newState:', stateChange[1]);

  // if newState exists, compare the two
  if (stateChange.length === 2) findStateChanges();

  // move new state to lastState
  stateChange[0] = stateChange.pop();
}


// get all observers of this state item
const getObserverNamesFromChange = ( change: any ) : any => {
  const observers = []
  if (change?.underlyingSource?.observers?.length) {
    for (const o of change.underlyingSource.observers) {
      observers.push(o.name);
    }
  }
  return observers;
}



// compare states to find changes
const findStateChanges = () => {
  const oldState: any = stateChange[0];
  const newState: any = stateChange[1];

  // gets old keys to itterate over
  const oldKeys = Object.keys(oldState);

  // a copy of the new state. we'll remove items from here as we check them off. left over items will be anything that was added to the state on this render.
  const remainingNewKeys = {...newState}

  // log of changes that occured this render
  const changes = [];

  // checks for elements that were changed or removed
  for (const k of oldKeys) {
    // key removed
    if (!newState[k]) {
      const change = createChange(oldState[k], '__removed__');
      changes.push(change);
    }
    // change occured
    else if (oldState[k].value != newState[k].value) {
      const change = createChange(oldState[k], newState[k].value);
      changes.push(change);
    }
    // remove key from list
    if (newState[k]) delete remainingNewKeys[k]// remove key from both
  }

  // next add changes that are new elements
  const newKeys = Object.keys(remainingNewKeys);
  for (const k of newKeys) {
    const change = createChange(newState[k], newState[k].value, true);
    changes.push(change);
  }

  // long changes and push them to the change stack
  console.log('CHANGES:', changes);
  //changeStack.push(changes);

  // add changes to change stack
  for (const change of changes) {
    // send message that state changed
    sendStateIncrement();
    // add change to stack
    addToChangeStack(change);

    // this is not the right place for this... or at least not the only place
    logNamedAppThatChangeAffected(change.observers);
  }
}

///////////// SEND STATE CHANGE ////////////////
export function sendStateIncrement () {
  sendData(undefined, 'STATE_INCREMENT');
}


const createChange = (obj:StateObject, changedTo = '', newItem = false) => {
  const change: changeObj = {
    name: obj.name,
    prev: newItem ? '__new__' : obj.value,
    next: changedTo,
    path: obj.path,
    store: obj.store,
    observers: getObserverNamesFromChange(obj)
  }
  return change;
}


// WHEN DO I CALL THIS ?????
const logNamedAppThatChangeAffected = ( observers: Array<string> ) => {
  console.log('changes observers:', observers);

  const childMap = getChildMap();
  console.log('child map:', childMap);

  if (!childMap) {
    console.log("ALERT!!! COMP TREE EMPTY!")
    return;
  }

  for (const o of observers) {
    console.log("COMPONENT TOUCHED:", childMap[o])
  }

}


