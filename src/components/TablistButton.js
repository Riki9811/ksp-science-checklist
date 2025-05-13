class TablistButton {
	/**
	 * @type {TablistButton}
	 */
	static currentlyOpen = null; // Static property to track the currently open menu

	constructor(parentElement, label, submenu) {
		this.parentElement = parentElement;
		this.label = label.charAt(0).toUpperCase() + label.slice(1);
		this.submenu = submenu;
		this.isOpen = false;
		this.positioned = false;

		// Create button element
		this.button = document.createElement("button");
		this.button.textContent = this.label;
		this.button.classList.add("tab-list-button");
		this.button.addEventListener("click", (e) => this.toggleMenu(e));
		this.button.addEventListener("mouseenter", () => this.onMouseEnterButton());

		// Create submenu container
		this.container = document.createElement("div");
		this.container.classList.add("tab-list-container");
		this.container.style.display = "none";
		this.container.style.position = "absolute";

		// Populate submenu container with options
		this.submenu.forEach((menuItem) => {
			const optionElement = document.createElement("div");
			optionElement.textContent = menuItem.label;
			optionElement.classList.add("tab-list-option");
			optionElement.addEventListener("click", () => {
				console.log("Option selected:", menuItem);
				this.closeMenu();
			});
			this.container.appendChild(optionElement);
		});

		// Append elements to parent
		this.parentElement.appendChild(this.button);
		this.parentElement.appendChild(this.container);

		// Bind handlers to this instance
		this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
		this.boundHandleWindowBlur = this.handleWindowBlur.bind(this);
	}

	toggleMenu(event) {
		event.stopPropagation();

		if (this.isOpen) this.closeMenu();
		else this.openMenu();
	}

	openMenu() {
		this.isOpen = true;

		// Close currentlyOpen if it's not this instace, then update static variable
		if (TablistButton.currentlyOpen) TablistButton.currentlyOpen.closeMenu();
		TablistButton.currentlyOpen = this;

		// Show container and position it if needed
		this.container.style.display = "block";
		if (!this.positioned) this.positionMenu();

		// Add event listener for outside clicks
		document.addEventListener("click", this.boundHandleOutsideClick);
		// Add listener for window blur (lost focus)
		window.addEventListener("blur", this.boundHandleWindowBlur);
	}

	closeMenu() {
		this.isOpen = false;

		// Clear the currently open menu
		TablistButton.currentlyOpen = null;

		// Hide container
		this.container.style.display = "none";

		// Remove event listener for outside clicks
		document.removeEventListener("click", this.boundHandleOutsideClick);
		// Remove event listener for window blur (lost focus)
		window.removeEventListener("blur", this.boundHandleWindowBlur);
	}

	positionMenu() {
		// Position the container under the button
		const buttonRect = this.button.getBoundingClientRect();
		this.container.style.top = `${buttonRect.bottom}px`;
		this.container.style.left = `${buttonRect.left}px`;

		this.positioned = true;
	}

	onMouseEnterButton() {
		// Open other tab menu on mouse enter if another one is already open
		if (TablistButton.currentlyOpen) this.openMenu();
	}

	handleOutsideClick(event) {
		if (!this.container.contains(event.target)) {
			this.closeMenu();
		}
	}

	handleWindowBlur() {
		// this.closeMenu();
	}
}

export default TablistButton;
