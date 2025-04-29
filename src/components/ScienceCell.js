export default class ScienceCell {
	#container;
	#id;
	#collected;
	#total;

	constructor(container, id, collected, total) {
		this.#container = container;
		this.#id = id;
		this.#collected = collected.toFixed(1);
		this.#total = total.toFixed(1);

		this.#container.classList.add("science-cell");
		this.#updateUI();
	}

	/**
	 * Updates the UI element based on the collected and total science points.
	 */
	#updateUI() {
		// Calculate the percentage of science collected
		const percentage = this.#total > 0 ? this.#collected / this.#total : 0;

		// Set the percentage as a CSS variable
		this.#container.style.setProperty("--percent", Math.round(percentage * 100));

		// Toggle full-cell class depending on total = collected
		this.#container.classList.toggle("science-cell-full", this.#total === this.#collected);
		// Toggle empty-cell class depending on collected = 0
		this.#container.classList.toggle("science-cell-empty", this.#collected === 0);

		// Clear existing content
		this.#container.innerHTML = "";

		// Add it to data
		this.#container.dataset.id = this.#id;

		// Add two <p> tags for collected and total points
		const collectedP = document.createElement("p");
		collectedP.textContent = `${this.#collected}`;
		this.#container.appendChild(collectedP);

		const totalP = document.createElement("p");
		totalP.textContent = `/${this.#total}`;
		this.#container.appendChild(totalP);
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
