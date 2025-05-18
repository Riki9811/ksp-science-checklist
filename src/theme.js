import { ipcMain, nativeTheme } from "electron";

export function registerThemeHandlers(window) {
	// Theme handlers
	ipcMain.handle("dark-mode:toggle", () => {
		nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? "light" : "dark";
		return nativeTheme.shouldUseDarkColors;
	});

	ipcMain.on("dark-mode:setTitleBarOverlay", (_, options) => {
		window.setTitleBarOverlay(options);
	});

	ipcMain.handle("dark-mode:reset", () => (nativeTheme.themeSource = "system"));

	ipcMain.handle("dark-mode:is-dark", () => nativeTheme.shouldUseDarkColors);
}
