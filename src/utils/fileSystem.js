import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} SaveFolderResult
 * @property {Array<{name: string, path: string}>} folders - List of save folders. Each folder has a `name` and a `path`.
 * If no valid folders are found or an error occurs, this will be an empty array.
 * @property {number} code - Error code indicating the result of the operation:
 *  - `0`: Success, folders retrieved.
 *  - `1`: Path does not exist.
 *  - `2`: No read access.
 *  - `3`: Path is not a folder.
 *  - `-1`: Unknown error.
 */

/**
 * Reads the contents of the saves folder inside the KSP directory.
 *
 * Takes the path to the KSP install directory, and gets all folders inside "saves".
 * Excludes built-in folders such as "training", "scenarios", and "missions".
 * Additionally, filters out folders that do not contain a "persistent.sfs" file.
 * Handles errors gracefully and always returns a structured result.
 *
 * @param {string} kspInstallDir - Path to the install folder of KSP.
 * @returns {Promise<SaveFolderResult>} A promise resolving to an object containing the list of save folders and an error code.
 *
 * @example
 * const result = await getSaveFolders("C:/.../Steam/steamapps/common/Kerbal Space Program");
 * if (result.code === 0) {
 *   console.log("Save folders:", result.folders);
 * } else {
 *   console.error("Error retrieving save folders. Code:", result.code);
 * }
 */
async function getRawFolders(kspInstallDir) {
	// Construct the full path to the "saves" directory
	const savePath = path.join(kspInstallDir, "saves");

	try {
		// Check if the "saves" path exists and is readable
		await fs.access(savePath, fs.constants.R_OK);

		// Read the contents of the "saves" directory
		const items = await fs.readdir(savePath, { withFileTypes: true });

		// Filter out unwanted entries:
		// - Only include directories
		// - Exclude built-in folders like "training", "scenarios", and "missions"
		const potentialFolders = items
			.filter((item) => item.isDirectory() && !["training", "scenarios", "missions"].includes(item.name))
			.map((item) => ({
				// Map each folder to an object containing its name and full path
				name: item.name,
				path: path.join(savePath, item.name)
			}));

		// Further filter folders to include only those containing a "persistent.sfs" file
		const folders = (
			await Promise.all(
				// Map over the list of potential folders and check if each contains a "persistent.sfs" file
				potentialFolders.map(async (folder) => {
					// Call the helper function `hasPersistentFile` to verify the presence of "persistent.sfs"
					// TODO: add warning about this in the help
					const hasFile = await hasPersistentFile(folder.path);
					// If the file exists, return the folder object; otherwise, return null
					return hasFile ? { ...folder } : null;
				})
			)
		).filter(Boolean); // Remove any null values from the resulting array, keeping only valid folders

		// Return the list of folders with a success code
		return { folders, code: 0 };
	} catch (err) {
		// Handle specific errors and return appropriate error codes

		// The "saves" path does not exist
		if (err.code === "ENOENT") return { folders: [], code: 1 };
		// No read access to the "saves" path
		if (err.code === "EACCES") return { folders: [], code: 2 };
		// The "saves" path is not a directory
		if (err.code === "ENOTDIR") return { folders: [], code: 3 };

		// Return a generic error code for any other errors
		return { folders: [], code: -1 };
	}
}

/**
 * Checks if a given save folder contains a "persistent.sfs" file.
 *
 * The "persistent.sfs" file is a critical file used by Kerbal Space Program (KSP) to manage save data.
 * It contains essential information about the save, such as the game state and progress.
 * If this file is missing, the game will flag the save as incompatible.
 *
 * This function determines whether the file exists and is readable, ensuring that the save folder
 * is valid and usable. It is acceptable for this code to depend on the existence of the "persistent.sfs"
 * file, as the game itself relies on it to function correctly. This dependency aligns with the behavior
 * of the game and ensures consistency in handling save folders.
 *
 * @param {string} saveFolderPath - Full path to the save folder.
 * @returns {Promise<boolean>} A promise resolving to `true` if the folder contains a readable "persistent.sfs" file, otherwise `false`.
 *
 * @example
 * const hasFile = await hasPersistentFile("C:/Games/KSP/saves/MySave");
 * if (hasFile) {
 *   console.log("The save folder is valid.");
 * } else {
 *   console.error("The save folder is missing the 'persistent.sfs' file.");
 * }
 */
async function hasPersistentFile(saveFolderPath) {
	// Construct the full path to the "persistent.sfs" file
	const persistentFilePath = path.join(saveFolderPath, "persistent.sfs");

	try {
		// Check if the "persistent.sfs" file exists and is readable
		// Throws an error if the file does not exist or is inaccessible
		await fs.access(persistentFilePath, fs.constants.R_OK);
		return true; // File exists and is readable
	} catch {
		// Return false if the file does not exist or is inaccessible
		return false;
	}
}

/**
 * Reads the contents of a file asynchronously.
 *
 * This function takes the path to a file and reads its contents as a string.
 * It handles errors gracefully, ensuring that the caller is informed if the file
 * cannot be read due to issues such as non-existence or lack of permissions.
 *
 * @param {string} filePath - The full path to the file to be read.
 * @returns {Promise<{ content: string, code: number }>} A promise resolving to an object containing:
 *  - `content`: The file's contents as a string, or empty `string` if an error occurred.
 *  - `code`: Error code indicating the result of the operation:
 *    - `0`: Success, file read successfully.
 *    - `1`: File does not exist.
 *    - `2`: No read access.
 *    - `-1`: Unknown error.
 *
 * @example
 * const result = await readFileContents("C:/path/to/file.txt");
 * if (result.code === 0) {
 *   console.log("File contents:", result.content);
 * } else {
 *   console.error("Error reading file. Code:", result.code);
 * }
 */
async function readFileContents(filePath) {
	try {
		// Read the file contents as a string
		const content = await fs.readFile(filePath, "utf-8");
		return { content, code: 0 }; // Success
	} catch (err) {
		// Handle specific errors and return appropriate error codes

		// File does not exist
		if (err.code === "ENOENT") return { content: "", code: 1 };
		// No read access to the file
		if (err.code === "EACCES") return { content: "", code: 2 };

		// Return a generic error code for any other errors
		return { content: "", code: -1 };
	}
}

/**
 * Retrieves a list of all `.sfs` files directly inside a given directory.
 *
 * This function scans the specified directory and returns the paths of all files
 * with the `.sfs` extension. It does not search subdirectories.
 *
 * @param {string} directoryPath - The path to the directory to scan.
 * @returns {Promise<string[]>} A promise resolving to an array of file paths. If no `.sfs` files are found, the array will be empty.
 *
 * @example
 * const sfsFiles = await getSfsFiles("C:/path/to/directory");
 * if (sfsFiles.length === 0) {
 *   console.log("No .sfs file found.");
 * } else {
 *   console.log("SFS Files:", sfsFiles);
 * }
 */
async function getSfsFiles(directoryPath) {
	try {
		// Read the contents of the directory
		const items = await fs.readdir(directoryPath, { withFileTypes: true });

		// Filter for files with the `.sfs` extension and map to their full paths
		const sfsFiles = items.filter((item) => item.isFile() && item.name.endsWith(".sfs")).map((item) => path.join(directoryPath, item.name));

		return sfsFiles; // Return the list of `.sfs` file paths
	} catch (err) {
		return []; // Return an empty list in case of an error
	}
}

export default { getRawFolders, hasPersistentFile, readFileContents, getSfsFiles };
