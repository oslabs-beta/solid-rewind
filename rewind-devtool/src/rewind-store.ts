import { DEV } from "solid-js/store";
import {  createSignal, batch, $PROXY } from 'solid-js';
import { ChangeObj, sendStateIncrement } from "./stateParser";
import { addToChangeStack } from './solid-rw';


let currentUpdates = {};
const past: any = []; 
const future: any = [];

export function rewindStores(rewind) {
    batch(() => {
        if (rewind === true) {
            if (past.length) {
                const change = past.pop();
                changeStoreState(change.oldState, change.state)
                future.push(change);
            }
            else return;
        }

        if (rewind === false) {
            if (future.length) {
                const change = future.pop();
                changeStoreState(change.newState, change.state)
                past.push(change)
            }
            else return;
        }

        function changeStoreState(stateToSet, state) {
            const nodes = state[DEV.$NODE];

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
        };
    })
}

const logChangeToChromeTool = () => {
    const change: ChangeObj = {
        name: '',
        prev: '',
        next: '',
        path: '',
        store: true,
        observers: []
    }
    // send message that state changed
    sendStateIncrement();
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
    const newCopy = Array.isArray(currentUpdates.state) ? currentUpdates.state.slice() : Object.assign({}, currentUpdates.state);
    currentUpdates.newState = newCopy;
    past.push(currentUpdates);
    currentUpdates = {};
    logChangeToChromeTool(); // store change

    // clear future
    future.length = 0;
}