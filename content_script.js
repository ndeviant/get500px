// If we are in 500px.com
if (window.location.href.indexOf("500px.com") !== -1) {

	// Stop propogation on window, to prevent disable context
	preventDisableContextMenu();


	// Add the download button if we are on the photo page
	var photoContainer = document.querySelector(".react_photos_index_container");

	if (photoContainer) {
		onMutated("created", {
			element: "#copyrightTooltipContainer",
			parentNode: photoContainer,
			callback: function() {
				addButton();
			},
		});
	}

	var reactRoot = document.querySelector("#root");
	if (reactRoot) {
		// On created modal, add button
		onMutated("created", {
			element: "#copyrightTooltipContainer",
			parentNode: reactRoot,

			callback: function(mutation) {
				addButton();

				// Recreate the button, when src of photo is changed
				var modalCont = document.querySelector("#copyrightTooltipContainer");
				var photo 		= modalCont.querySelector('.photo-show__img');

				onMutated("changed", {
					targetNode: photo,
					config: { attributes: true },

					callback: function(mutationsList) {
						for(var mutation of mutationsList) {
							if (mutation.attributeName && mutation.attributeName == "src") {
								addButton();
							}
						}
					}

				});

			}
		});
	}


	// On created modal, add button
	onMutated("created", {
		element: "#pxLightbox-1",
		parentNode: document.body,
		callback: function(mutation) {
			// debugger;

			onMutated("created", {
				element: "#copyrightTooltipContainer",
				parentNode: document.querySelector(".react_photos_index_container"),
				callback: function(mutation) {
					addButton();

					// Recreate the button, when src of photo is changed
					var modalCont = document.querySelector("#copyrightTooltipContainer");
					var photo 		= modalCont.querySelector('.photo-show__img');

					onMutated("changed", {
						targetNode: photo,
						config: { attributes: true },

						callback: function(mutationsList) {
							for(var mutation of mutationsList) {
								if (mutation.attributeName && mutation.attributeName == "src") {
									addButton();
								}
							}
						}
					});
				}
			});
		}
	});
}


// Or if we on 500px CDN

if (window.location.href.indexOf("drscdn.500px.org") !== -1) {
	// If we located to encryted image show the info line

	chrome.storage.local.get("authWasFailed", function(data) {
		// If there was no error
		if (!data["authWasFailed"]) {
			var href = window.location.href;

			// And we came to encrypted image
			if (href.indexOf("?") !== -1) {
				// Save uncutted src
				chrome.storage.local.set({"photoSrc": href});

				window.location.href = href.slice(0, href.indexOf("?"));
			}

			addDownloadLine("");

			return;
		}

		chrome.storage.local.set({"authWasFailed": false});

		addDownloadLine("«Error» occurred, loaded compressed photo");
	});


	// If there is no image on the page
	// locate user to encrypted image

	if(!document.querySelector('img')) {
		chrome.storage.local.set({"authWasFailed": true});

		chrome.storage.local.get("photoSrc", function(data) {
			window.location.href = data["photoSrc"];
		});
	}


}


/* ------------------- */
/* ---- Functions ---- */
/* ------------------- */

function addButton() {

	// Find photo in the DOM
	var photoContainer = document.querySelector('#copyrightTooltipContainer');
	var photoItself 	 = photoContainer.querySelector('.photo-show__img');
	var overlay 			 = photoContainer.querySelector('[class*="PhotoContainer"]');
	console.log(photoContainer);

	if (!overlay) return;

	// Check for existanse of the button

	var zoomButton = null;

	for (var i = 0; i < overlay.childNodes.length; i++) {
		if (overlay.childNodes[i].className == "photo_container__open_button") {
			zoomButton = overlay.childNodes[i];
			break;
		}        
	}

	// Remove buttons, if they exisist
	if (!!zoomButton) {
		zoomButton.remove();
	}


	// SVG
	var svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1"><path fill="#fff" d="M 25 3 C 23.894531 3 23 3.894531 23 5 C 23 6.105469 23.894531 7 25 7 C 26.105469 7 27 6.105469 27 5 C 27 3.894531 26.105469 3 25 3 Z M 25 9 C 23.894531 9 23 9.894531 23 11 C 23 12.105469 23.894531 13 25 13 C 26.105469 13 27 12.105469 27 11 C 27 9.894531 26.105469 9 25 9 Z M 24.78125 14.96875 C 23.75 15.082031 22.976563 15.964844 23 17 L 23 34.1875 L 19.40625 30.59375 C 19.03125 30.199219 18.511719 29.972656 17.96875 29.96875 C 17.15625 29.976563 16.429688 30.472656 16.128906 31.226563 C 15.824219 31.980469 16.011719 32.839844 16.59375 33.40625 L 23.34375 40.125 C 23.371094 40.179688 23.402344 40.230469 23.4375 40.28125 L 23.59375 40.40625 C 24.019531 40.835938 24.613281 41.046875 25.214844 40.988281 C 25.816406 40.925781 26.355469 40.597656 26.6875 40.09375 L 33.40625 33.40625 C 34.003906 32.925781 34.273438 32.148438 34.101563 31.402344 C 33.929688 30.652344 33.347656 30.070313 32.597656 29.898438 C 31.851563 29.726563 31.074219 29.996094 30.59375 30.59375 L 27 34.1875 L 27 17 C 27.007813 16.457031 26.796875 15.9375 26.414063 15.554688 C 26.03125 15.171875 25.511719 14.960938 24.96875 14.96875 C 24.90625 14.964844 24.84375 14.964844 24.78125 14.96875 Z M 2 33 L 2 44.90625 C 2 46.589844 3.410156 48 5.09375 48 L 44.90625 48 C 46.589844 48 48 46.589844 48 44.90625 L 48 33 L 44 33 L 44 44 L 6 44 L 6 33 Z "></path></svg>';


	// Creation of element
	zoomButton					 = document.createElement('div');
	zoomButton.className = "photo_container__open_button";
	zoomButton.innerHTML = svg;

	// Add button to the page
	overlay.prepend(zoomButton);

	// Add click function
	zoomButton.addEventListener("click", openPhoto);

	function openPhoto() {
		var photoSrc = photoItself.src;

		// Save uncutted src
		chrome.storage.local.set({"photoSrc": photoSrc});

		photoSrc = photoSrc.slice(0, photoSrc.indexOf("?"));

		window.open(photoSrc,'_blank');
	}

}


