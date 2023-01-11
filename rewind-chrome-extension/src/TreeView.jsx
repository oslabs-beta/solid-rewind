/* global chrome */
import { createSignal } from 'solid-js';

import TreeComp from './Tree-Component';
import DragBar from './DragBar';
import { sendData } from './sendAndListen';

function TreeView() {

  // send request for initial tree
  sendData(undefined, 'INITAL TREE REQUEST');

  return (
    <>
      <div class='treeView'>
        <TreeComp />
      </div>
      <DragBar drag='treeView' />
    </>
  );
}

export default TreeView;
