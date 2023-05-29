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