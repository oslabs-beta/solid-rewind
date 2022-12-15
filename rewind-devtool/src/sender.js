const debugMode = true;
let initComplete = false;

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

export function senderInit () {
  if (initComplete) return;
  // listen elsehwere than the window. Make a div and listen there perhase
  if (debugMode) console.log('integrated-devtool: message listener setup');

  // there will only be one listener which recieves messages and delegates out events
  window.addEventListener("message", (event) => {
    // only pay attetion to messages from the devtool
    if (event.data.from === "FROM_DEVTOOL" ) {
      if (debugMode) console.log('message from devtool', event.data);

      // dispatch an event with the 'type' as the message type. Listeners can then grab it
      const msgRecievedEvent = new CustomEvent(event.data.type, {
        detail: { ...event.data } 
      });
      document.dispatchEvent(msgRecievedEvent);
    }
  }, false);

  // send message to client to erase any saved state if the page refreshes
  window.onbeforeunload = function(event) {
    // return confirm("Confirm refresh");
    sendData( undefined, 'RESET_STATE' )
  };
}


export function listenFor ( type, callback ) {
  // pass along only the payload to the callback
  document.addEventListener( type, (data) => callback(data.detail) );
}


// export declare function createSignal<T>(value: T, options?: SignalOptions<T>): Signal<T>;
// export interface BaseOptions {
//     name?: string;
// }
