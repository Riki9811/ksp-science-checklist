import { ipcMain } from "electron";
import { basename, join } from "node:path";
import utils from "./utils/index.js";

const KSP_INSTALL_DIR = process.env.KSP_PATH;

export function registerApiHandlers(window) {
	ipcMain.handle("getRawFolders", async () => {
		const result = await utils.fileSystem.getRawFolders(KSP_INSTALL_DIR);

		if (result.code === 0) return result.folders;

		const RAW_FOLDER_ERRORS = {
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

					const EXPLORE_FOLDERS_ERRORS = {
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
