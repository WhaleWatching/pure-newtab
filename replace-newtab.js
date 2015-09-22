(function (document) {
  document.close();
  var currentLocale = chrome.i18n.getMessage("@@ui_locale");
  document.write(
      '<!doctype html>' +
      '<html>' +
        '<head>' +
          '<link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('container.css') + '">' +
          '<link rel="import" href="' + chrome.extension.getURL('newtab.html') + '">' +
        '</head>' +
        '<body>' +
          '<extension-localize-source source=""></extension-localize-source>' +
          '<pure-newtab></pure-newtab>' +
        '</body>' +
      '</html>'
    );
  document.close()
})(window.document);