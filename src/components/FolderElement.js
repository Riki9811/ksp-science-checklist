import SfsElement from "./SfsElement.js";

export default class FolderElement {
	#mainElement; //HTMLElement - the main element containing all UI
	#infoElement; //HTMLElement - the UI element containing the info (mode + version)
	#olElement;

	#name; //string - The name of the save file.
	#path; //string - The full path to the save folder.
	#mode; //string - The game mode ("CAREER", "SANDBOX_SCIENCE", or "SANDBOX").
	#version; //string - The version of the game.
	#sfsElements = []; //SfsElement[] - An array of SFS file elements.

	#isExplored = false;
	#saveSelectCallback = false;

	/**
	 * Creates an instance of FolderElement, starting from just the name and path of the folder.
	 * @param {string} name - The name of the folder.
	 * @param {string} path - The full path to the folder.
	 * @param {function} saveSelectCallback - Callback to trigger when a child save file is selected.
	 */
	constructor(name, path, saveSelectCallback) {
		this.#name = name;
		this.#path = path;
		this.#saveSelectCallback = saveSelectCallback;

		this.#createMainElement(true); // start as closed
		this.#createTitle();

		// Create the <ol> list for SFS files
		this.#olElement = document.createElement("ol");
		this.#olElement.classList.add("save-file-list");
		this.#mainElement.appendChild(this.#olElement);
	}

	#createMainElement(closed) {
		// Create the <li> element
		this.#mainElement = document.createElement("li");
		this.#mainElement.classList.add("save-folder");
		if (closed) this.#mainElement.classList.add("closed");
	}

	#createTitle() {
		// Create the folder title div
		const title = document.createElement("div");
		title.classList.add("save-folder-title");

		// Create the chevron icon from fontawesome
		const chevron = document.createElement("i");
		chevron.classList.add("fa-solid", "fa-chevron-down");

		// Create the <h2> for the folder name
		const name = document.createElement("h2");
		name.textContent = this.#name;

		// Create the <p> for type and version info
		this.#infoElement = document.createElement("p");

		// Append to titleElement
		title.appendChild(chevron);
		title.appendChild(name);
		title.appendChild(this.#infoElement);

		// Add click listener
		title.addEventListener("click", this.#onTitleClick.bind(this));

		// Append titleDiv to main element
		this.#mainElement.appendChild(title);
	}

	#createModeIcon() {
		let iconClass;
		switch (this.#mode) {
			case "SCIENCE_SANDBOX":
				iconClass = "fa-flask";
				break;
			case "SANDBOX":
				iconClass = "fa-rocket";
				break;
			case "CAREER":
				iconClass = "fa-chart-line";
				break;
		}
		const icon = document.createElement("i");
		icon.classList.add("fa-solid", iconClass);
		return icon;
	}

	async #refreshData() {
		// Remove old data if there is
		this.#sfsElements.forEach((element) => element.remove());
		this.#sfsElements.length = 0;

		// Get new data
		const folderData = await api.exploreFolder(this.#path);
		this.#mode = folderData.mode;
		this.#version = folderData.version;

		// Update UI
		const icon = this.#createModeIcon();
		this.#infoElement.innerHTML = "";
		this.#infoElement.appendChild(icon);
		this.#infoElement.innerHTML += ` - v${this.#version}`;

		folderData.sfsFiles.forEach((sfsFile) => {
			const sfsElement = new SfsElement(this.#olElement, sfsFile, this.#onSfsElementClick.bind(this));
			this.#sfsElements.push(sfsElement);
		});
	}

	get path() {
		return this.#path;
	}

	get mainElement() {
		return this.#mainElement;
	}

	toggleClosed(closed) {
		this.#mainElement.classList.toggle("closed", closed);
	}

	toggleClosed() {
		this.#mainElement.classList.toggle("closed");
	}

	#onSfsElementClick(path) {
		this.#sfsElements.forEach((element) => {
			if (element.sfsFile.path !== path) element.toggleSelect(false);
			else element.toggleSelect(true);
		});
		this.#saveSelectCallback(this.#path);
	}

	deselectAll() {
		this.#sfsElements.forEach((element) => element.toggleSelect(false));
	}

	/**
	 * Removes the element from the DOM.
	 */
	remove() {
		this.#mainElement.remove();
	}

	/**
	 * Handles click event on the title.
	 */
	#onTitleClick() {
		if (!this.#isExplored) {
			this.#refreshData();
			this.#isExplored = true;
		}
		this.toggleClosed();
	}
}
