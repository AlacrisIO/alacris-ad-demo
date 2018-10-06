
$(function() {
    var getPK = function(callback) {
        chrome.storage.sync.get('alacrisPublicKey', function(items){
            callback(items.alacrisPublicKey);
        })
    };

    var setPK = function(updatedValue){
        chrome.storage.sync.set({'alacrisPublicKey': updatedValue}, function() {
            showCorrectScreen();
        });
    };
    
    var updateDisplay = function(){
        getPK(function(pkResult){
            $('#pk').text(pkResult);
        });
        
    };

    var resetPK = function() {
        chrome.storage.sync.remove('alacrisPublicKey', function(){
            $('#public_key').val(null);
            showCorrectScreen();
        });
    };

    var showCorrectScreen = function(){
        getPK(function(pkResult){
            if(pkResult != undefined){
                updateDisplay();
                $('#public_key_form').hide();
                $('#alacrisDisplay').show();
            } else {
                $('#public_key_form').show();
                $('#alacrisDisplay').hide();
            }
        });
        
    };

    $("#resetPK").click(function(){
        resetPK();
    });

    showCorrectScreen();
    chrome.tabs.executeScript({
        file: 'inject.js'
    });

    $('#public_key_form').submit(function(event){
        event.preventDefault()
        setPK($('#public_key').val());
    });
});
