import { addToChangeStack, getChildMap } from './solid-rw';
import { sendData } from './sender';
import log from './logger';

const debugMode = false;
const debugShowStore = false;
const debugShowPropigation = false;

type StateObject = {
  name: string,
  path: string,
  store: boolean,
  value: any
}

export type ChangeObj = {
  name: string,
  prev: any,
  next: any,
  path: string,
  store: boolean,
  observers: any
}

// new and old state
const stateHistory: any = [];
const stateFuture: any = [];


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

export const analyzeStateChange = ( sourcesState: any ) => {
  // add state to our last / newState
  stateHistory.push( sourcesState );

  // if newState exists, compare the two
  if (stateHistory.length >= 2) findStateChanges();
}

// when we go back in time, we need to also reverse the saved state history
export const reverseSavedStateHistory = () => {
  stateFuture.push( stateHistory.pop() );
}

export const forwardInSavedStateHistory = () => {
  stateHistory.push( stateFuture.pop() );
}

export const clearSavedStateFuture = () => {
  stateFuture.length = 0;
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
  const oldState: any = stateHistory[stateHistory.length-2];
  const newState: any = stateHistory[stateHistory.length-1];

  // gets old keys to itterate over
  const oldKeys = Object.keys(oldState);

  // a copy of the new state. we'll remove items from here as we check them off. left over items will be anything that was added to the state on this render.
  const remainingNewKeys = {...newState}

  // log of changes that occured this render
  const changes = [];

  // checks for elements that were changed or removed
  for (const k of oldKeys) {

    // key removed
    if (!newState[k]) { // dont need this
      log(['REMOVED STATE', k], 'NOTE!', 'red');
    }

    // change occured
    else if (oldState[k].value != newState[k].value) {
      const change = createChange(oldState[k], newState[k].value);
      changes.push(change);
    }
    // remove key from list
    if (newState[k]) delete remainingNewKeys[k]// remove key from both
  }

  // long changes and push them to the change stack
  if (debugShowStore) console.log('CHANGES:', changes);

  // add changes to change stack
  for (const change of changes) {
    if (change.path.includes('sourceMap')) change.store = true;

    // add change to stack
    addToChangeStack(change);

    // this is not the right place for this... or at least not the only place
    logNamedAppThatChangeAffected(change.observers);
  }
}

///////////// SEND STATE CHANGE ////////////////


const createChange = (obj:StateObject, changedTo = '', newItem = false) => {
  const change: ChangeObj = {
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
  if (debugShowPropigation) console.log('changes observers:', observers);

  const childMap = getChildMap();
  if (debugShowPropigation) console.log('child map:', childMap);

  if (!childMap) {
    if (debugShowPropigation) console.log("ALERT!!! COMP TREE EMPTY!")
    return;
  }

  for (const o of observers) {
    if (debugShowPropigation) console.log("COMPONENT TOUCHED:", childMap[o])
  }

}


