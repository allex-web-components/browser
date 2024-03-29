(function (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    mylib = {};

  require('./viewtransitioncreator')(execlib.lib, mylib);
  require('./messagingcreator')(execlib.lib, mylib);
  require('./clipboardcreator')(execlib.lib, mylib);
  require('./printingcreator')(execlib.lib, mylib);
  require('./saveascreator')(execlib.lib, mylib);
  require('./utilscreator')(execlib.lib, mylib);


  lR.register('allex_browserwebcomponent', mylib);
})(ALLEX);
