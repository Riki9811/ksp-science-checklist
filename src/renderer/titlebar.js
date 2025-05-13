import WindowsTitlebar from "../components/WindowsTitlebar.js";
import MacOsTitlebar from "../components/MacOsTitlebar.js";

const titleBarRoot = document.getElementById("titlebar");

async function load() {
	const isMacOs = await app.isMacOs();

	if (!isMacOs) {
		const menuTemplate = await api.getWindowsMenu();

		new WindowsTitlebar(titleBarRoot, menuTemplate);
	} else {
		new MacOsTitlebar(titleBarRoot);
	}
}

load();
