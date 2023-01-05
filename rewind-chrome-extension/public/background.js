/* global chrome */
/* global browser */

const debugMode = false;

// INTERCEPT MESSAGES and sends them to the PAGE
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      devToolsConnection.postMessage(request)
      // in the event of a reply (I.E. a message from the dev tool to the app we are debugging)
      if (request.reply) {
        sendReplayToAppWeAreDebugging(request.reply, 'type...');
      }
  });
})

function sendReplayToAppWeAreDebugging(payload, type) {
  let data = { from: "FROM_DEVTOOL", type, payload };
  window.postMessage(data, "*");
}