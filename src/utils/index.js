import { scanSavesFolder } from "./savesFolderReader.js";
import sfsReader from "./sfsReader.js";

/**
 * General information of a save extracted from the contents of an sfs file.
 * @typedef {Object} SaveFile
 * @property {string} name - Name of the save file
 * @property {string} path - The full path of the safe file
 * @property {number} science - The amount of science points available
 * @property {number} experimentCount - The amount of experiments run
 */

/**
 * General information of a save extracted from the contents of an sfs file.
 * @typedef {Object} SaveFolder
 * @property {string} name - Name of the save folder
 * @property {string} type - Type of the game. (CAREER, SCIENCE_SANDBOX or SANDBOX)
 * @property {string} version - The version of the game
 * @property {[SaveFile]} sfsFiles - List of .sfs save files
 */

/**
 * Scans the KSP saves folder and gets all the info about saves inside it
 * @param {string} kspSavesDir - Full path to the ksp saves folder
 * @returns {[SaveFolder]}
 */
function getSaves(kspSavesDir) {
	let saves = scanSavesFolder(kspSavesDir);

	return saves
		.map((save) => {
			let firstSfsContent = sfsReader.readSfsFile(save.sfsFiles[0].path);

			let type = sfsReader.extractSaveType(firstSfsContent);
			let version = sfsReader.extractSaveVersion(firstSfsContent);

			if (type === "SANDBOX") return { name: save.name, version, type, sfsFiles: [] };

			let sfsFiles = save.sfsFiles.map((sfsFile) => {
				let fileContents = sfsReader.readSfsFile(sfsFile.path);
				let rAndD = sfsReader.extractRandD(fileContents);

				let science = sfsReader.extractSciencePoints(rAndD);
				let experimentCount = sfsReader.extractExperimentCount(rAndD);

				return { ...sfsFile, science, experimentCount };
			});

			return { ...save, version, type, sfsFiles };
		})
		.filter((save) => save.type !== "SANDBOX");
}

export default { getSaves };
