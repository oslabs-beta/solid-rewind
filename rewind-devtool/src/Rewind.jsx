import {  getOwner, DEV, runWithOwner } from 'solid-js';

import 'solid-devtools';
import Tree from './Tree'
import * as rewind from './rewind';
import { buildComponentTree } from './compTree';

import { analizeStateChange, unflagDontRecordNextChange, getDontRecordFlag } from './stateParser';
import { reverse, next, saveOwner, logChangeStack } from './solid-rw';
import { sendTreeToChrome } from './treeView';
import { rewindStores, addStoreStateToHistory  } from './rewind-store';

// initilize rewind
rewind.init();

//this helps to manage the listener, so that changes are only observed once
//we should clean this up to make it into a boolean
let runListenerOnce = 1;

//DevTool component
const Rewind = (props) => {
  
  //establish the owner at the top level component, so that we can pass this owner to internal functions and keep it consistent 
  //if we tried to run these internal functions with their internal owner, we'd see a very different ownership tree
  const rewind = getOwner(); 
  console.log('full tree', rewind);

  // console.log('SG', DEV.serializeGraph(rewind));
  // console.log('comp tree', buildComponentTree(rewind));

  // save owner
  saveOwner(rewind);

  // get intial comp tree
  getCompTreeAndChildMap();

  async function getCompTreeAndChildMap() {    
    const compTree = await buildComponentTree(rewind);
    console.log("COMP TREE:", compTree);
  }

  // send tree to chrome
  const sendTreeStructure = async () => {
    let ownerTree = await new Tree(rewind);  // replace with my own tree calculator
    console.log("sending owner tree to chrome", ownerTree)
    sendTreeToChrome(ownerTree) // send to chrome extention
  }
  // give it a moment then call
  setTimeout( sendTreeStructure, 2000 );

  //function allows us to reset state of a signal
  const changeScore = ( value, path ) => {
      runWithOwner(owner, async () => {
        const root = await getOwner()
        const source = root.owned[0].owned[0].owned[0].owned[6].sources[0]; 
        //const source = 'root.' + path;
        DEV.writeSignal(source, value);
        })
  }

  //listener watches for changes in the reactive graph
  //when there is a state change in solid, this listener will run
  const listen = async () => {
 
    const GraphUpdateListeners = new Set();
    const setUpRenderChangeEvent = () => {
      GraphUpdateListeners.add(addStoreStateToHistory);
      GraphUpdateListeners.add(async () => {
        // dont run this at all if we are reversing or nexting
        if (getDontRecordFlag()) {
          unflagDontRecordNextChange();
          return;
        }

        runListenerOnce--
        if (runListenerOnce === 0) {
          runWithOwner(rewind, async () => {
            console.log("====================================")
            console.log('SERIALIZED GRAPH', DEV.serializeGraph(rewind));
            let ownerObj = await getOwner();
            console.log("here's the app's tree without parsing", ownerObj)
            let ownerTree = await new Tree(ownerObj); 
            console.log("owner tree", ownerTree)
            let sourcesState = await ownerTree.parseSources();
            console.log('sourcesState', sourcesState)
            // get and save comp tree
            getCompTreeAndChildMap();
            // send this sourcesState to stateParser
            analizeStateChange( sourcesState );
          })
        }
      })
      GraphUpdateListeners.add(() => runListenerOnce++)
      const runListeners = () => GraphUpdateListeners.forEach(f => f())
      if (typeof window._$afterUpdate === 'function') {
        GraphUpdateListeners.add(window._$afterUpdate)
      }
      window._$afterUpdate = runListeners
    }
    setUpRenderChangeEvent();
  
  }
  listen()

    return (
    <>
      {/* <button onClick={() => logChangeStack()}>log changes</button>
      <button onClick={() => reverse()}>Rewind</button>
      <button onClick={() => next()}>Forward</button> */}
      <button onClick={() => rewindStores(true)}>Rewind State</button>
      <button onClick={() => rewindStores(false)}>Fast Forward State</button>
    <div class='rewind'>{props.children} </div>
    </>
    )
}

export default Rewind;