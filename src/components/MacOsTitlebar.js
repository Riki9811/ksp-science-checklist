export default class MacOsTitlebar {
	#parent;

	constructor(parent) {
		this.#parent = parent;

		// Create text UI
		const titleText = document.createElement("p");
		titleText.innerText = "KSP Science Checklist";
		titleText.classList.add("titlebar-macos-text");
		this.#parent.appendChild(titleText);

		// Add macos specific styling
		this.#parent.classList.add("titlebar-macos");

		// Hide the titlebar on load if window is maximized
		app.isFullScreen().then((fullScreen) => {
			if (fullScreen) {
				titleBarRoot.classList.add("titlebar-macos-hidden");
			}
		});

		app.onEnterFullScreen(() => this.#onEnterFullScreen());
		app.onLeaveFullScreen(() => this.#onLeaveFullScreen());
	}

	#onEnterFullScreen() {
		this.#parent.classList.add("titlebar-macos-hidden");
	}

	#onLeaveFullScreen() {
		this.#parent.classList.remove("titlebar-macos-hidden");
	}
}
