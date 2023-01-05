export const sendData = async ( payload, type ) => {
  await chrome.runtime.sendMessage({
    from : 'FROM_DEVTOOL',
    type,
    payload
  });
}