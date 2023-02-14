import {  getOwner, DEV, runWithOwner } from 'solid-js';

import 'solid-devtools';
import Tree from './tree'
import { init } from './rewind-init';
import { buildComponentTree } from './logger-treeview/compTree';
import { analyzeStateChange, unflagDontRecordNextChange, getDontRecordFlag } from './stateParser';
import { saveOwner } from './solid-rw';
import { sendTreeToChrome } from './logger-treeview/treeView';
import { addStoreStateToHistory, setHistoryAfterUpdate  } from './rewind-store';
import { listenFor } from './sender';

const debugMode = true;

// initilize rewind
init();

//this helps to manage the listener, so that changes are only observed once
//we should clean this up to make it into a boolean
let runListenerOnce = 1;

//DevTool component
const Rewind = (props) => {

  //console.log(`%c app mode: ${ process.env.NODE_ENV }`, `color:purple; font-weight: bold`);

  // Disable in production mode
  if (process.env.NODE_ENV === 'production' && !props.runInProduction) {
    console.log(`%c production mode, Solid-Rewind disabled`, `color:orange; font-weight: bold`);
    return ( <div class='rewind'>{props.children} </div> );
  }
  if (props.runInProduction) {
    console.log(`%cWARNING: Solid Rewind is a debugger tool meant for development mode. We do not recommend enabling it for production.`, `color:orange; font-weight: bold`);
  }
  
  //establish the owner at the top level component, so that we can pass this owner to internal functions and keep it consistent 
  //if we tried to run these internal functions with their internal owner, we'd see a very different ownership tree
  const owner = getOwner(); 
  console.log(owner)

  // save owner, passed to dev-tool functions
  saveOwner(owner);

  // send tree to chrome
  const sendTreeStructure = async (_owner) => {
    //building component trees
    let compTree = await buildComponentTree(_owner);
    // send to chrome extention + convert to a json-safe format
    sendTreeToChrome(compTree)
  }

  // respond to initial request for the component tree
  const requestTree = () => {
    runWithOwner(owner, async () => {
      let ownerObj = await getOwner();
      sendTreeStructure(ownerObj); // build component tree and send it to chrome extension
    })
  }
  // listen for initial tree requests
  listenFor('INITAL TREE REQUEST', requestTree);

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
            console.log("line90", ownerTree)
            //parsing the tree data
            let sourcesState = await ownerTree.parseSources();
            sendTreeStructure(ownerObj); // build component tree and send it to chrome extension

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