// all our listners
let initComplete = false;
const listeners = {}

export function listenFor(type, callback) {
  if (!initComplete) init();
  // create new array of listner callbacks that execute when this message type comes in
  if (!listeners[type]) listeners[type] = new Map();
  // add callback
  listeners[type].set(callback, callback);
}

function init() {
  initComplete = true;
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // if type is found in listener list
      if (listeners[request.type]) {
        // execute callback on each function we saved under that type
        for (const cb of listeners[request.type].values()){
          cb( request.payload );
        }
      }
    }
  );
}

export const sendData = async ( payload, type ) => {
  await chrome.runtime.sendMessage({
    from : 'FROM_DEVTOOL',
    type,
    payload
  });
}