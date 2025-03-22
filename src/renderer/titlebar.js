const minimizeButton = document.getElementById("minimize-button");
const maximizeButton = document.getElementById("maximize-button");
const unmaximizeButton = document.getElementById("unmaximize-window-button");
const closeButton = document.getElementById("close-button");

// Add listeners for each button click
if (minimizeButton) minimizeButton.addEventListener("click", app.minimize);
if (maximizeButton) maximizeButton.addEventListener("click", app.maximize);
if (unmaximizeButton) unmaximizeButton.addEventListener("click", app.unmaximize);
if (closeButton) closeButton.addEventListener("click", app.close);

// Show the correct button between maximize and unmaximize on window load
(async () => {
	const maximized = await app.isMaximized();
	if (maximized) {
        setMaximizeVisible(false);
	} else {
        setUnmaximizeVisible(false);
	}
})();

function setMaximizeVisible(visible = true) {
	if (maximizeButton) maximizeButton.style.display = visible ? "block" : "none";
}
function setUnmaximizeVisible(visible = true) {
	if (unmaximizeButton) unmaximizeButton.style.display = visible ? "block" : "none";
}

function onMaximize() {
	setMaximizeVisible(false);
	setUnmaximizeVisible(true);
}

function onUnmaximize() {
	setMaximizeVisible(true);
	setUnmaximizeVisible(false);
}

app.onMaximize(onMaximize);
app.onUnmaximize(onUnmaximize);
