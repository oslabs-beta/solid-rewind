/* global chrome */
/* global browser */

// INTERCEPT MESSAGES and sends them to the PAGE
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

      console.log("background.js recieved:", request);
      devToolsConnection.postMessage(request)

      // in the event of a reply (I.E. a message from the dev tool to the app we are debugging)
      if (request.reply) {
        console.log("reply recieved", request.reply);

        sendReplayToAppWeAreDebugging(request.reply);

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          console.log('sending to each tab... total tabs:', tabs.length);
          for (const tab of tabs) {
            chrome.tabs.sendMessage(tab.id, { greeting: "Hi from background script" })
          }
        });
      }
  });
})

function sendReplayToAppWeAreDebugging(msg) {
  console.log("sending from backgroud.js")
  let data = { type: "FROM_DEVTOOL", text: msg };
  window.postMessage(data, "*");
}