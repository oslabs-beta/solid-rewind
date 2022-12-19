import { createSignal, createEffect, getOwner, DEV, runWithOwner, useContext, createRenderEffect } from 'solid-js';

import 'solid-devtools';
import { debugComputation, debugOwnerComputations, debugSignals, debugSignal, debugOwnerSignals, debugProps } from '@solid-devtools/logger'
import Tree from './Tree'

let runListenerOnce = 1;
const Rewind = (props) => {
  const rewind = getOwner(); 


  const changeScore = (owner) => {
      runWithOwner(owner, async () => {
        const root = await getOwner()
        const observers = root.owned[0].owned[0].owned[0].owned[6].sources[0].observers
        for (const observer of observers) {
          
        }

        console.log("defineGetter", root.owned[0].owned[0].owned[0].owned[6].sources[0].__lookupGetter__)
        const source = root.owned[0].owned[0].owned[0].owned[6].sources[0]; 
        Object.assign(source, { value : 15 })
        console.log(root.owned[0].owned[0].owned[0].owned[6].sources[0])
        })
  }



//this was the original iteration to find signals throughout the app, 
//this well be deleted soon, but we're keeping it here to help complete the 
//signal search methods in the Tree class
  // function defineSrcMap(owner) {
  //   const arr = []
  //   if (owner.sourceMap) {
  //     const sourceMap = owner.sourceMap
  //     for(const ele in sourceMap) {
  //       console.log('the sourceMap is', ele,  sourceMap, owner)
  //       if(sourceMap[ele].name && sourceMap[ele].value) {
  //         console.log('state found on 47',{'name' : sourceMap[ele].name, 'value' : sourceMap[ele].value})
  //         arr.push({'name' : sourceMap[ele].name, 'value' : sourceMap[ele].value});
  //       }
  //     }
  //   }
    
  //   if (owner.sources) {
  //     const sources = owner.sources;
  //     for (const key in sources) {
  //       const source = sources[key]
  //       //helps us get signals outside of components
  //       if (source.name && source.name !== 's9' && source.name[0] !== 'c') {
  //         console.log('state found on 57', {'name' : source.name, 'value' : source.value})
  //         arr.push({'name' : source.name, 'value' : source.value});
  //       }
  //       //helps us to get Stores
  //       if (source.name && source.name[0] == 'c' && source.sourceMap) {
  //         console.log("store found on 63", source.sourceMap)
  //         for(const key in source.sourceMap){
  //           console.log('key', key)
  //           if(source.name && source.sourceMap[key].value["Symbol(store-name)"] && source.sourceMap[key].value) {
  //             console.log("state found on 65!", {'name' : source.sourceMap[key].name, 'value' : source.sourceMap[key].value})
  //             arr.push({'name' : source.sourceMap[key].name, 'value' : source.sourceMap[key].value});
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return arr;
  // }  
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
            // let sourceMapState = await ownerTree.parseSourceMap()
            // console.log("sourceMapState", sourceMapState)
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
      <button onClick={() => changeScore(rewind)}>SETBACKCOUNT</button>
    <div class='rewind'>{props.children} </div>
    </>
    )
}

export default Rewind;