/* global chrome */
/* global browser */

const debugMode = false;

// INTERCEPT MESSAGES and sends them to the PAGE
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (debugMode) console.log("background.js - recieved:", request);
      devToolsConnection.postMessage(request)

      // in the event of a reply (I.E. a message from the dev tool to the app we are debugging)
      if (request.reply) {
        if (debugMode) console.log("background.js - reply recieved", request.reply);

        sendReplayToAppWeAreDebugging(request.reply, 'type...');

        // WTF IS THIS!?!?!
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (debugMode) console.log('background.js - sending to each tab... total tabs:', tabs.length);
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { greeting: "Hi from background script" })
          }
        });
      }
  });
})

function sendReplayToAppWeAreDebugging(payload, type) {
  if (debugMode) console.log("background.js - sending from backgroud.js")
  let data = { from: "FROM_DEVTOOL", type, payload };
  window.postMessage(data, "*");
}