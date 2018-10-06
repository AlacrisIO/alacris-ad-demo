
$(function() {
    var getPK = function() {
        chrome.storage.sync.get('alacrisPublicKey', function(items){
            if(items.alacrisPublicKey) {
                return items.alacrisPublicKey;
            }
        })
    };

    var setPK = function(updatedValue){
        return chrome.storage.sync.set({'alacrisPublicKey': updatedValue, function() {
            console.log("Public Key is Set!");
            return true;
        }});
    };
    
    var updateDisplay = function(){
        $('#pk').text(getPK());
    };

    var resetPK = function() {
        chrome.storage.sync.remove('alacrisPublicKey', function(){});
    };

    var showCorrectScreen = function(){
        console.log(getPK());
        if(getPK()){
            updateDisplay();
            $('#public_key_form').hide();
            $('#alacrisDisplay').show();
        } else {
            $('#public_key_form').show();
            $('#alacrisDisplay').hide();
        }
    };

    $("#resetPK").click(function(){
        resetPK();
        showCorrectScreen();
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
