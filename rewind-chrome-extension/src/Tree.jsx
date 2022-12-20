/* global chrome */
import { createSignal } from 'solid-js';
import { listenFor } from './listener';
import * as d3 from 'd3';


function Tree() {


  const drawCircle = () => {
    const svg = d3.create('svg').attr('viewBox', [0, 0, 200, 200]);
  
    svg
      .append('circle')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', 20)
      .style('fill', 'green');
  
    return svg.node();
  }

  const [tree, updateTree] = createSignal({});

  // listen for incoming tree data
  listenFor('TREE', incomingTree);

  // callback to handle tree data
  function incomingTree(tree) {
    console.log("tree data coming from console");
    const appTree = JSON.parse(tree);
    updateTree(tree);
    console.log('appTree', appTree);

    parseTreeIntoVisualTree(appTree);
  }

  function parseTreeIntoVisualTree (tree) {

  }

  return (
    <div class='tree'>
      {tree}
      {drawCircle()};
    </div>
  );
}

export default Tree;
