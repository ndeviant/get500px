/**
 * Runs only on CDN.
 */
import FileSaver from "file-saver";
import { canvasToBlob, getPhotoName, imgToCanvas } from "../helpers/image";

// Main function
(async () => {
	if (window.location.href.indexOf("drscdn.500px.org") === -1) {
		return;
	}

	const photo = document.querySelector("img");
	const newPhoto = imgToCanvas(photo);

	const { url } = await canvasToBlob(newPhoto, { compressionRatio: 0.9 });

	photo.src = url;
	photo.addEventListener("contextmenu", e => {
		FileSaver.saveAs(url, getPhotoName(window.location.pathname));
		e.preventDefault();
	});
})();

/* ------------------- */
/* ---- Functions ---- */
/* ------------------- */

async function addDownloadLine(text) {
	addFont();

	addInfoLine({
		text,
	});
}

function addFont() {
	const fontLink = document.createElement("link");
	fontLink.href = "https://fonts.googleapis.com/css?family=Nunito";
	fontLink.rel = "stylesheet";

	document.head.append(fontLink);

	return fontLink;
}

function addInfoLine({ text } = {}) {
	const infoLine = document.createElement("div");
	infoLine.className = "info-line";
	infoLine.innerHTML = `<div class='info-line-box'>${text}</div>`;

	document.body.append(infoLine);

	return infoLine;
}
