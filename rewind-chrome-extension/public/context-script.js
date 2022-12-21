/* global chrome */

const debugMode = false;

///////// FROM APP TOO DEV TOOL //////////

// listens for messages from app / current page tab
window.addEventListener("message", function(event) {
  // We only accept messages from the window. change this to a specific div
  if (event.source !== window) return;

  // send from page to devtoool
  if (event.data.from && event.data.from === "FROM_PAGE") {
    if (debugMode) console.log('c% context-script.js - ', 'color:orange; font-weight:bold', 'FROM_PAGE - in content-script.js: ', event.data);
    sendMessageToDevTool(event.data);
  }
});

// pass message along to dev tool
const sendMessageToDevTool = async ( message ) => {
  chrome.runtime.sendMessage({...message});
}
const sendReplayToAppWeAreDebugging = (payload, type) => {
  let data = { from: "FROM_DEVTOOL", type, payload };
  if (debugMode) console.log('c% context-script.js - ', 'color:orange; font-weight:bold', 'From devtool to page:', data);
  window.postMessage(data, "*"); // send to div not window.
}

// For some reason this additional connect is needed;
///////// FROM DEV TOOL TOO APP //////////
chrome.runtime.connect().onMessage.addListener(function(message, sender, sendResponse) {
  sendReplayToAppWeAreDebugging(message.payload, message.type);
});

// function sendReplayToAppWeAreDebugging(payload, type) {
//   console.log('post to window from context-script.js-- type:', type, 'payload:', payload)
//   let data = { from: "FROM_DEVTOOL", type, payload };
//   // send to div not window.
//   window.postMessage(data, "*");
// }

/*
// pass message along to dev tool
const sendMessageToDevTool = async ( message ) => {
  console.log("sending message to dev tool:", message);
  chrome.runtime.sendMessage({...message});
  // got rid of await, was returning promise erros
  //const response = await chrome.runtime.sendMessage({...message});

  // do something with response here, not outside the function ??
  //console.log(response);
}
*/