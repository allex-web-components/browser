(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    mylib = {};

  require('./viewtransitioncreator')(execlib.lib, mylib);
  require('./messagingcreator')(execlib.lib, mylib);

  lR.register('allex_browserwebcomponent', mylib);
})(ALLEX);

},{"./messagingcreator":2,"./viewtransitioncreator":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
function createViewTransition (lib, mylib) {
  'use strict';

    var _transition;
    function startTransition (func) {
      var promise;
      if (_transition) {
        return;
      }
      if (!document.startViewTransition) {
        if (lib.isFunction(func)) {
          func();
        }
        return;
      }
      _transition = lib.q.defer();
      promise = _transition.promise;
      document.startViewTransition (function () {
        var ret = promise;
        if (lib.isFunction(func)) {
          func();
        }
        promise = null;
        func = null;
        return ret;
      });
    }
    function endTransition () {
      if (!_transition) {
        return;
      }
      _transition.resolve(true);
      _transition = null;
    }
    mylib.viewTransition = {
      start: startTransition,
      end: endTransition
    }
}
module.exports = createViewTransition;
},{}]},{},[1]);
