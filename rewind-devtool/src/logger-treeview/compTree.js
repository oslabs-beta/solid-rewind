import { setChildMap } from "../solid-rw";

const debugMode = false;

export async function buildComponentTree(root) {
  //console.log('PRE TREEED ROOT', root);

  function newParent() {
    return {
      componentName: '',
      children: [],
      names: new Set()
    }
  }

  // child map will be here
  const childMap = {};

  // begin building tree
  const tree = newParent('');
  buildTree(root, tree, true);

  function buildTree (owner, parent, first = false) {
    // if this is a compnent we care about
    // set it's name
    if (owner?.componentName) {
      if (!first) {
        const np = newParent('');
        parent.children.push(np);
        parent = np;
      }
      parent.componentName = owner.componentName;
      
      // setup name
      parent.names = new Set([ owner.name ]);

      // add to child map
      buildMapOfChildren(parent.name, parent.componentName);

      // go into children
      if (owner.owned && owner.owned.length) {
        for (const c of owner.owned) {
          buildTree(c, parent);
        }
      }
    }
    // if not a "named" component, handle it's children
    else {
      // gets names of all non-component childen so we can see if any of them are observers of a given symbol
      parent.names = new Set([ ...parent.names, owner.name ]); 
      
      // add to child map
      buildMapOfChildren(owner.name, parent.componentName);
      
      if (owner.owned && owner.owned.length) {
        for (const c of owner.owned) {
          buildTree(c, parent);
        }
      }
    }
    
    // base case -- is this nessesary?!?
    if (!owner) {
      return tree
    }

  }

  function buildMapOfChildren( cName, parent ) {
    if (!cName || !parent) return;
    if (debugMode) console.log('adding to child map - CHILD', { cName, parent } );
    // if no value is found, make a new set
    if (childMap[cName] === undefined) {
      childMap[cName] = new Set();
    }
    // add to child map
    childMap[cName].add(parent);
    // log it
    if (debugMode) console.log('child:', cName, childMap[cName]);
  }

  // saveChildMap
  setChildMap(childMap);

  return tree;
}
