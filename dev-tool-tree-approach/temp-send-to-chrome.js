let debugMode = true;

// function to send message to devtool
export function sendData( data, type ) {
  // stringify data (in case it's an objec or array)
  const payload = (typeof data === 'object') ? JSON.stringify(data) : data;
  postMessageToDebugger(payload, type)
}

function postMessageToDebugger (payload, type) {
  const msgObj = { from: "FROM_PAGE", type, payload };
  // this should be send on something besides the window.
  window.postMessage(msgObj, "*");
  if (debugMode) console.log('message sent from page', msgObj)
}