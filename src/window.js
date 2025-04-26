import { app, ipcMain } from "electron";
import openAboutWindow from "about-window";
import { join } from "node:path";

export function registerWindowHandlers(window) {
	// Add listeners to window events
	window.on("maximize", () => window.webContents.send("window/onMaximize"));
	window.on("unmaximize", () => window.webContents.send("window/onUnmaximize"));
	window.on("enter-full-screen", () => window.webContents.send("window/onEnterFullScreen"));
	window.on("leave-full-screen", () => window.webContents.send("window/onLeaveFullScreen"));

	// App window handlers
	ipcMain.on("window/minimize", () => window.minimize());
	ipcMain.on("window/maximize", () => window.maximize());
	ipcMain.on("window/unmaximize", () => window.unmaximize());
	ipcMain.on("window/close", () => window.close());
	ipcMain.handle("window/isMaximized", () => window.isMaximized());
	ipcMain.handle("window/isFullScreen", () => window.isFullScreen());

	// OS-specific handlers
	ipcMain.handle("isMacOs", () => process.platform === "darwin");
	ipcMain.handle("isLinux", () => process.platform === "linux");

	// About panel
	ipcMain.on("showAboutPanel", () => {
		const options = {
			icon_path: join(app.getAppPath(), "assets", "icon.png"),
			css_path: join(app.getAppPath(), "src", "styles", "about.css")
		};
		openAboutWindow.default(options);
	});
}
