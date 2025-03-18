const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const fs = require("fs");

const KSP_INSTALL_DIR = "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		icon: path.join(app.getAppPath(), "assets", "icon.png"),
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: false, // Improves security
			contextIsolation: true,
			preload: path.join(app.getAppPath(), "src", "preload.js")
		}
	});

	// hide the menu
	mainWindow.setMenuBarVisibility(false);
	// and load the index.html of the app.
	mainWindow.loadFile(path.join(app.getAppPath(), "src", "index.html"));

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

// // Read save files from the KSP install directory
ipcMain.handle("get-save-files", async () => {
	try {
		const saves = fs
			.readdirSync(KSP_INSTALL_DIR)
			.map((folder) => path.join(KSP_INSTALL_DIR, folder))
			.filter((folder) => fs.statSync(folder).isDirectory());

		const saveFiles = saves.flatMap((folder) =>
			fs
				.readdirSync(folder)
				.filter((file) => file.endsWith(".sfs"))
				.map((file) => path.join(folder, file))
		);

		return saveFiles;
	} catch (error) {
		console.error("Error reading save files:", error);
		return [];
	}
});
