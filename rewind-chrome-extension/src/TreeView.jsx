/* global chrome */
import { createSignal } from 'solid-js';

import Tree from './Tree';

function TreeView() {

  return (
    <div class='treeView'>
      <Tree />
    </div>
  );
}

export default TreeView;
