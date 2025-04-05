export default class SfsElement {
	/**
	 * @type {HTMLElement}
	 * @private
	 * @description The DOM element representing this SFS file in the UI.
	 */
	#element;

	/**
	 * @private
	 * @description The SFS file data being represented by this element.
	 */
	#sfsFile;

	/**
	 * @type {Function}
	 * @private
	 * @description The callback function to execute when the element is clicked.
	 */
	#clickCallback;

	/**
	 * Creates an instance of SfsElement.
	 * @param {HTMLElement} folderElement - The parent folder element to which this element will be appended.
	 * @param {Object} sfsFile - An object containing the information about the SFS file.
	 * @param {Function} clickCallback - A function to execute when the element is clicked.
	 */
	constructor(folderElement, sfsFile, clickCallback) {
		this.#sfsFile = sfsFile;
		this.#clickCallback = clickCallback;

		// Create the <li> element
		this.#element = document.createElement("li");
		this.#element.classList.add("save-file");

		// Create the <h3> for the title
		const titleElement = document.createElement("h3");
		titleElement.textContent = sfsFile.name;

		// Create the <p> for science points and experiment count
		const infoElement = document.createElement("p");
		infoElement.textContent = `Science: ${sfsFile.sciencePoints}  |  Experiments: ${sfsFile.experimentCount}`;

		// Create the chevron icon using FontAwesome
		const chevronElement = document.createElement("i");
		chevronElement.classList.add("fa-solid", "fa-chevron-right");

		// Append the created elements to the <li>
		this.#element.appendChild(titleElement);
		this.#element.appendChild(infoElement);
		this.#element.appendChild(chevronElement);

		// Add a click event listener to handle element selection
		this.#element.addEventListener("click", this.#onClick.bind(this));

		// Append the <li> element to the parent folder element
		folderElement.appendChild(this.#element);
	}

	/**
	 * Gets the SFS file data associated with this element.
	 * @returns {SfsFile} The SFS file data.
	 */
	get sfsFile() {
		return this.#sfsFile;
	}

	/**
	 * Toggles the "selected" class on the element.
	 * @param {boolean} selected - Whether the element should be marked as selected.
	 */
	toggleSelect(selected) {
		this.#element.classList.toggle("selected", selected);
	}

	/**
	 * Checks if the UI element is currently selected.
	 * @returns {boolean} True if the element has the "selected" class, false otherwise.
	 */
	isSelected() {
		return this.#element.classList.contains("selected");
	}

	/**
	 * Removes the element from the DOM.
	 */
	remove() {
		this.#element.remove();
	}

	/**
	 * Handles the click event for the element.
	 * Executes the provided callback and triggers the `onSaveSelect` method.
	 */
	#onClick() {
		content.onSaveSelect(this.#sfsFile);
		this.#clickCallback(this.#sfsFile.path);
	}

	/**
	 * Compares this instance with another SfsElement instance to check if their paths are equal.
	 * @param {SfsElement} other - The other SfsElement instance to compare with.
	 * @returns {boolean} True if the paths of the SFS files are equal, false otherwise.
	 */
	equals(other) {
		if (!(other instanceof SfsElement)) {
			return false;
		}
		return this.#sfsFile.path === other.#sfsFile.path;
	}

	/**
	 * Returns a string representation of the SfsElement instance.
	 * Includes the name of the SFS file and the element's current state.
	 * @returns {string} A concise string with the SFS file's name, mode, and element class.
	 */
	toString() {
		const state = this.isSelected() ? "selected" : "not selected";
		return `SfsElement: [File name: ${this.#sfsFile.name}, State: ${state}]`;
	}
}
