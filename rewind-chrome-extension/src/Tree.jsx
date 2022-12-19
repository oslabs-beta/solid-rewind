/* global chrome */
import { createSignal } from 'solid-js';
import { listenFor } from './listener';


function Tree() {

  const [tree, updateTree] = createSignal({});

  // listen for incoming tree data
  listenFor('TREE', incomingTree);

  // callback to handle tree data
  function incomingTree(tree) {
    console.log("tree data coming from console");
    const appTree = JSON.parse(tree);
    updateTree(appTree);
    console.log('appTree', appTree);
  }

  return (
    <div class='tree'>
      {tree}
    </div>
  );
}

export default Tree;
