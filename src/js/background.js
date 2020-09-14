import "../images/Get500px_16.png";
import "../images/Get500px_32.png";
import "../images/Get500px_64.png";
import "../images/Get500px_128.png";
import "../images/Get500px.png";

function onExtensionClick(tab) {
	function findImageSrc() {
		document
			.querySelector("[class*='Elements__PhotoContainer'] > img")
			.src.toString();
	}

	if (tab.url.indexOf("500px.com") !== -1) {
		// Convert a function into a string
		const functionString = fnToString(findImageSrc);

		chrome.tabs.executeScript(null, { code: functionString }, srcArg => {
			const [src] = srcArg;
			console.log("onExtensionClick -> srcArg", srcArg);

			chrome.tabs.create({
				url: src,
				index: tab.index + 1,
			});
		});
	}
}

// Convert a function into a string
function fnToString(fn) {
	const functionString = fn
		.toString()
		.slice(fn.toString().indexOf("{") + 1, fn.toString().lastIndexOf("}"))
		.trim();

	return functionString;
}

chrome.browserAction.onClicked.addListener(onExtensionClick);
