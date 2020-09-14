export const imgToCanvas = image => {
	const imgCanvas = document.createElement("canvas");
	const imgContext = imgCanvas.getContext("2d");

	imgCanvas.width = image.naturalWidth;
	imgCanvas.height = image.naturalHeight;

	imgContext.drawImage(image, 0, 0, imgCanvas.width, imgCanvas.height);

	return imgCanvas;
};

export const canvasToBlob = (canvas, { compressionRatio = 1 }) => {
	return new Promise(resolve => {
		canvas.toBlob(
			blob => {
				const url = URL.createObjectURL(blob);
				resolve({ url, blob });
			},
			"image/jpeg",
			compressionRatio,
		);
	});
};

export const getPhotoName = src => {
	let imageNumbers = src.slice("/photo/".length);
	imageNumbers = imageNumbers.slice(0, imageNumbers.indexOf("/"));
	return `stock-photo-${imageNumbers}.jpg`;
};
