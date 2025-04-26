import { ipcMain, nativeTheme } from "electron";

export function registerThemeHandlers() {
	// Theme handlers
	ipcMain.handle("dark-mode:toggle", () => {
		nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? "light" : "dark";
		return nativeTheme.shouldUseDarkColors;
	});

	ipcMain.handle("dark-mode:reset", () => (nativeTheme.themeSource = "system"));

	ipcMain.handle("dark-mode:is-dark", () => nativeTheme.shouldUseDarkColors);
}
