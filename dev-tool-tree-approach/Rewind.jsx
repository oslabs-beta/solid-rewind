import { createSignal, createEffect, getOwner, DEV, runWithOwner, useContext, } from 'solid-js';

import 'solid-devtools';
import { debugComputation, debugOwnerComputations, debugSignals, debugSignal, debugOwnerSignals, debugProps } from '@solid-devtools/logger'
import Tree from './Tree'




const Rewind = (props) => {
  console.log(getOwner())
  let path = 'getOwner()'
  const tree = new Tree(getOwner())
  console.log("the Tree is", tree)

  function traverseOwnerObject(owner, found = false) {

    //function helps parse the owner tree
    const storage = [];
    const queue = [owner];



      while(queue.length > 0) {
        const currOwner = queue.shift();
        if(defineSrcMap(currOwner, path).length){
            storage.push(defineSrcMap(currOwner));
        }
    }
    if(currOwner.owned) {
      for(const children of currOwner.owned) {
        queue.push(children);
      }
    }
    return [...storage]
  }
  
  function defineSrcMap(owner, path) {
    const arr = []
    if (owner.sourceMap) {
      const sourceMap = owner.sourceMap
      for(const ele in sourceMap) {
        console.log('the sourceMap is', ele,  sourceMap, owner)
        if(sourceMap[ele].name && sourceMap[ele].value) {
          console.log('state found on 47',{'name' : sourceMap[ele].name, 'value' : sourceMap[ele].value})
          arr.push({'name' : sourceMap[ele].name, 'value' : sourceMap[ele].value});
        }
      }
    }
    
    if (owner.sources) {
      const sources = owner.sources;
      for (const key in sources) {
        const source = sources[key]
        //helps us get signals outside of components
        if (source.name && source.name !== 's9' && source.name[0] !== 'c') {
          console.log('state found on 57', {'name' : source.name, 'value' : source.value})
          arr.push({'name' : source.name, 'value' : source.value});
        }
        //helps us to get Stores
        if (source.name && source.name[0] == 'c' && source.sourceMap) {
          console.log("store found on 63", source.sourceMap)
          for(const key in source.sourceMap){
            console.log('key', key)
            if(source.name && source.sourceMap[key].value["Symbol(store-name)"] && source.sourceMap[key].value) {
              console.log("state found on 65!", {'name' : source.sourceMap[key].name, 'value' : source.sourceMap[key].value})
              arr.push({'name' : source.sourceMap[key].name, 'value' : source.sourceMap[key].value});
            }
          }
        }
      }
    }
    return arr;
  }

  const listen = () => {
  
    const passin = getOwner();
    // for(const ele in passin){
    //   passin[ele].value = 15
    // }
    const listOfStates = []
    const GraphUpdateListeners = new Set();
    const setUpRenderChangeEvent = () => {
      GraphUpdateListeners.add(() => {
        let currentState = [];
        currentState.push(traverseOwnerObject(passin))
        //reminder to add a condition that checks if the current state is
        //different than the last state
        listOfStates.push([...currentState]);
        // console.log('store I found...', getOwner().owned[0].owned[0].owned[0].owned[3].sources[0].sourceMap["s-1344798530"])
        // console.log(listOfStates)
      });
      const runListeners = () => GraphUpdateListeners.forEach(f => f())
      if (typeof window._$afterUpdate === 'function') {
        GraphUpdateListeners.add(window._$afterUpdate)
      }
      window._$afterUpdate = runListeners
    }
    setUpRenderChangeEvent();
  
  }
  listen()
    return <div class='rewind'>hello {props.children} </div>
}

export default Rewind;