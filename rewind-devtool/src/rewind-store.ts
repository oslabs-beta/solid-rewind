import { DEV } from "solid-js/store";
import { batch } from 'solid-js';
import { ChangeObj, flagDontRecordNextChange } from "./stateParser";
import { addToChangeStack } from './solid-rw';

let currentUpdates = {};

export function changeStoreState(stateToSet, state) {
    const nodes = state[DEV.$NODE];

    // flag dont record
    flagDontRecordNextChange();

    // execute changes
    batch(() => {
        if (Array.isArray(stateToSet)) {
            const len = state.length; 
            for (let i = 0; i < stateToSet.length; i++) {
                state[i] = stateToSet[i];
                nodes[i]?.$(() => stateToSet[i]);
            }

            if (len !== stateToSet.length) {
                state.length = stateToSet.length;
                nodes.length?.$(stateToSet.length);
            }
        }

        else {
            const stateKeys = new Set(Object.keys(state));
            for (const [key, value] of Object.entries(stateToSet)) {
                state[key] = value;
                nodes[key]?.$(() => value);
                stateKeys.delete(key);
            }
            for (const key of stateKeys) {
                delete state[key];
                nodes[key]?.$(undefined);
            }
        }
        nodes._?.$();
    });
};

const saveChangeToHistory = (storeChange: any) => {
    const change: ChangeObj = {
        name: '',
        prev: '',
        next: '',
        path: '',
        store: storeChange,
        observers: []
    }
    // add change to stack
    addToChangeStack(change);
}

export const addStoreStateToHistory = () => {
    window._$onStoreNodeUpdate = (state, property, value, prev) => {
      const oldcopy = Array.isArray(state) ? state.slice() : Object.assign({}, state);
      currentUpdates = {state: state, oldState: oldcopy};
    };
  }
  
export const setHistoryAfterUpdate  = () => {
    if (Object.keys(currentUpdates).length === 0) return;
    // add new state to our change
    const newCopy = Array.isArray(currentUpdates.state) ? currentUpdates.state.slice() : Object.assign({}, currentUpdates.state);
    currentUpdates.newState = newCopy;

    // send change
    saveChangeToHistory(currentUpdates);

    // clear current update
    currentUpdates = {};
}