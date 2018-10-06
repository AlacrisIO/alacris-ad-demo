
$(function() {
    window.test = "boom";
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
          var storageChange = changes[key];
          var publicKeyScript = "var alacris='" + storageChange.newValue + "';";
          chrome.tabs.executeScript({
            code: publicKeyScript
          });
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
      });

    $('#public_key_form').submit(function(event){
        event.preventDefault()
        chrome.storage.sync.set({'alacrisPublicKey': $('#public_key').val()}, function() {
            console.log("Public Key is Set!");
          });
    });
});
