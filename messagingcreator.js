function createWindowMessaging (lib, mylib) {
  'use strict';

  function postMessage(msg, receiver) {
    if (!receiver && window && window.chrome && window.chrome.webview) {
      window.chrome.webview.postMessage(msg);
    }
    window.postMessage(msg, receiver||window.opener);
  }

  mylib.postMessage = postMessage;
}
module.exports = createWindowMessaging;