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

		// Populate submenu container with options
		this.submenu.forEach((menuItem) => {
			if (menuItem.type && menuItem.type === "separator") this.#createSeparator();
			else this.#createMenuItem(menuItem);
		});

		// Append elements to parent
		this.parentElement.appendChild(this.button);
		this.parentElement.appendChild(this.container);

		// Bind handlers to this instance
		this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
		this.boundHandleWindowBlur = this.handleWindowBlur.bind(this);
	}

	#createSeparator() {
		// Create main element
		const separatorElement = document.createElement("div");
		separatorElement.classList.add("tab-list-separator");
		this.container.appendChild(separatorElement);
	}

	/**
	 * @param {MenuItem} menuItem
	 */
	#createMenuItem(menuItem) {
		// Create main element
		const mainElement = document.createElement("div");
		mainElement.dataset.commandId = menuItem.commandId;
		mainElement.classList.add("tab-list-option");
		mainElement.addEventListener("click", () => {
			this.closeMenu();
			menu.sendMenuEvent(menuItem.commandId);
		});

		// Add label
		const labelElement = document.createElement("p");
		labelElement.classList.add("tab-list-option-label");
		labelElement.textContent = menuItem.label;
		mainElement.appendChild(labelElement);

		const accelerator = calculateAccelerator(menuItem);

		// Add accelerator (if there is one)
		if (accelerator) {
			const acceleratorElement = document.createElement("p");
			acceleratorElement.classList.add("tab-list-option-accelerator");
			acceleratorElement.textContent = accelerator;
			mainElement.appendChild(acceleratorElement);
		}

		this.container.appendChild(mainElement);
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

function calculateAccelerator(menuItem) {
	/**
	 * @type {string}
	 */
	let accelerator;

	// Calculate accelerator from roles
	if (menuItem.role) {
		switch (menuItem.role.toLowerCase()) {
			case "undo":
				accelerator = "Ctrl+Z";
				break;
			case "redo":
				accelerator = "Ctrl+Y";
				break;
			case "cut":
				accelerator = "Ctrl+X";
				break;
			case "copy":
				accelerator = "Ctrl+C";
				break;
			case "paste":
				accelerator = "Ctrl+V";
				break;
			case "selectall":
				accelerator = "Ctrl+A";
				break;
			case "minimize":
				accelerator = "Ctrl+M";
				break;
			case "close":
				accelerator = "Ctrl+W";
				break;
			case "reload":
				accelerator = "Ctrl+R";
				break;
			case "forcereload":
				accelerator = "Ctrl+Shift+R";
				break;
			case "toggledevtools":
				accelerator = "Ctrl+Shift+I";
				break;
			case "togglefullscreen":
				accelerator = "F11";
				break;
			case "resetzoom":
				accelerator = "Ctrl+0";
				break;
			case "zoomin":
				accelerator = "Ctrl++";
				break;
			case "zoomout":
				accelerator = "Ctrl+-";
				break;
		}
	}

	// Or get it from menuItem if it has one
	if (menuItem.accelerator) accelerator = menuItem.accelerator;

	if (accelerator) {
		accelerator = accelerator.replace(/(Cmd)|(Command)|(Or)|(\s)/gi, "");
		accelerator = accelerator.replace(/(Control)/gi, "Ctrl");
		accelerator = accelerator
			.split("+")
			.map((elem) => (elem.length === 1 ? elem.toUpperCase() : elem))
			.join(" + ");
	}

	return accelerator;
}

export default TablistButton;
