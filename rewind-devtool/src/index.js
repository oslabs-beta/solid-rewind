

export function helloWorld() {
  const message = 'Hello World from my example modern npm package!';
  return message;
}

export function goodBye() {
  const message = 'Goodbye from my example modern npm package!';
  return message;
}

export default {
  helloWorld,
  goodBye,
};

export * from './solid-rw';
export * from './sender';

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