import startup from "electron-squirrel-startup";
import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import { readdirSync, statSync } from "fs";
import { parseSFS } from "./sfsParser.js";
import { join } from "node:path";

// const KSP_INSTALL_DIR = "/Users/riccardomariotti/Documenti/Riccardo/KSP/saves";
const KSP_INSTALL_DIR = "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (startup) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: join(app.getAppPath(), "assets", "icon.png"),
		width: 1920,
		height: 1080,
		titleBarStyle: "hidden",
		webPreferences: {
			nodeIntegration: false, // Improves security
			contextIsolation: true,
			preload: join(app.getAppPath(), "src", "preload.js")
		}
	});

	// hide the menu
	mainWindow.setMenuBarVisibility(false);
	// and load the index.html of the app.
	mainWindow.loadFile(join(app.getAppPath(), "src", "index.html"));

	// Open the DevTools.
	mainWindow.webContents.on("did-finish-load", () => {
		mainWindow.webContents.openDevTools();
	});
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// Read save files from the KSP install directory
ipcMain.handle("get-saves", async () => {
	try {
		let saves = {};

		// Read save folders
		const folders = readdirSync(KSP_INSTALL_DIR)
			.filter((folder) => !["training", "scenarios", "missions"].includes(folder.toLowerCase()))
			.filter((folder) => statSync(join(KSP_INSTALL_DIR, folder)).isDirectory());

		// Process each save folder
		for (const folder of folders) {
			const folderPath = join(KSP_INSTALL_DIR, folder);
			const sfsFiles = readdirSync(folderPath).filter((file) => file.endsWith(".sfs"));

			// Create an object where each file name maps to its full path
			saves[folder] = Object.fromEntries(sfsFiles.map((file) => [file, join(folderPath, file)]));
		}

		return saves;
	} catch (error) {
		console.error("Error reading save files:", error);
		return {};
	}
});

//#region Theme
ipcMain.handle("dark-mode:toggle", () => {
	if (nativeTheme.shouldUseDarkColors) {
		nativeTheme.themeSource = "light";
	} else {
		nativeTheme.themeSource = "dark";
	}
	return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:reset", () => {
	nativeTheme.themeSource = "system";
});

ipcMain.handle("dark-mode:is-dark", () => {
	return nativeTheme.shouldUseDarkColors;
});
//#endregion
