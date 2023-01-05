/* global chrome */
import { createSignal } from 'solid-js';

import Tree from './Tree';
import DragBar from './DragBar';

function TreeView() {

  return (
    <>
      <div class='treeView'>
        <Tree />
      </div>
      <DragBar drag='treeView' />
    </>
  );
}

export default TreeView;
