import WindowsTitlebar from "../components/WindowsTitlebar.js";

const titleBarRoot = document.getElementById("titlebar");

async function load() {
	let titleBar;
	const isMacOs = await app.isMacOs();

	if (!isMacOs) {
		titleBar = new WindowsTitlebar(titleBarRoot);
	} else {
		setUpMacOsTitlebar();
	}
}

async function setUpMacOsTitlebar() {
	// Remove windows ui
	titleBarRoot.innerHTML = "";

	// // Create simpler MacOs-specific UI
	// const titleText = document.createElement("p");
	// titleText.innerText = "KSP Science Checklist";
	// titleText.classList.add("titlebar-macos-text");
	// titleBarRoot.appendChild(titleText);

	// titleBarRoot.classList.add("titlebar-macos");

	// // Hide the titlebar on load if window is maximized
	// const fullScreen = await app.isFullScreen();
	// if (fullScreen) {
	// 	titleBarRoot.classList.add("titlebar-macos-hidden");
	// }

	// // Function triggered when window is maximized
	// function onEnterFullScreen() {
	// 	titleBarRoot.classList.add("titlebar-macos-hidden");
	// }

	// // Function triggered when window is un-maximized
	// function onLeaveFullScreen() {
	// 	titleBarRoot.classList.remove("titlebar-macos-hidden");
	// }

	// Link functions
	// app.onEnterFullScreen(onEnterFullScreen);
	// app.onLeaveFullScreen(onLeaveFullScreen);
}

load();
