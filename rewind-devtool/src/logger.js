
export default function log (messages, prefixOrFile = '', color = 'orange') {
  console.log(`%c ${prefixOrFile}`, `color:${color}; font-weight: bold`, ...messages);
}