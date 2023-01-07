import { 
    select, 
    tree, 
    hierarchy, 
    linkHorizontal, 
    zoom, 
    zoomIdentity } from 'd3';
import { onMount, createSignal } from 'solid-js';
import { listenFor } from './listener';

const sampleTreeData = JSON.stringify({
  "componentName":"App",
  "children":[{"componentName":"_Hot$$TreeComp","children":[],"names":{"c-1-1-1-1-1-3":"","c-1-1-1-1-1-3-1":"","c-1-1-1-1-1-3-1-1":""}},
  {
    "componentName":"_Hot$$Hello",
    "children":[
    {
      "componentName":"For",
      "children":[
        {"componentName":"RobbieExample", "names":{}, "children":[]}, 
        {"componentName":"RobbieExample2", "names":{}, "children":[]}
      ],
      "names":{"c-1-1-1-1-1-5-1-3":"","value":""}}],
    "names":{"c-1-1-1-1-1-5":"","c-1-1-1-1-1-5-1":"","c-1-1-1-1-1-5-1-1":"","c-1-1-1-1-1-5-1-1-1":"","c-1-1-1-1-1-5-1-2":""}}],
  "names":{"c-1-1-1-1":"","c-1-1-1-1-1":"","c-1-1-1-1-1-1":"","c-1-1-1-1-1-2":"","c-1-1-1-1-1-4":"","c-1-1-1-1-1-6":"",
          "c-1-1-1-1-1-6-1":"","c-1-1-1-1-1-7":"","c-1-1-1-1-1-8":"","c-1-1-1-1-1-9":"","c-1-1-1-1-1-10":"","c-1-1-1-1-1-11":"",
          "c-1-1-1-1-1-12":"","c-1-1-1-1-1-13":"","c-1-1-1-1-1-14":""}
})

const [treeState, updateTree] = createSignal({});

// callback to handle tree data
let svg;
let newSvg;

const buildD3Tree = (treeData) => {
  newSvg = select(svg); 
  const width = 100;
  const height = 100;
  const margin = { top: 10, right: 10, bottom: 25, left: 10 };
  const innerWidth = width - margin.left - margin.right + "%";
  const innerHeight = height - margin.top - margin.bottom + "%";
  
  //this is the canvas upon which our tree will be painted 

  const g = newSvg
    .attr('width', width + "%")
    .attr('height', height + "%")
    .attr('id', 'componentTreeSvg')
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  //this sets up the general tree layout and sets the overall size and node size
  const treeLayout = tree().size([innerHeight, innerWidth]).nodeSize([50, 150]);
  const root = hierarchy(treeData);
  const links = treeLayout(root).links();
  const handleZoom = (e) => g.attr('transform', e.transform);

  const zoomer = zoom().on('zoom', handleZoom); 

  newSvg.call(zoomer);
  newSvg.call(zoomer.transform, zoomIdentity.scale(1).translate(50,100));

  const linkPathGenerator = linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x);

  g.selectAll('path')
    .data(links)
    .enter()
    .append('path')
    .attr("fill", "none")
    .attr('stroke','black')
    .attr('stroke-width', 2)
    .attr('d', linkPathGenerator); 

  //creates the individual node (components) and spaces them out appropriately + gives them a class so we can progrommaticaly change them
  const node = g.selectAll('.node').data(root.descendants())
    .enter().append('g')
    .attr('class', function(d) { return 'node' + (d.data.children ? ' node--internal' : 'node--leaf')})
    .attr('id', function(d) { return 'nodeID_' + (d.data.componentName ? d.data.componentName : 'null')})
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })

  //appends text to the nodes
  node.append('text')
    .attr("fill", "steelblue")
    .style("font", "12px times" )
    .style('text-anchor', 'middle' )
    .attr('y', -18)
    .text(d => d.data.componentName)
    
  node.append('circle')
    .attr('r', 10)
    .attr('fill', "steelblue")
  }

const TreeComp = (props) => {
  let built = false;

  function incomingTree(treeFromApp) {
    let parsedTree = JSON.parse(treeFromApp)
    if (parsedTree.componentName === "") {
      parsedTree = parsedTree.children[0];
    }
    if (built === true) {
      if (treeFromApp !== treeState()) {
        newSvg.selectAll('g').remove()
        updateTree(treeFromApp)
        buildD3Tree(parsedTree)
      }
    }
    if (built === false) {
      built = true;
      updateTree(treeFromApp);
      buildD3Tree(parsedTree);
    }
  }

  // listen for incoming tree data

  listenFor('TREE', incomingTree);
  return <svg ref={svg} id="componentTreeSvg"></svg>

}

export default TreeComp;