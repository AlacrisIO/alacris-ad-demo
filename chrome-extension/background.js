// this is the background code...

// listen for our browerAction to be clicked
chrome.tabs.onUpdated.addListener(function () {
  // for the current tab, inject the "inject.js" file & execute it
	chrome.tabs.executeScript({
		file: 'inject.js'
	});
});