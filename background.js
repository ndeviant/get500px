function onExtensionClick(tab) {

	if (tab.url.indexOf("500px.com") != -1) {

		chrome.tabs.executeScript(null, 
			{"code" : "document.getElementsByClassName('photo_container')[0].getElementsByClassName('photo')[0].src.toString()"}, 
			function(src) {
				src = src[0];
				src = src.slice(0, src.indexOf("?"));

				chrome.tabs.create({ url : src});
		});
	}
}

chrome.browserAction.onClicked.addListener(onExtensionClick);

// Trying to add download button

// if (tab.url.indexOf("500px.com") != -1) {

// 	chrome.tabs.executeScript(null, 
// 		{"code" : "document.getElementsByClassName('photo_container')[0].getElementsByClassName('photo')[0].src.toString()"}, 
// 		function(src) {
// 			src = src[0];
// 			src = src.slice(0, src.indexOf("?"));

// 			chrome.tabs.create({ url : src});
// 		});
// }

// document.getElementsByClassName('photo_container__show_focus_button')[0].parentNode.prepend(document.getElementsByClassName('photo_container__show_focus_button')[0].cloneNode(true));