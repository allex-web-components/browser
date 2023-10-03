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


