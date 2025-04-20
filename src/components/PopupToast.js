const ToastType = {
	Info: 0,
	Success: 1,
	Warning: 2,
	Error: 3
};

class PopupToast {
	static containerId = "popup-toast-container";
	static #container;

	static #createContainer() {
		this.#container = document.createElement("div");
		this.#container.id = this.containerId;
		document.body.appendChild(this.#container);
	}

	static #addIcon(type, parent) {
		let className;
		switch (type) {
			case ToastType.Info:
				className = "fa-circle-info";
				break;
			case ToastType.Success:
				className = "fa-circle-check";
				break;
			case ToastType.Warning:
				className = "fa-triangle-exclamation";
				break;
			case ToastType.Error:
				className = "fa-circle-exclamation";
				break;
		}
		const icon = document.createElement("i");
		icon.classList.add("fa-solid", className);
		parent.appendChild(icon);
	}

	static #addTitle(title, parent) {
		const titleElem = document.createElement("strong");
		titleElem.textContent = title;
		titleElem.className = "popup-title";
		parent.appendChild(titleElem);
	}

	static #addMessage(lines, parent) {
		if (lines.length === 0) return;

		const messageElem = document.createElement("p");
		messageElem.className = "popup-message";

		lines.forEach((line) => {
			let lineElem;

			if (line.bold && line.italic) {
				lineElem = document.createElement("b");
				const italicElem = document.createElement("i");
				italicElem.textContent = line.text;
				lineElem.appendChild(italicElem);
			} else if (line.bold) {
				lineElem = document.createElement("b");
				lineElem.textContent = line.text;
			} else if (line.italic) {
				lineElem = document.createElement("i");
				lineElem.textContent = line.text;
			} else {
				lineElem = document.createElement("span");
				lineElem.textContent = line.text;
			}

			if (line.indented) lineElem.classList.add("popup-message-indent");
			if (line.secondary) lineElem.classList.add("popup-message-secondary");

			messageElem.appendChild(lineElem);
			if (!line.inLine) messageElem.appendChild(document.createElement("br"));
		});

		parent.appendChild(messageElem);
	}

	static #addCloseButton(parent) {
		const closeButton = document.createElement("button");
		closeButton.className = "popup-close-button";
		closeButton.onclick = () => this.#dismissToast(parent);
		const xIcon = document.createElement("i");
		xIcon.classList.add("fa-solid", "fa-xmark");
		closeButton.appendChild(xIcon);
		parent.appendChild(closeButton);
	}

	static #addProgressBar(timeout, parent) {
		const progressBar = document.createElement("div");
		progressBar.className = "popup-progress-bar";
		parent.appendChild(progressBar);

		// Animate progress-bar if timeout is specified
		if (timeout) {
			// Set progress bar animation duration
			progressBar.style.animationDuration = `${timeout}ms`;

			// Auto dismiss when progress bar animation ends
			progressBar.addEventListener("animationend", (evt) => {
				const isRightAnimation = evt.animationName === "shrink-progress-bar";
				const isParentContainer = parent.parentElement === this.#container;

				if (isRightAnimation && isParentContainer) {
					this.#dismissToast(parent);
				}
			});

			// Pause/resume animation on mouse enter/leave
			parent.addEventListener("mouseenter", () => (progressBar.style.animationPlayState = "paused"));
			parent.addEventListener("mouseleave", () => (progressBar.style.animationPlayState = "running"));
		} else {
			// Make progress-bar full if no timeout is specified
			progressBar.classList.add("popup-progress-full");
		}
	}

	static showInfo(title, lines = [], timeout = 10000) {
		if (typeof lines === "string" || lines instanceof String) lines = [{ text: lines }];
		this.#showToast(ToastType.Info, title, lines, timeout);
	}

	static showSuccess(title, lines = [], timeout = 10000) {
		if (typeof lines === "string" || lines instanceof String) lines = [{ text: lines }];
		this.#showToast(ToastType.Success, title, lines, timeout);
	}

	static showWarning(title, lines = [], timeout = 10000) {
		if (typeof lines === "string" || lines instanceof String) lines = [{ text: lines }];
		this.#showToast(ToastType.Warning, title, lines, timeout);
	}

	static showError(title, lines = [], timeout = 10000) {
		if (typeof lines === "string" || lines instanceof String) lines = [{ text: lines }];
		this.#showToast(ToastType.Error, title, lines, timeout);
	}

	static #showToast(type, title, lines, timeout) {
		let className;
		switch (type) {
			case ToastType.Info:
				className = "popup-toast-info";
				break;
			case ToastType.Success:
				className = "popup-toast-success";
				break;
			case ToastType.Warning:
				className = "popup-toast-warning";
				break;
			case ToastType.Error:
				className = "popup-toast-error";
				break;
		}

		// Ensure the container exists
		if (!this.#container) {
			this.#createContainer();
		}

		// Create the error toast
		const toast = document.createElement("div");
		toast.classList.add("popup-toast", className);

		// Create first row
		const firstRow = document.createElement("div");
		firstRow.classList.add("flex-row");
		this.#addIcon(type, firstRow);
		this.#addTitle(title, firstRow);
		toast.appendChild(firstRow);

		this.#addMessage(lines, toast);
		this.#addCloseButton(toast);
		this.#addProgressBar(timeout, toast);

		// Append the toast to the container
		this.#container.appendChild(toast);
	}

	/**
	 * Dismisses a toast with a fade-out animation.
	 * @param {HTMLElement} toast - The toast element to dismiss.
	 */
	static #dismissToast(toast) {
		toast.classList.add("popup-out");
		toast.addEventListener("animationend", (evt) => {
			const isRightAnimation = evt.animationName === "popup-out";
			const isParentContainer = toast.parentElement === this.#container;
			if (isRightAnimation && isParentContainer) {
				this.#container.removeChild(toast);
			}
		});
	}
}

export default PopupToast;
