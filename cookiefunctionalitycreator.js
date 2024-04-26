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