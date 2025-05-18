import { ipcMain } from "electron";
import { basename } from "node:path";
import utils from "./utils/index.js";
import { getExploreFolderErrors, getRawFolderErrors } from "../errors.js";
import menu from "./menu.js";

const KSP_INSTALL_DIR = process.env.KSP_PATH;

export function registerApiHandlers(window) {
	ipcMain.handle("getRawFolders", async () => {
		const result = await utils.fileSystem.getRawFolders(KSP_INSTALL_DIR);

		if (result.code === 0) return result.folders;

		const RAW_FOLDER_ERRORS = getRawFolderErrors(KSP_INSTALL_DIR);

		window.webContents.send("toasts/onBackendError", RAW_FOLDER_ERRORS[result.code]);
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

					const EXPLORE_FOLDERS_ERRORS = getExploreFolderErrors(sfsPath);

					if (result.code !== 0) {
						window.webContents.send("toasts/onBackendError", EXPLORE_FOLDERS_ERRORS[result.code]);
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
}
