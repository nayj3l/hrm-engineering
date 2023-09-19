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