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