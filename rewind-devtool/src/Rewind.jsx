import {  getOwner, DEV, runWithOwner } from 'solid-js';

import 'solid-devtools';
import Tree from './tree'
import { init } from './rewind-init';
import { buildComponentTree } from './logger-treeview/compTree';

import { analizeStateChange, unflagDontRecordNextChange, getDontRecordFlag } from './stateParser';
import { reverse, next, saveOwner, logChangeStack } from './solid-rw';
import { sendTreeToChrome } from './logger-treeview/treeView';
import { rewindStores, addStoreStateToHistory, setHistoryAfterUpdate  } from './rewind-store';
import log from './logger';

// DEBUG
const debugMode = true;

// initilize rewind
init();

//this helps to manage the listener, so that changes are only observed once
//we should clean this up to make it into a boolean
let runListenerOnce = 1;

//DevTool component
const Rewind = (props) => {
  
  //establish the owner at the top level component, so that we can pass this owner to internal functions and keep it consistent 
  //if we tried to run these internal functions with their internal owner, we'd see a very different ownership tree
  const owner = getOwner(); 

  // save owner, passed to dev-tool functions
  saveOwner(owner);

  // get intial comp tree
  getCompTreeAndChildMap();

  async function getCompTreeAndChildMap() {    
    const compTree = await buildComponentTree(owner);
  }

  // send tree to chrome
  const sendTreeStructure = async () => {
    let ownerTree = await new Tree(owner);  // replace with my own tree calculator
    sendTreeToChrome(ownerTree) // send to chrome extention
  }
  // give it a moment then call
  setTimeout( sendTreeStructure, 2000 );

  //function allows us to reset state of a signal
  addStoreStateToHistory();

  //listener watches for changes in the reactive graph
  //when there is a state change in solid, this listener will run
  const listen = () => {
 
    const GraphUpdateListeners = new Set();
    const setUpRenderChangeEvent = () => {

      GraphUpdateListeners.add( () => {
        // dont run this at all if we are reversing or nexting
        if (getDontRecordFlag()) {
          unflagDontRecordNextChange();
          return;
        }

        console.log("rlonce just before decrement",runListenerOnce )
        runListenerOnce--

        if (runListenerOnce === 0) {
          runWithOwner(owner, async () => {
            let ownerObj = await getOwner();
            let ownerTree = await new Tree(ownerObj); 
            let sourcesState = await ownerTree.parseSources();
            // get and save comp tree
            getCompTreeAndChildMap();
            // send this sourcesState to stateParser
            analizeStateChange( sourcesState );
        })}

      })

      GraphUpdateListeners.add(() => {
        console.log("runListenerOnce", runListenerOnce)
        runListenerOnce++ 
      })

      GraphUpdateListeners.add(setHistoryAfterUpdate)

      const runListeners = () => {
        GraphUpdateListeners.forEach(f => f());
        console.log('inside run listeners')
      }

      // if (typeof window._$afterUpdate === 'function') {
      //   GraphUpdateListeners.add(window._$afterUpdate)
      // }

      window._$afterUpdate = runListeners
      log('ONCE','Rewind.jsx');
      console.log("Here's graph update listeners", GraphUpdateListeners)
    }

    setUpRenderChangeEvent();


  }
  
  listen()

    return (
    <>
    <div class='rewind'>{props.children} </div>
    </>
    )
}

export default Rewind;