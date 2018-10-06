
$(function() {
    const BASEAPI = '';
    const BALANCEAPI = 'balance.json';
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
    var updateBalance = function(data){
        $('#alacrisBalance').text(parseInt(data.account_balance, 16) + ' wei');
    }
    var updateDisplay = function(){
        getPK(function(pkResult){
            $('#pk').text(pkResult);

            var data = `{ "address": "${pkResult}" }`;
            fetch(BALANCEAPI, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, same-origin, *omit
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            })
            .then((resp) => resp.json())
            .then(function(data) {
                updateBalance(data);
                
            })
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
