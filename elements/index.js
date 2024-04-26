function createElements (execlib, lR, mylib) {
  'use strict';

  var lib = execlib.lib;
  var applib = lR.get('allex_applib');
  require('./themingcreator')(lib, applib, mylib);
}
module.exports = createElements;