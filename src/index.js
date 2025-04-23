import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import startup from "electron-squirrel-startup";
import { basename, join } from "node:path";
import utils from "./utils/index.js";

/** @type {BrowserWindow} */
var appWindow = null;

// const KSP_INSTALL_DIR = "/Users/riccardomariotti/Documenti/Riccardo/KSP";
const KSP_INSTALL_DIR = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Kerbal Space Program";

//#region Window
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (startup) {
	app.quit();
}

function createWindow() {
	// Create the browser window.
	const newWindow = new BrowserWindow({
		icon: join(app.getAppPath(), "assets", "icon.png"),
		width: 1920,
		height: 1080,
		minWidth: 700,
		minHeight: 500,
		titleBarStyle: "hidden",
		trafficLightPosition: { x: 13, y: 13 },
		webPreferences: {
			nodeIntegration: false, // Improves security
			contextIsolation: true,
			preload: join(app.getAppPath(), "src", "preload.js")
		}
	});

	// Hide the menu
	newWindow.setMenuBarVisibility(false);

	// and load the index.html of the app.
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
		updateBackgroundColor();

		appWindow.on("maximize", () => appWindow.webContents.send("window/onMaximize"));
		appWindow.on("unmaximize", () => appWindow.webContents.send("window/onUnmaximize"));
		appWindow.on("enter-full-screen", () => appWindow.webContents.send("window/onEnterFullScreen"));
		appWindow.on("leave-full-screen", () => appWindow.webContents.send("window/onLeaveFullScreen"));

		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		app.on("activate", () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow();
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
//#endregion

//#region save folders/files reading
ipcMain.handle("getRawFolders", async () => {
	const result = await utils.fileSystem.getRawFolders(KSP_INSTALL_DIR);

	if (result.code === 0) return result.folders;

	const ERRORS = {
		1: {
			title: "KSP Install Directory Error",
			lines: [
				{ text: "No 'saves' folder found inside:" },
				{ text: `${KSP_INSTALL_DIR}`, indented: true, secondary: true, italic: true },
				{ text: "Please check that the path provided as the KSP install directory is correct." }
			]
		},
		2: {
			title: "KSP Install Directory Error",
			lines: [
				{ text: "Could not access:" },
				{ text: `${join(KSP_INSTALL_DIR, "saves")}`, indented: true, secondary: true, italic: true },
				{
					text: "Please ensure 'read' permissions are available or try running the program as an administrator."
				}
			]
		},
		3: {
			title: "KSP Install Directory Error",
			lines: [
				{ text: "KSP Install path is not a folder:" },
				{ text: `${KSP_INSTALL_DIR}`, indented: true, secondary: true, italic: true },
				{ text: "Please verify the path and try refreshing." }
			]
		},
		"-1": { title: "KSP Install Directory Error", lines: "Unkown error occurred. ¯\\_(ツ)_/¯" }
	};

	appWindow.webContents.send("toasts/onBackendError", ERRORS[result.code]);
	return [];
});

ipcMain.handle("exploreFolder", async (_, folderPath) => {
	// Get list of sfsFile paths
	const sfsPaths = await utils.fileSystem.getSfsFiles(folderPath);

	var persistentMode = "";
	var persistentVersion = "";

	const sfsFiles = (
		await Promise.all(
			// Map over all the sfs file paths
			sfsPaths.map(async (sfsPath) => {
				const result = await utils.fileSystem.readFileContents(sfsPath);

				const ERRORS = {
					1: {
						title: "File Read Error",
						lines: [
							{ text: "File: ", inLine: true },
							{ text: `${basename(sfsPath)}`, secondary: true, italic: true, inLine: true },
							{ text: " does not exist." }
						]
					},
					2: {
						title: "File Read Error",
						lines: [
							{ text: "Could not access: ", inLine: true },
							{ text: `${sfsPath}`, secondary: true, italic: true },
							{
								text: "Please ensure 'read' permissions are available or try running the program as an administrator."
							}
						]
					},
					"-1": { title: "File Read Error", lines: "Unkown error occurred. ¯\\_(ツ)_/¯" }
				};

				if (result.code !== 0) {
					appWindow.webContents.send("toasts/onBackendError", ERRORS[result.code]);
					return null;
				}

				const sfsFile = utils.parseSfs(result.content, sfsPath);

				if (sfsFile.name === "persistent.sfs") {
					persistentVersion = sfsFile.version;
					persistentMode = sfsFile.mode;
				}

				return sfsFile;
			})
		)
	).filter(Boolean); // Remove any null values from the resulting array, keeping only valid files

	const exploredFolder = {
		name: basename(folderPath),
		path: folderPath,
		mode: persistentMode,
		version: persistentVersion,
		sfsFiles
	};

	return exploredFolder;
});
//#endregion

//#region Theme
ipcMain.handle("dark-mode:toggle", () => {
	if (nativeTheme.shouldUseDarkColors) {
		nativeTheme.themeSource = "light";
	} else {
		nativeTheme.themeSource = "dark";
	}

	updateBackgroundColor();
	return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:reset", () => {
	nativeTheme.themeSource = "system";
	updateBackgroundColor();
});

ipcMain.handle("dark-mode:is-dark", () => {
	return nativeTheme.shouldUseDarkColors;
});

function updateBackgroundColor() {
	const col = nativeTheme.shouldUseDarkColors ? "#282828" : "#ffffff";
	appWindow?.setBackgroundColor(col);
}
//#endregion

//#region Titlebar window buttons
ipcMain.on("window/minimize", () => appWindow.minimize());
ipcMain.on("window/maximize", () => appWindow.maximize());
ipcMain.on("window/unmaximize", () => appWindow.unmaximize());
ipcMain.on("window/close", () => appWindow.close());
ipcMain.handle("window/isMaximized", () => appWindow.isMaximized());
ipcMain.handle("window/isFullScreen", () => appWindow.isFullScreen());

ipcMain.handle("isMacOs", () => process.platform === "darwin");
//#endregion

//#region Content
// Handle tab selection and notify all renderer processes
ipcMain.on("onTabSelect", (_, selectedTab) => {
	appWindow.webContents.send("updateContent", { type: "tab", value: selectedTab });
});

// Handle save file selection and notify all renderer processes
ipcMain.on("onSaveSelect", (_, selectedSave) => {
	appWindow.webContents.send("updateContent", { type: "save", value: selectedSave });
});
//#endregion

//#region Json Data
ipcMain.handle("getJsonData", async () => {
	const dataPath = join(app.getAppPath(), "src", "data");

	// TODO: avoid reading the files each time. Needs rewriting in the future
	const activitiesResult = await utils.fileSystem.readFileContents(join(dataPath, "activities.json"));
	const celestialBodiesResult = await utils.fileSystem.readFileContents(join(dataPath, "celestialBodies.json"));
	const situationsResult = await utils.fileSystem.readFileContents(join(dataPath, "situations.json"));
	const deployedExperiments = await utils.fileSystem.readFileContents(join(dataPath, "deployedExperiments.json"));

	if (activitiesResult.code !== 0) {
		appWindow.webContents.send("toasts/onBackendError", {
			title: "App Data Error",
			lines: [
				{ text: "Could not load: ", inLine: true },
				{ text: "activities.json", secondary: true, italic: true },
				{ text: "File either missing or not accessible" }
			]
		});
	}
	if (celestialBodiesResult.code !== 0) {
		appWindow.webContents.send("toasts/onBackendError", {
			title: "App Data Error",
			lines: [
				{ text: "Could not load: ", inLine: true },
				{ text: "celestialBodies.json", secondary: true, italic: true },
				{ text: "File either missing or not accessible" }
			]
		});
	}
	if (situationsResult.code !== 0) {
		appWindow.webContents.send("toasts/onBackendError", {
			title: "App Data Error",
			lines: [
				{ text: "Could not load: ", inLine: true },
				{ text: "situations.json", secondary: true, italic: true },
				{ text: "File either missing or not accessible" }
			]
		});
	}
	if (deployedExperiments.code !== 0) {
		appWindow.webContents.send("toasts/onBackendError", {
			title: "App Data Error",
			lines: [
				{ text: "Could not load: ", inLine: true },
				{ text: "deployedExperiments.json", secondary: true, italic: true },
				{ text: "File either missing or not accessible" }
			]
		});
	}

	// TODO: implement validation before returning (json has correct structure?)
	return {
		activities: JSON.parse(activitiesResult.content),
		celestialBodies: JSON.parse(celestialBodiesResult.content),
		situations: JSON.parse(situationsResult.content),
		deployedExperiments: JSON.parse(deployedExperiments.content)
	};
});
//#endregion
