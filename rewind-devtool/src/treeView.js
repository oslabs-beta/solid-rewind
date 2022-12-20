import { sendData } from "./sender";


export const sendTreeToChrome = tree => {
  const nonCiruclar = stringifyCircularJSON(rewind);
  console.log('nonCicular tree', JSON.parse(nonCiruclar));
  
  // give chrome tool a moment to load before we send the tree.
  setTimeout( () => sendData(stringifyCircularJSON(nonCiruclar), 'TREE'), 500 );
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

