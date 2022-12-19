import { srInit } from './solid-rw';
import { senderInit } from './sender';
import * as stateParser from './stateParser';

export function helloWorld() {
  const message = 'Hello World from my example modern npm package!';
  return message;
}

export function goodBye() {
  const message = 'Goodbye from my example modern npm package!';
  return message;
}

export function init() {
  srInit();
  senderInit();
  stateParser.createDummyStateHistory();
}

export * from './solid-rw';
export * from './sender';

export default {
  init,
  helloWorld,
  goodBye,
};

// function helloWorld() {
//   console.log('Hello World!');
// }
// function doSomethingAwesome() {
//   console.log('Doing something awesome...');  
// }
// function doSomethingElse() {
//   console.log('Now something else...'); 
// }
// module.exports = {
//   helloWorld: helloWorld,
//   doSomethingAwesome: doSomethingAwesome,
//   doSomethingElse: doSomethingElse
// }