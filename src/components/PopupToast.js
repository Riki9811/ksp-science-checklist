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

	static #addMessage(message, parent) {
		const messageElem = document.createElement("p");
		messageElem.textContent = message;
		messageElem.className = "popup-message";
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

	/**
	 * Displays a generic info toast notification.
	 * @param {string} title - The title of the notification.
	 * @param {string} message - The message of the notification.
	 * @param {number} [timeout] - Optional timeout in milliseconds for auto-dismissal.
	 */
	static showInfo(title, message, timeout = null) {
		this.#showToast(ToastType.Info, title, message, timeout);
	}

	/**
	 * Displays a success toast notification.
	 * @param {string} title - The title of the notification.
	 * @param {string} message - The message of the notification.
	 * @param {number} [timeout] - Optional timeout in milliseconds for auto-dismissal.
	 */
	static showSuccess(title, message, timeout = null) {
		this.#showToast(ToastType.Success, title, message, timeout);
	}

	/**
	 * Displays a warning toast notification.
	 * @param {string} title - The title of the notification.
	 * @param {string} message - The message of the notification.
	 * @param {number} [timeout] - Optional timeout in milliseconds for auto-dismissal.
	 */
	static showWarning(title, message, timeout = null) {
		this.#showToast(ToastType.Warning, title, message, timeout);
	}

	/**
	 * Displays an error toast notification.
	 * @param {string} title - The title of the notification.
	 * @param {string} message - The message of the notification.
	 * @param {number} [timeout] - Optional timeout in milliseconds for auto-dismissal.
	 */
	static showError(title, message, timeout = null) {
		this.#showToast(ToastType.Error, title, message, timeout);
	}

	/**
	 * Displays a toast notification.
	 * @param {ToastType} type - The type of the notification.
	 * @param {string} title - The title of the notification.
	 * @param {string} message - The message of the notification.
	 * @param {number} [timeout] - Optional timeout in milliseconds for auto-dismissal.
	 */
	static #showToast(type, title, message, timeout = null) {
		let className;
		switch (type) {
			case ToastType.Info:
				className = "popup-toast-info";
				console.log(`[Info] ${title}: ${message}`);
				break;
			case ToastType.Success:
				className = "popup-toast-success";
				console.log(`[Success] ${title}: ${message}`);
				break;
			case ToastType.Warning:
				className = "popup-toast-warning";
				console.warn(`[Warning] ${title}: ${message}`);
				break;
			case ToastType.Error:
				className = "popup-toast-error";
				console.error(`[Error] ${title}: ${message}`);
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

		this.#addMessage(message, toast);
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
		toast.addEventListener("animationend", () => {
			if (toast.parentElement === this.#container) {
				this.#container.removeChild(toast);
			}
		});
	}
}

export default PopupToast;
