function createBrowserUtils (lib, mylib) {
  'use strict';

  mylib.isInIFrame = function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return false;
    }
  }
}
module.exports = createBrowserUtils;