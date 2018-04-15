function onExtensionClick(tab) {

	if (tab.url.indexOf("500px.com") != -1) {

		function insertedFunction() {
			document.getElementsByClassName('photo_container')[0]
			.getElementsByClassName('photo')[0]
			.src.toString();
		}

		// Conver a function into a string
		var functionString = insertedFunction.toString()
		.slice(insertedFunction.toString().indexOf("{") + 1, insertedFunction.toString().lastIndexOf("}"))
		.trim();

		chrome.tabs.executeScript(null, 
			{"code" : functionString}, 
			function(src) {
				src = src[0];
						
				// Save uncutted src
				chrome.storage.local.set({"photoSrc": src});

				src = src.slice(0, src.indexOf("?"));

				chrome.tabs.create({ 
					url 	: src,
					index : tab.index + 1
				});
		});
	}
}

chrome.browserAction.onClicked.addListener(onExtensionClick);


// Message listeners

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {

	if(response == "injectCSS") {
		chrome.tabs.insertCSS(sender.tab.id, { file: "injected.css"});
	}

});