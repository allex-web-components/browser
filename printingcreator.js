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