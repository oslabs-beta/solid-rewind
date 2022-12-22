
export default function log (messages, prefixOrFile = '', color = 'orange') {
  if (prefixOrFile === '') {
    if (Array.isArray(messages)) console.log(`%c ${ messages }`, `color:${color}; font-weight: bold`);
    else console.log(`%c ${messages}`, `color:${color}; font-weight: bold` );
  }
  else {
    if (Array.isArray(messages)) console.log(`%c ${prefixOrFile}`, `color:${color}; font-weight: bold`, ...messages);
    else console.log(`%c ${prefixOrFile}`, `color:${color}; font-weight: bold`, messages);
  }
}