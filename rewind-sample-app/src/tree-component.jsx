import { 
    select, 
    tree, 
    hierarchy, 
    linkHorizontal, 
    zoom, 
    zoomIdentity } from 'd3';
import { onMount } from 'solid-js';
import { buildComponentTree } from '../../rewind-devtool/src/logger-treeview/compTree'
import { stringifyCircularJSON } from '../../rewind-devtool/src/logger-treeview/treeView'


const TreeComp = (props) => {

  let svg;
  const buildD3Tree = async () => {

    const rewind = props.owner;
    const compTree = await buildComponentTree(rewind.owner);
    const treeData = JSON.parse(stringifyCircularJSON(compTree));

    const newSvg = select(svg); 
    const width = 400;
    const height = 200;
    const margin = { top: 50, right: 20, bottom: 50, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    

    //this is the canvas upon which our tree will be painted 
    const g = newSvg
      .attr('width', width)
      .attr('height', height)
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
      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })


    //appends text to the nodes
    node.append('text')
      .attr("fill", "steelblue")
      .style("font", "8px times" )
      .style('text-anchor', 'middle' )
      .attr('y', -10)
      .text(d => d.data.componentName)
      
    
    node.append('circle')
      .attr('r', 2)
      .attr('fill', "steelblue")


    }

  onMount(buildD3Tree)

  return <svg ref={svg}></svg>
}

export default TreeComp;