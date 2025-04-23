import WindowsTitlebar from "../components/WindowsTitlebar.js";
import MacOsTitlebar from "../components/MacOsTitlebar.js";

const titleBarRoot = document.getElementById("titlebar");

async function load() {
	let titleBar;
	const isMacOs = await app.isMacOs();

	if (!isMacOs) {
		titleBar = new WindowsTitlebar(titleBarRoot);
	} else {
		titleBar = new MacOsTitlebar(titleBarRoot);
	}
}

load();
