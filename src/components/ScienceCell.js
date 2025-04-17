export default class ScienceCell {
	/**
	 * @type {HTMLElement}
	 * @private
	 * @description The DOM element representing this science cell in the UI.
	 */
	#element;

	/**
	 * @type {string}
	 * @private
	 * @description The id of the science experiment.
	 */
	#id;

	/**
	 * @type {number}
	 * @private
	 * @description The amount of science points collected.
	 */
	#collected;

	/**
	 * @type {number}
	 * @private
	 * @description The total amount of science points available.
	 */
	#total;

	/**
	 * Creates an instance of ScienceCell.
	 * @param {number} collected - The amount of science points collected.
	 * @param {number} total - The total amount of science points available.
	 */
	constructor(id, collected, total) {
		this.#id = id;
		this.#collected = collected.toFixed(1);
		this.#total = total.toFixed(1);

		this.#element = document.createElement("div");
		this.#element.classList.add("science-cell");
		this.#element.dataset.experiment = id;
		this.#updateUI();
	}

	/**
	 * Updates the UI element based on the collected and total science points.
	 */
	#updateUI() {
		// Calculate the percentage of science collected
		const percentage = this.#total > 0 ? this.#collected / this.#total : 0;

		// Set the percentage as a CSS variable
		this.#element.style.setProperty("--percent", Math.round(percentage * 100));

		// Toggle full-cell class depending on total = collected
		this.#element.classList.toggle("science-cell-full", this.#total === this.#collected);
		// Toggle empty-cell class depending on collected = 0
		this.#element.classList.toggle("science-cell-empty", this.#collected === 0);

		// Clear existing content
		this.#element.innerHTML = "";

		// Add it to data
		this.#element.dataset.id = this.#id;

		// Add two <p> tags for collected and total points
		const collectedP = document.createElement("p");
		collectedP.textContent = `${this.#collected}`;
		this.#element.appendChild(collectedP);

		const totalP = document.createElement("p");
		totalP.textContent = `/${this.#total}`;
		this.#element.appendChild(totalP);
	}

	/**
	 * Gets the main UI element for this cell.
	 * @returns {HTMLElement} The DOM element representing this cell.
	 */
	get element() {
		return this.#element;
	}

	/**
	 * Updates the science points and refreshes the UI.
	 * @param {number} collected - The new amount of science points collected.
	 * @param {number} total - The new total amount of science points available.
	 */
	update(collected, total) {
		this.#collected = collected;
		this.#total = total;
		this.#updateUI();
	}
}
