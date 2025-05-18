import TablistButton from "./TablistButton.js";

export default class WindowsTitlebar {
	#parent;
	#leftContainer;

	constructor(parent, template) {
		this.#parent = parent;

		// Create left container
		this.#leftContainer = document.createElement("div");
		this.#leftContainer.classList.add("titlebar-left");
		this.#constructTabMenu(this.#leftContainer, template);
		parent.appendChild(this.#leftContainer);

		// Listen to fullscreen events
		app.onEnterFullScreen(() => this.#onEnterFullScreen());
		app.onLeaveFullScreen(() => this.#onLeaveFullScreen());
	}

	#constructTabMenu(parent, template) {
		const menuImage = document.createElement("img");
		menuImage.src = "../assets/icon.png";
		menuImage.alt = "Icon";
		parent.appendChild(menuImage);

		template.items.forEach((menuItem) => {
			new TablistButton(parent, menuItem.label, menuItem.submenu.items);
		});
	}

	#onEnterFullScreen() {
		this.#parent.classList.add("titlebar-hidden");
	}

	#onLeaveFullScreen() {
		this.#parent.classList.remove("titlebar-hidden");
	}
}
