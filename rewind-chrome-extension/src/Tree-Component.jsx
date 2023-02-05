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
  const lineHeight = 2;
  
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

//   const treeLayout = tree().nodeSize([30,]).separation(function separation(a, b) {
//     return a.parent == b.parent ? 2 : 1;
// });

  
  const root = hierarchy(treeData);
  const links = treeLayout(root).links();
  const handleZoom = (e) => {
    g.attr('transform', e.transform);

    g.selectAll('circle')
    .attr('r', (2 / e.transform.k) + 'vh')

    g.selectAll('path')
    .attr('stroke-width', (1 / e.transform.k) + 'vh')

    g.selectAll('foreignObject')
    .style('font-size', (1 / e.transform.k) + 'em')
    .attr("height", (7 / e.transform.k) + 'vh')
    .attr('y', (2.1 / e.transform.k) + 'vh')
    .style("text-anchor", "middle")
    console.log(e.transform.k)
  }

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
    .attr('stroke-width', '1vh')
    .attr('d', linkPathGenerator); 

  //creates the individual node (components) and spaces them out appropriately + gives them a class so we can progrommaticaly change them
  const node = g.selectAll('.node').data(root.descendants())
    .enter().append('g')
    .attr('class', function(d) { return 'node' + (d.data.children ? ' node--internal' : 'node--leaf')})
    .attr('id', function(d) { return 'nodeID_' + (d.data.componentName ? d.data.componentName : 'null')})
    .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })


  node.append("foreignObject")
    .style("text-anchor", "middle")
    .attr('x', '-4vh')
    .attr('y', '2.1vh')
    .attr("width", '8vh')
    .attr("height", '7vh')
    .style('font-size', '1em')
    .append("xhtml:section")
    .style("color", "steelblue")
    .text(d => {
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
          compName+=`  `;
        }
        compName += rebuildFrom[i];
      }
      return `${compName}`; //style='position:absolute; bottom:0;
    })
  

  
  node.append('circle')
    .attr('r', '2vh')
    .attr('fill', "#24425C")
    
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

