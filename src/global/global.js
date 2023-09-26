function loadAndInsertHTML(url, placeholderId) {
	const placeholder = document.getElementById(placeholderId);
	fetch(url)
		.then(response => response.text())
		.then(html => {
			placeholder.innerHTML = html;
		})
		.catch(error => {
			console.error(`Error loading ${url}: ${error}`);
		});
}

document.addEventListener('DOMContentLoaded', function () {
	window.onscroll = function () { myFunction() };
	var header = document.getElementById("header-placeholder");
	var sticky = header.offsetTop;

	function myFunction() {
		if (window.scrollY > sticky) {
			header.classList.add("sticky");
		} else {
			header.classList.remove("sticky");
		}
	}
});