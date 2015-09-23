(function (document) {
  // Close current document loading
  document.close();

  // Get varibles
  var localize_folder = chrome.i18n.getMessage("folderName");
  var app_id = chrome.i18n.getMessage("@@extension_id");
  var localize_data_url = 'chrome-extension://' + app_id + '/_locales/' + localize_folder + '/messages.json'

  // Get localize data
  var xhr_localize_data = new XMLHttpRequest();
  xhr_localize_data.addEventListener('load', function () {
    writeNewTabContentWithLocalizeString(this.responseText);
  });
  xhr_localize_data.open('GET', localize_data_url);
  xhr_localize_data.send();

  function writeNewTabContentWithLocalizeString (localizeString) {
    document.write(
        '<!doctype html>' +
        '<html>' +
          '<head>' +
            '<link rel="stylesheet" type="text/css" href="' + chrome.extension.getURL('container.css') + '">' +
            '<link rel="import" href="' + chrome.extension.getURL('newtab.html') + '">' +
          '</head>' +
          '<body>' +
            '<pure-newtab></pure-newtab>' +
            '<div class="localization-loader">' +
              '<localization-source></localization-source>' +
            '</div>' +
          '</body>' +
        '</html>'
      );
    document.querySelector('localization-source').setAttribute("source", localizeString);
    document.close()
  }
})(window.document);