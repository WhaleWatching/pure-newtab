(function (document) {
  document.close();
  var extensionID = chrome.i18n.getMessage("@@extension_id");
  document.write(
      '<!doctype html>' +
      '<html>' +
        '<head>' +
          '<link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('container.css') + '">' +
          '<link rel="import" href="' + chrome.extension.getURL('newtab.html') + '">' +
        '</head>' +
        '<body>' +
          '<extension-config extid="' + extensionID + '"></extension-config>' +
          '<pure-newtab></pure-newtab>' +
        '</body>' +
      '</html>'
    );
  document.close()
})(window.document);