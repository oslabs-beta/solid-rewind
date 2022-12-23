import { DEV } from "solid-js/store";
import {  createSignal, batch, $PROXY } from 'solid-js';
import { ChangeObj, sendStateIncrement } from "./stateParser";
import { addToChangeStack } from './solid-rw';


let CurrentUpdates = new Map();
const past: any = []; 
const future: any = [];
let current: any;
const [track, trigger] = createSignal(undefined, { equals: false });

export function rewindStores(rewind) {
    batch(() => {
        const map = new Map();
        if (rewind === true) {
        if (past.length) {
            if (current) {
            future.push(current);
            }
            current = past.pop();
            if (future.length === 0) {
            const currentState = current.entries().next().value[0]
            const currentStateCopy = Array.isArray(currentState) ? currentState.slice() : Object.assign({}, currentState);
            const lastStateAdd = new Map()
            lastStateAdd.set(currentState, currentStateCopy);
            future.push(lastStateAdd)
            }
            current.forEach((OldStateCopy, state) => map.set(state, OldStateCopy));
        }
        else return;
        }

        if (rewind === false) {
        if (future.length) {
            if (current) past.push(current)
            current = future.pop();
            current.forEach((OldStateCopy, state) => {
            map.set(state, OldStateCopy)});
        }
        else return;
        }
        trigger();

        map.forEach((OldStateCopy, state) => {



        const nodes = state[DEV.$NODE];
        if (Array.isArray(OldStateCopy)) {
            const len = state.length; 
            for (let i = 0; i < OldStateCopy.length; i++) {
            state[i] = OldStateCopy[i];
            nodes[i]?.$(() => OldStateCopy[i]);
            }
            if (len !== OldStateCopy.length) {
            state.length = OldStateCopy.length;
            nodes.length?.$(OldStateCopy.length);
            }
        } 
        else {
            const stateKeys = new Set(Object.keys(state));
            for (const [key, value] of Object.entries(OldStateCopy)) {
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
    });

    // CONSOLE LOG
    console.log('Store_Past:', past);
    console.log('Store_Futu:', future);
    console.log('Store_Curr:', current);
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
      const Oldcopy = Array.isArray(state) ? state.slice() : Object.assign({}, state);
      CurrentUpdates.set(state, Oldcopy);
      console.log("Current Updates" , CurrentUpdates)
    };
  }
  
export const setHistoryAfterUpdate  = () => {
    if (!CurrentUpdates.size) return;
    past.push(CurrentUpdates);
    CurrentUpdates = new Map();
    logChangeToChromeTool(); // store change

    // clear future
    current = future.pop();
    future.length = 0;
}