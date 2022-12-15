const debugMode = true;
let initComplete = false;

// function to send message to devtool
export function sendData( data, type  ) {
  // stringify data (in case it's an objec or array)
  postMessageToDebugger(JSON.stringify(data), type)
}

function postMessageToDebugger (data, type) {
  const msgObj = { form: "FROM_PAGE", type, payload: data };
  // this should be send on something besides the window.
  window.postMessage(data, "*");
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
      if (debugMode) console.log('message from devtool', event);

      // dispatch an event with the type as the message type. Listeners can then grab it
      const msgRecievedEvent = new CustomEvent(event.type, {
        detail: { ...event } 
      });
      document.dispatchEvent(msgRecievedEvent);
    }
  }, false);
}

export function listenFor ( type, callback ) {
  subscribe(type, callback);
}


// export declare function createSignal<T>(value: T, options?: SignalOptions<T>): Signal<T>;
// export interface BaseOptions {
//     name?: string;
// }
