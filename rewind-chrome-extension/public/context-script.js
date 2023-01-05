/* global chrome */

const debugMode = false;

///////// FROM APP TOO DEV TOOL //////////

// listens for messages from app / current page tab
window.addEventListener("message", function(event) {
  // We only accept messages from the window. change this to a specific div
  if (event.source !== window) return;

  // send from page to devtoool
  if (event.data.from && event.data.from === "FROM_PAGE") {
    sendMessageToDevTool(event.data);
  }
});

// pass message along to dev tool
const sendMessageToDevTool = async ( message ) => {
  chrome.runtime.sendMessage({...message});
}
const sendReplayToAppWeAreDebugging = (payload, type) => {
  let data = { from: "FROM_DEVTOOL", type, payload };
  window.postMessage(data, "*"); // send to div not window.
}

// For some reason this additional connect is needed;
///////// FROM DEV TOOL TOO APP //////////
chrome.runtime.connect().onMessage.addListener(function(message, sender, sendResponse) {
  sendReplayToAppWeAreDebugging(message.payload, message.type);
});