import {  getOwner, DEV, runWithOwner } from 'solid-js';

import 'solid-devtools';
import Tree from './tree'
import { init } from './rewind-init';
import { buildComponentTree } from './logger-treeview/compTree';
import { analyzeStateChange, unflagDontRecordNextChange, getDontRecordFlag } from './stateParser';
import { saveOwner } from './solid-rw';
import { sendTreeToChrome } from './logger-treeview/treeView';
import { addStoreStateToHistory, setHistoryAfterUpdate  } from './rewind-store';

// Trying to get prod mode or not.
console.log(import.meta.env.PROD);

// initilize rewind
init();

//this helps to manage the listener, so that changes are only observed once
//we should clean this up to make it into a boolean
let runListenerOnce = 1;

//DevTool component
const Rewind = (props) => {

  console.log(`%c app mode: ${ process.env.NODE_ENV }`, `color:purple; font-weight: bold`);

  // Disable in production mode
  if (process.env.NODE_ENV === 'production') {
    console.log('production mode, Solid-Rewind disabled');
    console.log(`%c production mode, Solid-Rewind disabled`, `color:orange; font-weight: bold`);
    return ( <div class='rewind'>{props.children} </div> );
  }
  
  //establish the owner at the top level component, so that we can pass this owner to internal functions and keep it consistent 
  //if we tried to run these internal functions with their internal owner, we'd see a very different ownership tree
  const owner = getOwner(); 

  // save owner, passed to dev-tool functions
  saveOwner(owner);

  // send tree to chrome
  const sendTreeStructure = async (_owner) => {
    //building component trees
    let compTree = await buildComponentTree(_owner);
    // send to chrome extention + convert to a json-safe format
    sendTreeToChrome(compTree)
  }

  // give it a moment then call
  setTimeout( sendTreeStructure, 2000, owner );

  //function allows us to reset state of a signal
  addStoreStateToHistory();

  //listener watches for changes in the reactive graph
  //when there is a state change in solid, this listener will run
  const listen = () => {
 
    //creating a new set
    const GraphUpdateListeners = new Set();
  
    const setUpRenderChangeEvent = () => {

      //adding a new data only when we are getting a new data set.
      GraphUpdateListeners.add( () => {
        // dont run this at all if we are reversing or nexting
        if (getDontRecordFlag()) {
          unflagDontRecordNextChange();
          return;
        }
        //setting it 0 to initiate the invokation of the function.
        runListenerOnce--

        if (runListenerOnce === 0) {
          runWithOwner(owner, async () => {
            //creating a new owner object
            let ownerObj = await getOwner();
            //creating a new tree
            let ownerTree = await new Tree(ownerObj); 
            //parsing the tree data
            let sourcesState = await ownerTree.parseSources();
            // build component tree and send it to chrome extension
            sendTreeStructure(ownerObj);

            // send this sourcesState to stateParser
            analyzeStateChange( sourcesState );
        })}
      })

      //putting runListenerOnce back to 1 so that function works once
      GraphUpdateListeners.add(() => {
        runListenerOnce++ 
      })

      
      GraphUpdateListeners.add(setHistoryAfterUpdate)
      const runListeners = () => {
        GraphUpdateListeners.forEach(f => f());
        runListenerOnce = 1;
      }
      window._$afterUpdate = runListeners
    }

    setUpRenderChangeEvent();

  }
  
  listen()
  
    return (
    <div class='rewind'>{props.children} </div>
    )
}

export default Rewind;