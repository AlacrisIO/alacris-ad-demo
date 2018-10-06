(function() {
    var setBodyAttr = function(newValue){
        var body = document.body;
        body.setAttribute('alacris',newValue);
    }
    chrome.storage.sync.get('alacrisPublicKey', function(items){
        if(items.alacrisPublicKey) {
            setBodyAttr(items.alacrisPublicKey);
        }
    })
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
          var storageChange = changes[key];
          setBodyAttr(storageChange.newValue);
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        }
      });  

})();