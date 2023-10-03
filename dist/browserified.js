(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function createClipboardFunctionality (lib, mylib) {
  'use strict';

function copyToClipboard(textToCopy, parentelement) {
    // Navigator clipboard api needs a secure context (https)
    var target;
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy);
    } else {
        target = parentelement || document.body;
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
            
        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
            
        target.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
    }
  }

  mylib.copyToClipboard = copyToClipboard;
}
module.exports = createClipboardFunctionality;



},{}],2:[function(require,module,exports){
(function (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    mylib = {};

  require('./viewtransitioncreator')(execlib.lib, mylib);
  require('./messagingcreator')(execlib.lib, mylib);
  require('./clipboardcreator')(execlib.lib, mylib);
  require('./printingcreator')(execlib.lib, mylib);


  lR.register('allex_browserwebcomponent', mylib);
})(ALLEX);

},{"./clipboardcreator":1,"./messagingcreator":3,"./printingcreator":4,"./viewtransitioncreator":5}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
function createPrintingFunctionality (lib, mylib) {
  'use strict';

  var frame;

  function createFrame () {
    if (frame) {return;}
    frame = document.createElement('iframe');
    frame.onload = setPrint;
    frame.style.display = 'none';
  }

  function print (html) {
    createFrame();
  }

  mylib.print = print;
}
module.exports = createPrintingFunctionality;
},{}],5:[function(require,module,exports){
function createViewTransition (lib, mylib) {
  'use strict';

    var _transition;
    function safeRun (func) {
      if (lib.isFunction(func)) {
        func();
      }
    }
    function startTransition (func) {
      var promise;
      if (_transition) {
        safeRun(func);
        return;
      }
      if (!document.startViewTransition) {
        safeRun(func);
        return;
      }
      _transition = lib.q.defer();
      promise = _transition.promise;
      document.startViewTransition (function () {
        var ret = promise;
        safeRun(func);
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
},{}]},{},[2]);
