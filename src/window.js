import { app, ipcMain } from "electron";
import openAboutWindow from "about-window";
import { join } from "node:path";

export function registerWindowHandlers(window, registerGlobalHandlers) {
	// Add listeners to window events
	window.on("maximize", () => window.webContents.send("window/onMaximize"));
	window.on("unmaximize", () => window.webContents.send("window/onUnmaximize"));
	window.on("enter-full-screen", () => window.webContents.send("window/onEnterFullScreen"));
	window.on("leave-full-screen", () => window.webContents.send("window/onLeaveFullScreen"));
	window.on("resize", () => window.webContents.send("window/onWindowResize"));

	// App window handlers
	ipcMain.on("window/minimize", () => {
		if (!window.isDestroyed()) window.minimize();
	});
	ipcMain.on("window/maximize", () => {
		if (!window.isDestroyed()) window.maximize();
	});
	ipcMain.on("window/unmaximize", () => {
		if (!window.isDestroyed()) window.unmaximize();
	});
	ipcMain.on("window/close", () => {
		if (!window.isDestroyed()) window.close();
	});
	ipcMain.handle("window/isMaximized", () => {
		if (!window.isDestroyed()) return window.isMaximized();
		return false;
	});
	ipcMain.handle("window/isFullScreen", () => {
		if (!window.isDestroyed()) return window.isFullScreen();
		return false;
	});

	if (registerGlobalHandlers) {
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

	// Remove listeners when the window is closed
	window.on("closed", () => {
		ipcMain.removeAllListeners("window/minimize");
		ipcMain.removeAllListeners("window/maximize");
		ipcMain.removeAllListeners("window/unmaximize");
		ipcMain.removeAllListeners("window/close");
		ipcMain.removeHandler("window/isMaximized");
		ipcMain.removeHandler("window/isFullScreen");

		// Remove listeners to window events
		window.removeAllListeners("maximize");
		window.removeAllListeners("unmaximize");
		window.removeAllListeners("enter-full-screen");
		window.removeAllListeners("leave-full-screen");
		window.removeAllListeners("resize");
	});
}
