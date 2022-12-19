import {  getOwner, DEV, runWithOwner } from 'solid-js';

import 'solid-devtools';
import Tree from './Tree'

//this helps to manage the listener, so that changes are only observed once
//we should clean this up to make it into a boolean
let runListenerOnce = 1;

//DevTool component
const Rewind = (props) => {
  
  //establish the owner at the top level component, so that we can pass this owner to internal functions and keep it consistent 
  //if we tried to run these internal functions with their internal owner, we'd see a very different ownership tree
  const rewind = getOwner(); 

  //function allows us to reset state of a signal
  const changeScore = (owner = rewind, value, path) => {
      runWithOwner(owner, async () => {
        const root = await getOwner()
        const source = root.owned[0].owned[0].owned[0].owned[6].sources[0]; 
        DEV.writeSignal(source, value);
        })
  }

  //listener watches for changes in the reactive graph
  //when there is a state change in solid, this listener will run
  const listen = async () => {
 
    const GraphUpdateListeners = new Set();
    const setUpRenderChangeEvent = () => {
      GraphUpdateListeners.add(async () => {
        runListenerOnce--
        if (runListenerOnce === 0) {
          runWithOwner(rewind, async () => {
            console.log("====================================")
            let ownerObj = await getOwner();
            console.log("here's the app's tree without parsing", ownerObj)
            let ownerTree = await new Tree(ownerObj); 
            console.log("owner tree", ownerTree)
            let sourcesState = await ownerTree.parseSources();
            console.log('sourcesState', sourcesState)
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
      <button onClick={() => changeScore(rewind, 15)}>Set Back State</button>
    <div class='rewind'>{props.children} </div>
    </>
    )
}

export default Rewind;