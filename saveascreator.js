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