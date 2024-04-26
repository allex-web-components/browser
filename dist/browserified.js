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
function createCookieFunctionality (lib, mylib) {
  'use strict';

  function setCookie (name, value, daysToPersist) {
    var d = new Date();

    d.setDate(d.getDate() + (lib.isNumber(daysToPersist) ? daysToPersist: 180));

    //d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  function getCookie (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
  }
  mylib.setCookie = setCookie;
  mylib.getCookie = getCookie;
}
module.exports = createCookieFunctionality;
},{}],3:[function(require,module,exports){
function createElements (execlib, lR, mylib) {
  'use strict';

  var lib = execlib.lib;
  var applib = lR.get('allex_applib');
  require('./themingcreator')(lib, applib, mylib);
}
module.exports = createElements;
},{"./themingcreator":4}],4:[function(require,module,exports){
function createThemingElement (lib, applib, mylib) {
  'use strict';

  var BasicElement = applib.BasicElement;

  function ThemingElement (id, options) {
    BasicElement.call(this, id, options);
    this.parentBodyObserver = null;
    this.parentMessager = null;
    this.theme = null;
  }
  lib.inherit(ThemingElement, BasicElement);
  ThemingElement.prototype.__cleanUp = function () {
    this.theme = null;
    if (this.parentMessager) {
      window.removeEventListener(this.parentMessager);
    }
    this.parentMessager = null;
    if(this.parentBodyObserver) {
       this.parentBodyObserver.disconnect();
    }
    this.parentBodyObserver = null;
    BasicElement.prototype.__cleanUp.call(this);
  };
  ThemingElement.prototype.staticEnvironmentDescriptor = function (myname) {
    return lib.extendWithConcat(BasicElement.prototype.staticEnvironmentDescriptor.call(this, myname)||{}, {
    });
  };
  ThemingElement.prototype.actualEnvironmentDescriptor = function (myname) {
    this.doWithThemes(setInitialTheme.bind(this));
    if (window.parent && window.parent != window) {
      this.parentMessager = onParentMesage.bind(this);
      window.addEventListener('message', this.parentMessager);
    }
    return lib.extendWithConcat(BasicElement.prototype.actualEnvironmentDescriptor.call(this, myname)||{}, {
    });
  };

  ThemingElement.prototype.doWithThemes = function (func) {
    var themes = this.getConfigVal('themes');
    if (!lib.isNonEmptyArray(themes)) {
      return;
    }
    func(themes);
  };

  //statics
  function setInitialTheme (themes) {
    var urlparams = new URLSearchParams(document.location.search);
    setTheme.call(this, themes, urlparams.get('theme') || themes[0]);
  }
  function setArbitraryTheme (theme, themes) {
    setTheme.call(this, themes, theme);
  }
  function setTheme (themes, theme) {
    if (!document.body) {
      return;
    }
    themes.reduce(remover, theme);
    themes.reduce(adder, theme);
    mylib.setCookie('themingCookie', theme);
    this.set('theme', theme);
  }
  function remover (ret, theme) {
    if (ret!=theme) {
        document.body.classList.remove(theme);
    }
    return ret;
  }
  function adder (ret, theme) {
      if (ret==theme) {
          document.body.classList.add(theme);
      }
      return ret;
  }
  function onParentMesage (msg) {
    var newtheme;
    if (!(msg && msg.data && msg.data.request == 'changeTheme')) {
      return;
    }
    newtheme = msg.data.theme;
    this.doWithThemes(setArbitraryTheme.bind(this, newtheme));
    newtheme = null;
  }
  //endof statics
  
  applib.registerElementType('Theming', ThemingElement);
}
module.exports = createThemingElement;
},{}],5:[function(require,module,exports){
(function (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    mylib = {};

  require('./viewtransitioncreator')(execlib.lib, mylib);
  require('./messagingcreator')(execlib.lib, mylib);
  require('./clipboardcreator')(execlib.lib, mylib);
  require('./printingcreator')(execlib.lib, mylib);
  require('./saveascreator')(execlib.lib, mylib);
  require('./cookiefunctionalitycreator')(execlib.lib, mylib);
  require('./utilscreator')(execlib.lib, mylib);

  require('./elements')(execlib, lR, mylib);

  lR.register('allex_browserwebcomponent', mylib);
})(ALLEX);

},{"./clipboardcreator":1,"./cookiefunctionalitycreator":2,"./elements":3,"./messagingcreator":6,"./printingcreator":7,"./saveascreator":8,"./utilscreator":9,"./viewtransitioncreator":10}],6:[function(require,module,exports){
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
function createSaveAs (lib, mylib) {
  'use strict';

  mylib.saveAs = function saveAs (blob,name){
		var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
		// Test for download link support
		if( 'download' in a ){

			
			a.setAttribute('href', url);
			a.setAttribute('download', name);

			// Simulate a click to trigger download
			var event = new MouseEvent('click', {'view': window});
			a.dispatchEvent(event);
		}
		else{
			// fallover, open resource in new tab.
			window.open(url, '_blank', '');
		}
	};
}
module.exports = createSaveAs;
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}]},{},[5]);
