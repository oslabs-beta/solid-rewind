

export async function buildComponentTree(root) {
  // itterate though tree, 

// traverse the tree looking for only components that have a ‘component name’ value.
	// track the last found named component as the ‘parent’
	// as you traverse down, any other component with a ‘name’ you hit will get added to a map that the parent owns.
	// if you hit a new component with a component name, then it becomes the new parent, and a reference to it gets added to the previous parent’s children.

  console.log('PRE TREEED ROOT', root);

  function newParent() {
    return {
      componentName: '',
      children: [],
      names: new Set()
      //observers: new Set()
    }
  }

  // const seen = new WeakMap();

  const tree = newParent('');
  buildTree(root, tree, true);


  function buildTree (owner, parent, first = false) {
    // // stop infiinite recursion
    // if (seen.has(owner)) return;
    //   seen.add(owner);

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
      
      // missing data here! i need the id from the observer as well... don't make it a set
      // if (owner.observers) {
      //   parent.observers = new Set([...owner.observers ]);
      // }
      // go into children
      if (owner.owned && owner.owned.length) {
        for (const c of owner.owned) {
          buildTree(c, parent);
        }
      }
    }
    // if not then we
    else {
      // adds more to the set
      //if (owner.observers) parent.observers = new Set([ ...parent.observers, ...owner.observers ]); 
      parent.names = new Set([ ...parent.names, owner.name ]); 
      
      if (owner.owned && owner.owned.length) {
        for (const c of owner.owned) {
          buildTree(c, parent);
        }
      }
    }
    
    // base case
    if (!owner) {
      console.log('base achieved');
      return tree
    }

  }
  return tree;
}
