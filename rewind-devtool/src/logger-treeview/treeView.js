import { sendData } from "../sender";

export const sendTreeToChrome = tree => {
  // deciruclarize. Not nessesary anymore
  // const nonCiruclar = stringifyCircularJSON(tree);

  // convert name sets into an object
  convertNameSetToObj(tree);

  // save to stack
  addToTreeStack(JSON.stringify(tree))

  // give chrome tool a moment to load before we send the tree.
  sendData(tree, 'TREE');
}

// itterate though tree at each level and convert set to object
const convertNameSetToObj = (tree) => {
  if (tree.names) {
    const nameSet = tree.names;
    tree.names = Object.assign(...Array.from(nameSet, v => ({[v]:''})));
  }

  if (!tree.children) return tree;
  else {
    tree.children.forEach(element => {
      convertNameSetToObj(element);
    });
  }
}

// uncircularize object json
export const stringifyCircularJSON = obj => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (k, v) => {
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) return;
      seen.add(v);
    }
    return v;
  });
};

// stacks
const treePast= [];
const treeFuture = []

const addToTreeStack = (compTreeString) => {
  treePast.push(compTreeString);
  treeFuture.length = 0;
}

export const goForwardTree = () => {
  if (treeFuture.length === 0) return;
  // move future to past
  treePast.push(treeFuture.pop());
  // send top of past to chrome
  sendData(treePast[treePast.length-1], 'TREE');
}

export const goBackTree = () => {
  if (treePast.length <= 1) return;
  // move future to past
  treeFuture.push(treePast.pop());
  // send top of past to chrome
  sendData(treePast[treePast.length-1], 'TREE');
}
