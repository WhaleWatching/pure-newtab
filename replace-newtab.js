(function (document) {
  document.write(
      '<!doctype html>' +
      '<html>' +
        '<head>' +
          '<link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('container.css') + '">' +
          '<link rel="import" href="' + chrome.extension.getURL('newtab.html') + '">' +
        '</head>' +
        '<body>' +
          '<pure-newtab></pure-newtab>' +
        '</body>' +
      '</html>'
    );
  document.close()
})(window.document);