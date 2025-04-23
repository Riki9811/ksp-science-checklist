export default class WindowsTitlebar {
	#parent;
	#leftContainer;
	#rightContainer;

	#minimizeButton;
	#maximizeButton;
	#unmaximizeButton;
	#closeButton;

	constructor(parent) {
		this.#parent = parent;

		// Create left container
		this.#leftContainer = document.createElement("div");
		this.#leftContainer.classList.add("titlebar-left");
		this.#constructTabMenu(this.#leftContainer);
		parent.appendChild(this.#leftContainer);

		// Create right container
		this.#rightContainer = document.createElement("div");
		this.#rightContainer.classList.add("titlebar-right");
		this.#constructWindowButtons(this.#rightContainer);
		parent.appendChild(this.#rightContainer);

		// Listen to maximize events
		app.onMaximize(() => this.#onMaximize());
		app.onUnmaximize(() => this.#onUnmaximize());

		// Listen to fullscreen events
		app.onEnterFullScreen(() => this.#onEnterFullScreen());
		app.onLeaveFullScreen(() => this.#onLeaveFullScreen());
	}

	#constructTabMenu(parent) {
		const menuImage = document.createElement("img");
		menuImage.src = "../assets/icon.png";
		menuImage.alt = "Icon";
		parent.appendChild(menuImage);

		const fileBtn = document.createElement("button");
		fileBtn.id = "load-button";
		fileBtn.innerText = "File";
		fileBtn.type = "button";
		parent.appendChild(fileBtn);

		const settingsBtn = document.createElement("button");
		settingsBtn.id = "settings-button";
		settingsBtn.innerText = "Settings";
		settingsBtn.type = "button";
		parent.appendChild(settingsBtn);

		const importBtn = document.createElement("button");
		importBtn.id = "import-button";
		importBtn.innerText = "Import";
		importBtn.type = "button";
		parent.appendChild(importBtn);

		const themesBtn = document.createElement("button");
		themesBtn.id = "window-button";
		themesBtn.innerText = "Themes";
		themesBtn.type = "button";
		parent.appendChild(themesBtn);

		const helpBtn = document.createElement("button");
		helpBtn.id = "help-button";
		helpBtn.innerText = "Help";
		helpBtn.type = "button";
		parent.appendChild(helpBtn);
	}

	#constructWindowButtons(parent) {
		this.#minimizeButton = this.#windowButton("minimize-button", ["fa-solid", "fa-minus"], app.minimize);
		parent.appendChild(this.#minimizeButton);
		this.#maximizeButton = this.#windowButton("maximize-button", ["fa-regular", "fa-square"], app.maximize);
		parent.appendChild(this.#maximizeButton);
		this.#unmaximizeButton = this.#windowButton("unmaximize-window-button", ["fa-regular", "fa-window-restore"], app.unmaximize);
		parent.appendChild(this.#unmaximizeButton);
		this.#closeButton = this.#windowButton("close-button", ["fa-solid", "fa-xmark"], app.close);
		parent.appendChild(this.#closeButton);

		// Show the correct button between maximize and unmaximize
		app.isMaximized().then((maximized) => {
			if (maximized) {
				this.#maximizeButton.style.display = "none";
			} else {
				this.#unmaximizeButton.style.display = "none";
			}
		});
	}

	#windowButton(id, iconClassList, clickCallback) {
		// Create button
		const windowBtn = document.createElement("button");
		windowBtn.type = "button";
		windowBtn.id = id;
		// Create icon element and style it
		const closeButtonIcon = document.createElement("i");
		closeButtonIcon.classList.add(...iconClassList);

		// Add icon to button
		windowBtn.appendChild(closeButtonIcon);

		// Add click event listener
		windowBtn.addEventListener("click", clickCallback);

		return windowBtn;
	}

	#onMaximize() {
		this.#maximizeButton.style.display = "none";
		this.#unmaximizeButton.style.display = "block";
	}

	#onUnmaximize() {
		this.#maximizeButton.style.display = "block";
		this.#unmaximizeButton.style.display = "none";
	}

	#onEnterFullScreen() {
		this.#parent.classList.add("titlebar-hidden");
	}

	#onLeaveFullScreen() {
		this.#parent.classList.remove("titlebar-hidden");
	}
}
