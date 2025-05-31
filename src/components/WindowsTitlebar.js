import TablistButton from "./TablistButton.js";

export default class WindowsTitlebar {
	#parent;
	#leftContainer;

	constructor(parent, template) {
		this.#parent = parent;

		// Create left container
		this.#leftContainer = document.createElement("ol");
		this.#leftContainer.classList.add("titlebar-list");
		this.#constructTabMenu(this.#leftContainer, template);
		parent.appendChild(this.#leftContainer);

		// Listen to fullscreen events
		app.onEnterFullScreen(() => this.#onEnterFullScreen());
		app.onLeaveFullScreen(() => this.#onLeaveFullScreen());
	}

	#constructTabMenu(parent, template) {
		const liMenuImage = document.createElement("li");
		liMenuImage.classList.add("titlebar-appImage-container");

		const menuImage = document.createElement("img");
		menuImage.classList.add("titlebar-appImage");
		menuImage.src = "../assets/icon.png";

		liMenuImage.appendChild(menuImage);
		parent.appendChild(liMenuImage);

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
