import { 
    select, 
    tree, 
    hierarchy, 
    linkHorizontal, 
    zoom, 
    zoomIdentity } from 'd3';
import { createSignal } from 'solid-js';
import { listenFor } from './sendAndListen';


const [treeState, updateTree] = createSignal({});

// callback to handle tree data
let svg;
let newSvg;

const buildD3Tree = (treeData) => {
  newSvg = select(svg); 
  const width = document.body.offsetWidth;
  const margin = { top: 10, right: 20, bottom: 10, left: 20 };

  // visual settings
  const lineHeight = -15;
  
  //this is the canvas upon which our tree will be painted 

  const g = newSvg
    .attr('width', screen.width) // make svg large so a scaled up window wont show cutoffs.
    .attr('height', screen.height)
    .attr('id', 'componentTreeSvg')
    .append('g')

  //this sets up the general tree layout and sets the overall size and node size
  const minWidth = 500;
  const maxWidth = 900;
  const displayScaleY = 500; //height - margin.top - margin.bottom
  const displayScaleX = Math.max(Math.min(width - margin.right - margin.left, maxWidth), minWidth);
  const treeLayout = tree().size([displayScaleY, displayScaleX]);
  
  const root = hierarchy(treeData);
  const links = treeLayout(root).links();
  const handleZoom = (e) => g.attr('transform', e.transform);

  const zoomer = zoom().on('zoom', handleZoom); 

  newSvg.call(zoomer);
  newSvg.call(zoomer.transform, zoomIdentity.scale(1).translate(margin.left,margin.bottom));

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


  node.append("foreignObject")
    .attr("x", -50)
    .attr('y', (d) => {
      return lineHeight + (getLineNumbers(d.data.componentName)) * lineHeight;
    })
    .attr("width", 100)
    .attr("height", 300)
    .append("xhtml:section")
    .style("color", "steelblue")
    .html(d => {
      let compName = d.data.componentName;
      // parse out _Hot$$ added by ES6 arrow functions
      if (compName.includes('_Hot$$')) {
        const start = compName.indexOf("$") + 2;
        compName = compName.slice(start)
      }
      // split at capitals into multiple lines
      const rebuildFrom = compName;
      compName = '';
      for (let i = 0; i < rebuildFrom.length; i++) {
        if (rebuildFrom[i] == rebuildFrom[i].toUpperCase() && i !== 0) {
          compName+='<br>';
        }
        compName += rebuildFrom[i];
      }
      return `<div class='compName'>${compName}</div>`; //style='position:absolute; bottom:0;
    })

  
  node.append('circle')
    .attr('r', 10)
    .attr('fill', "#24425C")
}

const getLineNumbers = (compName) => {
  let lines = 1;
  if (compName.includes('_Hot$$')) {
    const start = compName.indexOf("$") + 2;
    compName = compName.slice(start)
  }
  for (let i = 0; i < compName.length; i++) {
    if (compName[i] == compName[i].toUpperCase() && i !== 0) {
      lines++;
    }
  }
  return lines;
}

  

const TreeComp = (props) => {
  let built = false;

  function incomingTree(treeFromApp) {
    let parsedTree = JSON.parse(treeFromApp)
    if (parsedTree.componentName === "") {
      parsedTree = parsedTree.children[0];
    }
    if (parsedTree.componentName === "Rewind") {
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

