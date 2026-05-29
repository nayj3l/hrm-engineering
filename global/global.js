function loadAndInsertHTML(url, placeholderId) {
	const placeholder = document.getElementById(placeholderId);
	if (!placeholder) {
		return Promise.resolve();
	}

	fetch(url)
		.then(response => {
			if (!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`);
			}

			return response.text();
		})
		.then(html => {
			placeholder.innerHTML = html;

			if (placeholderId === "header-placeholder") {
				initializeHeader(placeholder);
			}
		})
		.catch(error => {
			console.error(`Error loading ${url}: ${error}`);
		});
}

function closeSubmenus(header) {
	header.querySelectorAll(".has-submenu").forEach(item => {
		item.classList.remove("is-open");
		const button = item.querySelector(".submenu-toggle");
		if (button) {
			button.setAttribute("aria-expanded", "false");
		}
	});
}

function initializeHeader(headerPlaceholder) {
	const header = headerPlaceholder.querySelector("header");
	if (!header) {
		return;
	}

	const navigation = header.querySelector(".navigation");
	const navToggle = header.querySelector(".nav-toggle");
	const submenuButtons = header.querySelectorAll(".submenu-toggle");

	if (!headerPlaceholder.dataset.scrollBound) {
		const isHomePage = document.body.classList.contains("page-home");
		
		if (isHomePage) {
			// On home page, always keep sticky class for white header
			headerPlaceholder.classList.add("sticky");
		} else {
			// On other pages, toggle sticky based on scroll
			const updateStickyState = () => {
				headerPlaceholder.classList.toggle("sticky", window.scrollY > 24);
			};
			window.addEventListener("scroll", updateStickyState, { passive: true });
			updateStickyState();
		}
		
		headerPlaceholder.dataset.scrollBound = "true";
	}

	if (navToggle && navigation && !navToggle.dataset.bound) {
		navToggle.dataset.bound = "true";
		navToggle.addEventListener("click", () => {
			const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
			navToggle.setAttribute("aria-expanded", String(!isExpanded));
			navigation.classList.toggle("is-open", !isExpanded);
			document.body.classList.toggle("nav-open", !isExpanded);

			if (isExpanded) {
				closeSubmenus(header);
			}
		});
	}

	submenuButtons.forEach(button => {
		if (button.dataset.bound) {
			return;
		}

		button.dataset.bound = "true";
		button.addEventListener("click", event => {
			event.preventDefault();
			const parent = button.closest(".has-submenu");
			const willOpen = !parent.classList.contains("is-open");

			closeSubmenus(header);
			parent.classList.toggle("is-open", willOpen);
			button.setAttribute("aria-expanded", String(willOpen));
		});
	});

	header.querySelectorAll(".navigation a").forEach(link => {
		if (link.dataset.bound) {
			return;
		}

		link.dataset.bound = "true";
		link.addEventListener("click", () => {
			if (navigation) {
				navigation.classList.remove("is-open");
			}

			if (navToggle) {
				navToggle.setAttribute("aria-expanded", "false");
			}

			document.body.classList.remove("nav-open");
			closeSubmenus(header);
		});
	});
}

document.addEventListener("click", event => {
	const header = document.querySelector("#header-placeholder header");
	if (!header || header.contains(event.target)) {
		return;
	}

	const navigation = header.querySelector(".navigation");
	const navToggle = header.querySelector(".nav-toggle");
	if (navigation) {
		navigation.classList.remove("is-open");
	}

	if (navToggle) {
		navToggle.setAttribute("aria-expanded", "false");
	}

	document.body.classList.remove("nav-open");
	closeSubmenus(header);
});

	document.addEventListener("DOMContentLoaded", function () {
		const headerPlaceholder = document.getElementById("header-placeholder");
		if (headerPlaceholder && headerPlaceholder.querySelector("header")) {
			initializeHeader(headerPlaceholder);
		}
	});