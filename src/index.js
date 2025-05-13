import { app, BrowserWindow, Menu } from "electron";
import { registerApiHandlers } from "./api.js";
import { registerContentHandlers } from "./content.js";
import { registerThemeHandlers } from "./theme.js";
import { registerWindowHandlers } from "./window.js";
import startup from "electron-squirrel-startup";
import MenuTemplate from "./menu.js";
import { join } from "node:path";
import "dotenv/config";

/** @type {BrowserWindow} */
var appWindow = null;

const menu = Menu.buildFromTemplate(MenuTemplate.default);
Menu.setApplicationMenu(menu);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (startup) {
	app.quit();
}

function createWindow() {
	// Create the browser window.
	const newWindow = new BrowserWindow({
		title: "KSP Science Checklist",
		icon: join(app.getAppPath(), "assets", "icon.png"),
		width: 1280,
		height: 720,
		minWidth: 700,
		minHeight: 500,
		// titleBarStyle: "hidden",
		trafficLightPosition: { x: 13, y: 13 },
		webPreferences: {
			nodeIntegration: false, // Improves security
			contextIsolation: true,
			devTools: process.env.NODE_ENV === "development",
			preload: join(app.getAppPath(), "src", "preload.js")
		}
	});

	// Hide the menu
	// newWindow.setMenuBarVisibility(false);

	// Load the index.html of the app.
	newWindow.loadFile(join(app.getAppPath(), "src", "index.html"));

	return newWindow;
}

// Request single instance for this window
let isSingleInstance = app.requestSingleInstanceLock();
// If the request failed there already is another window open
if (!isSingleInstance) {
	// So quit this one
	app.quit();
} else {
	// Called when a second instance is executed
	app.on("second-instance", () => {
		// Someone tried to run a second instance, we should focus our window.
		if (appWindow) {
			if (appWindow.isMinimized()) appWindow.restore();
			appWindow.focus();
		}
	});

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.whenReady().then(() => {
		appWindow = createWindow();

		// Register all handlers
		registerApiHandlers(appWindow);
		registerContentHandlers(appWindow);
		registerWindowHandlers(appWindow, true);
		registerThemeHandlers();

		// Customize the About panel
		app.setAboutPanelOptions({
			applicationName: app.getName(),
			applicationVersion: app.getVersion(),
			copyright: "Distributed under MIT License",
			version: "alpha",
			credits: "Developed by Riccardo Mariotti\nInspired by the KSP community.",
			authors: "Riccardo Mariotti",
			website: "https://github.com/Riki9811/ksp-science-checklist",
			iconPath: join(app.getAppPath(), "assets", "icon.png")
		});

		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				appWindow = createWindow();

				// Re-register window handlers except golobal ones
				registerWindowHandlers(appWindow, false);
			}
		});
	});
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
