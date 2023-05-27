(function (execlib) {
  'use strict';

  var lR = execlib.execSuite.libRegistry,
    mylib = {};

  require('./viewtransitioncreator')(execlib.lib, mylib);
  require('./messagingcreator')(execlib.lib, mylib);

  lR.register('allex_browserwebcomponent', mylib);
})(ALLEX);
