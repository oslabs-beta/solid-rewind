/* global chrome */
import { createSignal } from 'solid-js';

import TreeComp from './Tree-Component';
import DragBar from './DragBar';

function TreeView() {

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
