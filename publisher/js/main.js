$(function() {
    
    var publisherKey = '0x0b714c8640329cbc313e09eeedf0ac76db2b5df7';

    var adInterval = setInterval(function(){
        var viewerKey = $('body').attr('alacris');
        if (viewerKey){
            var adURL = `http://ec2-52-203-232-2.compute-1.amazonaws.com:5000/ad_server/serve/viewer/${viewerKey}/publisher/${publisherKey}`;
            $('#ad_here').html(`<iframe src='${adURL}'></iframe>`);
            clearInterval(adInterval);
        }    
    }, 1000);

    
});