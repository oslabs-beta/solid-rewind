import { sendData } from "../sender";

export const sendTreeToChrome = tree => {
  // deciruclarize. Not nessesary anymore
  // const nonCiruclar = stringifyCircularJSON(tree);

  // convert name sets into an object
  convertNameSetToObj(tree);

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

