/* global chrome */


///////// FROM APP TOO DEV TOOL //////////

// listens for messages from app / current page tab
window.addEventListener("message", function(event) {
  // We only accept messages from the window. change this to a specific div
  if (event.source !== window) return;
  
  if (event.data.from && (event.data.from === "FROM_PAGE")) {
      console.log("message from app to devtool - in content-script.js: " + event.data);
      sendMessageToDevTool(event.data);
  }
});

// pass message along to dev tool
const sendMessageToDevTool = async ( message ) => {
  console.log("sending message to dev tool:", message);
  chrome.runtime.sendMessage({...message});
  // got rid of await, was returning promise erros
  //const response = await chrome.runtime.sendMessage({...message});

  // do something with response here, not outside the function ??
  //console.log(response);
}


///////// FROM DEV TOOL TOO APP //////////

// sends message to window.
chrome.runtime.connect().onMessage.addListener(function(message, sender, sendResponse){
  console.log('message recieved from devtool:', message)
  sendReplayToAppWeAreDebugging(message.payload, message.type);
});

function sendReplayToAppWeAreDebugging(payload, type) {
  console.log('post to window from context-script.js-- type:', type, 'payload:', payload)
  let data = { from: "FROM_DEVTOOL", type, payload };
  // send to div not window.
  window.postMessage(data, "*");
}
