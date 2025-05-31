import ListMenu from "./ListMenu.js";

class TablistButton {
	/**
	 * @type {TablistButton}
	 */
	static currentlyOpen = null; // Static property to track the currently open menu

	constructor(parentElement, label, submenu) {
		// Bind handlers to this instance
		this.boundHandleClick = this.handleClick.bind(this);
		this.boundHandleMouseEnter = this.handleMouseEnter.bind(this);
		this.boundHandleOutsideClick = this.handleOutsideClick.bind(this);
		this.boundHandleWindowBlur = this.handleWindowBlur.bind(this);

		this.label = label.charAt(0).toUpperCase() + label.slice(1);
		this.isOpen = false;

		// Create li element
		this.liElement = document.createElement("li");
		this.liElement.classList.add("tab-list-button");
		this.liElement.addEventListener("click", this.boundHandleClick);
		this.liElement.addEventListener("mouseenter", this.boundHandleMouseEnter);

		// Create p element and append to li
		this.pElement = document.createElement("p");
		this.pElement.textContent = this.label;
		this.liElement.appendChild(this.pElement);

		// Create submenu, always use 'bottom-left' position
		this.listMenu = new ListMenu(this.liElement, submenu, this.isOpen);

		// Append li to parent
		parentElement.appendChild(this.liElement);
	}

	openMenu() {
		this.isOpen = true;

		// Close currentlyOpen if it's not this instace, then update static variable
		if (TablistButton.currentlyOpen) TablistButton.currentlyOpen.closeMenu();
		TablistButton.currentlyOpen = this;

		// Show container
		this.listMenu.show();
		// Add open class
		this.liElement.classList.add("open");

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
		this.listMenu.hide();
		// Remove open class
		this.liElement.classList.remove("open");

		// Remove event listener for outside clicks
		document.removeEventListener("click", this.boundHandleOutsideClick);
		// Remove event listener for window blur (lost focus)
		window.removeEventListener("blur", this.boundHandleWindowBlur);
	}

	handleClick(event) {
		event.stopPropagation();

		if (this.isOpen) this.closeMenu();
		else this.openMenu();
	}

	handleMouseEnter() {
		// If this tablist button is already open, do nothing
		if (this.isOpen) return;

		// If no other tablist button open, do nothing
		if (!TablistButton.currentlyOpen) return;

		// Otherwise open this tablist button
		this.openMenu();
	}

	handleOutsideClick(event) {
		if (!this.liElement.contains(event.target)) {
			this.closeMenu();
		}
	}

	handleWindowBlur() {
		this.closeMenu();
	}
}

export default TablistButton;
