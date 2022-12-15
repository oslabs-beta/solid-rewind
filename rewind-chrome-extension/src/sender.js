export const sendData = async ( payload, type ) => {
  console.log("From chrome-tool to site", payload);
  await chrome.runtime.sendMessage({
    from : 'FROM_DEVTOOL',
    type,
    payload
  });
}