function addDownloadLine(text) {
	addFont();
	var infoLine = addInfoLine({
		text,
	});

	var photo = document.querySelector("img");
	var newPhoto = createCanvas(photo);

	canvasToBlob(newPhoto, { compressionRatio: 0.9 }).then(image => {
		createDownloadLink(infoLine.children[0]);
	});
}


function onMutated(eventName, options) { 
	if (eventName === "changed") {
		var targetNode = options.targetNode;
		var config 		 = options.config || { attributes: true };
		var callback 	 = options.callback;

		var observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	} 


	if (eventName === "created") {
		var element 	 = options.element;
		var parentNode = options.parentNode;
		var config 		 = options.config || { childList: true };
		var callback 	 = options.callback;

		var searchBy	 = element[0] == "." ? "className" : "id";
		element 			 = element.slice(1);

		var observerCallback = function(mutationsList) {
			for(var mutation of mutationsList) {
				if (mutation.addedNodes[0] && mutation.addedNodes[0][searchBy].indexOf(element) != -1) {
					callback(mutation);
				}
			}
		}

		var observer = new MutationObserver(observerCallback);
		observer.observe(parentNode, config);
	}

}


function createCanvas(image) {
	var image = document.querySelector("img");

	var imgCanvas = document.createElement("canvas");
	var imgContext = imgCanvas.getContext("2d");

	imgCanvas.width = image.naturalWidth;
	imgCanvas.height = image.naturalHeight;

	imgContext.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height);  

	return imgCanvas;
}

function canvasToBlob(canvas, {compressionRatio = 1}) {
	return new Promise(function(resolve, reject) {
		canvas.toBlob(function(blob) {
			var url = URL.createObjectURL(blob);
			var newImage = document.createElement("img");

			newImage.src = url;
			newImage.className = "canvas-blob";

			document.body.appendChild(newImage);

			resolve(newImage);
		}, 'image/jpeg', compressionRatio);
	})
}

function createDownloadLink(appendTo, url) {
	appendTo = (appendTo === undefined) ? document.body : appendTo;
	url 		 = (url === undefined) ? document.querySelector(".canvas-blob").src : url;

	var imageNumbers  = window.location.pathname.slice("/photo/".length);
	imageNumbers			= imageNumbers.slice(0, imageNumbers.indexOf("/"));

	var downloadA  			= document.createElement('a');
	downloadA.href      = url;
	downloadA.className = "download-a";
	downloadA.innerHTML = "Download";
	downloadA.download  = "stock-photo-" + imageNumbers + ".jpg";

	appendTo.appendChild(downloadA);
}


function addFont() {
	var fontLink 	= document.createElement('link');
	fontLink.href = "https://fonts.googleapis.com/css?family=Nunito";
	fontLink.rel 	= "stylesheet";

	document.head.append(fontLink);

	return fontLink;
}


function addInfoLine(options) {
	var infoLine				= document.createElement('div');
	infoLine.className = "info-line";
	infoLine.innerHTML = "<div class='info-line-box'>" + options.text + "</div>";

	document.body.append(infoLine);

	return infoLine;
}

function preventDisableContextMenu() {
	window.addEventListener("contextmenu", function (event) {
	    event.stopPropagation();
	}, true);
}