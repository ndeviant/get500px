/**
 * Runs only on 500px.com
 */

// Main function
(async () => {
	if (window.location.href.indexOf("500px.com") === -1) {
		return;
	}

	// Stop propogation on window, to prevent disable context
	preventDisableContextMenu();

	// Add the download button if we are on the photo page
	const photoContainer = document.querySelector(
		"[class*='Elements__PhotoUIWrapper']",
	);

	if (photoContainer) {
		onMutated("created", {
			element: "#copyrightTooltipContainer",
			parentNode: photoContainer,
			callback() {
				addButton();
			},
		});
	}

	const reactRoot = document.querySelector("#root");
	if (!reactRoot) {
		return;
	}

	// On created modal, add button
	onMutated("created", {
		element: "#copyrightTooltipContainer",
		parentNode: reactRoot,

		callback() {
			addButton();

			// Recreate the button, when src of photo is changed
			const modalCont = document.querySelector("#copyrightTooltipContainer");
			const photo = modalCont.querySelector(".photo-show__img");

			onMutated("changed", {
				targetNode: photo,
				config: { attributes: true },

				callback(mutationsList) {
					mutationsList.forEach(mutation => {
						if (mutation.attributeName && mutation.attributeName === "src") {
							addButton();
						}
					});
				},
			});
		},
	});
})();

/* ------------------- */
/* ---- Functions ---- */
/* ------------------- */

function addButton() {
	// Find photo in the DOM
	const photoContainer = document.querySelector("#copyrightTooltipContainer");
	const photoItself = photoContainer.querySelector(".photo-show__img");
	const overlay = photoContainer.querySelector(
		'[class*="Elements__PhotoUIWrapper"]',
	);

	const openButtonClassName = "photo_container__open_button";

	if (!overlay) return;

	// Check for existanse of the button
	let openButton = overlay.querySelector(`.${openButtonClassName}`);

	// Remove buttons, if they exisist
	if (openButton) {
		openButton.remove();
	}

	// SVG
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50" version="1.1"><path fill="#fff" d="M 25 3 C 23.894531 3 23 3.894531 23 5 C 23 6.105469 23.894531 7 25 7 C 26.105469 7 27 6.105469 27 5 C 27 3.894531 26.105469 3 25 3 Z M 25 9 C 23.894531 9 23 9.894531 23 11 C 23 12.105469 23.894531 13 25 13 C 26.105469 13 27 12.105469 27 11 C 27 9.894531 26.105469 9 25 9 Z M 24.78125 14.96875 C 23.75 15.082031 22.976563 15.964844 23 17 L 23 34.1875 L 19.40625 30.59375 C 19.03125 30.199219 18.511719 29.972656 17.96875 29.96875 C 17.15625 29.976563 16.429688 30.472656 16.128906 31.226563 C 15.824219 31.980469 16.011719 32.839844 16.59375 33.40625 L 23.34375 40.125 C 23.371094 40.179688 23.402344 40.230469 23.4375 40.28125 L 23.59375 40.40625 C 24.019531 40.835938 24.613281 41.046875 25.214844 40.988281 C 25.816406 40.925781 26.355469 40.597656 26.6875 40.09375 L 33.40625 33.40625 C 34.003906 32.925781 34.273438 32.148438 34.101563 31.402344 C 33.929688 30.652344 33.347656 30.070313 32.597656 29.898438 C 31.851563 29.726563 31.074219 29.996094 30.59375 30.59375 L 27 34.1875 L 27 17 C 27.007813 16.457031 26.796875 15.9375 26.414063 15.554688 C 26.03125 15.171875 25.511719 14.960938 24.96875 14.96875 C 24.90625 14.964844 24.84375 14.964844 24.78125 14.96875 Z M 2 33 L 2 44.90625 C 2 46.589844 3.410156 48 5.09375 48 L 44.90625 48 C 46.589844 48 48 46.589844 48 44.90625 L 48 33 L 44 33 L 44 44 L 6 44 L 6 33 Z "></path></svg>`;

	// Creation of element
	openButton = document.createElement("div");
	openButton.className = "photo_container__open_button";
	openButton.innerHTML = svg;

	// Add button to the page
	overlay.prepend(openButton);

	// Add click function
	openButton.addEventListener("click", () => {
		const photoSrc = photoItself.src;

		window.open(photoSrc, "_blank");
	});
}

function onMutated(eventName, options) {
	const promise = new Promise(resolve => {
		const { targetNode, parentNode, callback } = options;

		if (eventName === "changed") {
			const config = { attributes: true, ...options.config };

			const observer = new MutationObserver((...args) => {
				callback(...args);
				resolve(...args);
			});
			observer.observe(targetNode, config);
			return;
		}

		if (eventName === "created") {
			let { element } = options;
			const config = { childList: true, ...options.config };

			const searchBy = element[0] === "." ? "className" : "id";
			element = element.slice(1);

			const observerCallback = mutationsList => {
				mutationsList.forEach(mutation => {
					if (
						mutation.addedNodes[0] &&
						mutation.addedNodes[0][searchBy].indexOf(element) !== -1
					) {
						callback(mutation);
						resolve(mutation);
					}
				});
			};

			const observer = new MutationObserver(observerCallback);
			observer.observe(parentNode, config);
		}
	});

	return promise;
}

function preventDisableContextMenu() {
	window.addEventListener(
		"contextmenu",
		event => {
			event.stopPropagation();
		},
		true,
	);
}
