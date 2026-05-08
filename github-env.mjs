import environment from './environment.mjs';

let githubEnv = {
	getPathSegmentsCount: function () {
		const currentUrl = window.location.href;
		const path = new URL(currentUrl).pathname;
		const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
		const count = (pathWithoutLeadingSlash.match(/\//g) || []).length;
		return count;
	},
	hasBackgroundImage: function (element) {
		const computedStyle = window.getComputedStyle(element);
		const backgroundImage = computedStyle.getPropertyValue('background-image');
		console.log(backgroundImage);
		return backgroundImage;
	},
	adjustBackgroundImageUrls: function (element, prependLevels) {
		const backgroundImage = githubEnv.hasBackgroundImage(element)
		if (backgroundImage !== 'none') {
			const url = backgroundImage.slice(4, -1).replace(/['"]/g, '');
			const adjustedUrl = '../'.repeat(prependLevels) + url;
			element.style.backgroundImage = `url(${adjustedUrl})`;
		}
	},
};

document.addEventListener('DOMContentLoaded', function () {
	console.log("Env:", environment);
	const segmentsCount = githubEnv.getPathSegmentsCount();

	// if (environment == 'local') {
	// 	const allElements = document.querySelectorAll('*');
	// 	allElements.forEach((element) => {
	// 		githubEnv.adjustBackgroundImageUrls(element, segmentsCount);
	// 	});
	// }

});