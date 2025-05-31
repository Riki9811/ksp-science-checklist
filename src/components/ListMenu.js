class ListMenu {
	#submenus = [];
	#openSubmenuEntry;

	constructor(parentElement, template, open = false, isSubmenu = false) {
		this.parentElement = parentElement;

		// Bind functions
		this.boundHideSubmenu = this.hideSubmenu.bind(this);
		this.boundShowSubmenu = this.#showSubmenu.bind(this);

		// Create ol element
		this.container = document.createElement("ol");
		this.container.classList.add("listmenu");
		if (isSubmenu) this.container.classList.add("listmenu-submenu-position");

		// Populate submenu container with options
		template.forEach((menuItem) => {
			if (menuItem.type === "separator") this.#createSeparator();
			else if (menuItem.type === "submenu") this.#createSubmenu(menuItem);
			else this.#createMenuItem(menuItem);
		});
	}

	#createSeparator() {
		// Create main li element
		const liElement = document.createElement("li");
		liElement.classList.add("listmenu-separator");
		this.container.appendChild(liElement);
	}

	#createMenuItem(menuItem) {
		// Create main li element
		const liElement = document.createElement("li");
		liElement.dataset.commandId = menuItem.commandId;
		liElement.classList.add("listmenu-option");
		liElement.addEventListener("click", (evt) => menu.sendMenuEvent(evt.target.dataset.commandId));
		liElement.addEventListener("mouseenter", this.boundHideSubmenu);

		// Add label
		const labelElement = document.createElement("p");
		labelElement.classList.add("listmenu-option-title");
		labelElement.textContent = menuItem.label;
		liElement.appendChild(labelElement);

		const accelerator = calculateAccelerator(menuItem);

		// Add accelerator (if there is one)
		if (accelerator) {
			const acceleratorElement = document.createElement("p");
			acceleratorElement.classList.add("listmenu-option-shortcut");
			acceleratorElement.textContent = accelerator;
			liElement.appendChild(acceleratorElement);
		}

		this.container.appendChild(liElement);
	}

	#createSubmenu(menuItem) {
		// Create main li element
		const liElement = document.createElement("li");
		liElement.classList.add("listmenu-submenu");
		liElement.dataset.submenuIndex = this.#submenus.length;

		// Add label
		const labelElement = document.createElement("p");
		labelElement.classList.add("listmenu-option-title");
		labelElement.textContent = menuItem.label;
		liElement.appendChild(labelElement);

		// Add chevron
		const chevron = document.createElement("i");
		chevron.classList.add("fa-solid", "fa-chevron-right", "listmenu-submenu-chevron");
		liElement.appendChild(chevron);

		// Create submenu
		this.#submenus.push(new ListMenu(liElement, menuItem.submenu.items, false, true));

		// Link showing to li mouseEnter
		liElement.addEventListener("mouseenter", this.boundShowSubmenu);

		this.container.appendChild(liElement);
	}

	#getCurrentSubmenuIndex() {
		if (!this.#openSubmenuEntry) return null;
		return this.#openSubmenuEntry.dataset.submenuIndex;
	}

	#showSubmenu(evt) {
		const target = evt.target;
		const newSubmenuIndex = target.dataset.submenuIndex;
		const curSubmenuIndex = this.#getCurrentSubmenuIndex();

		// Do nothing if trying to show already open submenu
		if (newSubmenuIndex === curSubmenuIndex) return;

		this.hideSubmenu();
		this.#openSubmenuEntry = target;
		this.#openSubmenuEntry.classList.add("open");
		this.#submenus[newSubmenuIndex].show();
	}

	hideSubmenu() {
		if (this.#openSubmenuEntry) {
			const submenuIndex = this.#openSubmenuEntry.dataset.submenuIndex;

			this.#submenus[submenuIndex].hide();
			this.#openSubmenuEntry.classList.remove("open");

			this.#openSubmenuEntry = null;
		}
	}

	show() {
		this.parentElement.appendChild(this.container);
	}

	hide() {
		this.hideSubmenu();
		this.container.remove();
	}
}

function calculateAccelerator(menuItem) {
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

export default ListMenu;
