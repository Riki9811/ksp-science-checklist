const titleBar = document.getElementById("titlebar");
const minimizeButton = document.getElementById("minimize-button");
const maximizeButton = document.getElementById("maximize-button");
const unmaximizeButton = document.getElementById("unmaximize-window-button");
const closeButton = document.getElementById("close-button");

async function load() {
	const isMacOs = await app.isMacOs();

	if (!isMacOs) {
		setUpWindowsTitlebar();
	} else {
		setUpMacOsTitlebar();
	}
}

async function setUpMacOsTitlebar() {
	// Remove windows ui
	titleBar.innerHTML = "";

	// Create simpler MacOs-specific UI
	const titleText = document.createElement("p");
	titleText.innerText = "KSP Science Checklist";
	titleText.classList.add("titlebar-macos-text");
	titleBar.appendChild(titleText);

	titleBar.classList.add("titlebar-macos");

	// Hide the titlebar on load if window is maximized
	const fullScreen = await app.isFullScreen();
	if (fullScreen) {
		titleBar.classList.add("titlebar-macos-hidden");
	}

	// Function triggered when window is maximized
	function onEnterFullScreen() {
		titleBar.classList.add("titlebar-macos-hidden");
	}

	// Function triggered when window is un-maximized
	function onLeaveFullScreen() {
		titleBar.classList.remove("titlebar-macos-hidden");
	}

	// Link functions
	app.onEnterFullScreen(onEnterFullScreen);
	app.onLeaveFullScreen(onLeaveFullScreen);
}

async function setUpWindowsTitlebar() {
	// Add listeners for each button click
	if (minimizeButton) minimizeButton.addEventListener("click", app.minimize);
	if (maximizeButton) maximizeButton.addEventListener("click", app.maximize);
	if (unmaximizeButton) unmaximizeButton.addEventListener("click", app.unmaximize);
	if (closeButton) closeButton.addEventListener("click", app.close);

	// Show the correct button between maximize and unmaximize
	const maximized = await app.isMaximized();
	if (maximized) {
		maximizeButton.style.display = "none";
	} else {
		unmaximizeButton.style.display = "none";
	}

	// Function triggered when window is maximized
	function onMaximize() {
		maximizeButton.style.display = "none";
		unmaximizeButton.style.display = "block";
	}

	// Function triggered when window is un-maximized
	function onUnmaximize() {
		maximizeButton.style.display = "block";
		unmaximizeButton.style.display = "none";
	}

	// Link functions
	app.onMaximize(onMaximize);
	app.onUnmaximize(onUnmaximize);
}

load();
