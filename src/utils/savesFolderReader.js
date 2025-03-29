import { readdirSync, statSync } from "fs";
import { join } from "node:path";

export function scanSavesFolder(kspSavesDir) {
	try {
		// Read  averything inside saves folder, and filter
		const folders = readdirSync(kspSavesDir).filter((folder) => {
			// Is it a folder?
			let isFolder = statSync(join(kspSavesDir, folder)).isDirectory();
			// Is it one of the default folders (training, scenarios and missions)?
			let isDefault = ["training", "scenarios", "missions"].includes(folder);
			// If it's a folder and is not a default one then keep it
			return isFolder && !isDefault;
		});

		// Transform the list of folders into the saves list
		const saves = folders.map((folder) => {
			// Get full path to folder
			let folderPath = join(kspSavesDir, folder);
			// Read every .sfs inside and map it to an object with {name, path}
			let sfsFiles = readdirSync(folderPath)
				.filter((file) => file.endsWith(".sfs"))
				.map((file) => ({
					name: file,
					path: join(folderPath, file)
				}));

			// Return the folder name + all the sfsFiles data
			return {
				name: folder,
				sfsFiles
			};
		});

		// This filter removes all folders that had no '.sfs' file.
		// It's easier to do it here than in the filter at the start
		return saves.filter((save) => save.sfsFiles.length > 0);
	} catch (error) {
		// If there is an error log and return ampty array for now
		// TODO: implement showing error to user
		console.error("Error scanning saves folder:", error);
		return [];
	}
}
