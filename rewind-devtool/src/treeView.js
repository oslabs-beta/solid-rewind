import { sendData } from "./sender";

export const sendTreeToChrome = tree => {
  console.log('sending inital tree to app...');

  const nonCiruclar = stringifyCircularJSON(tree);
  console.log('nonCicular tree', JSON.parse(nonCiruclar));
  
  // give chrome tool a moment to load before we send the tree.
  sendData(nonCiruclar, 'TREE');
}

// uncircularize object json
const stringifyCircularJSON = obj => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (k, v) => {
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) return;
      seen.add(v);
    }
    return v;
  });
};

