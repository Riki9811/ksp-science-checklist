import { readFileSync } from "fs";

/**
 * Reads the contents of a file
 * @param {string} filePath - Full path to the .sfs file.
 * @returns {string} - The content of the file in text form
 */
function readSfsFile(filePath) {
    try {
        let data = readFileSync(filePath, "utf-8");
		return data;
    } catch (error) {
        console.error(`Error reading save file: ${filePath}`, error);
		return "";
	}
}

/**
 * Extracts only the ResearchAndDevelopment SCENARIO from SFS file content.
 * @param {string} fileContents - The full text of an SFS file.
 * @returns {string|null} - Extracted ResearchAndDevelopment block or null if not found.
 */
function extractRandD(fileContents) {
	// Regex to extract the full ResearchAndDevelopment SCENARIO block
	const match = fileContents.match(/SCENARIO\s*{\s*name\s*=\s*ResearchAndDevelopment([\s\S]*?)\n\t}/);

	return match ? `SCENARIO { name = ResearchAndDevelopment${match[1]}\n}` : null;
}

/**
 * Extracts the game version from SFS file content.
 * @param {string} fileContents - The full text of an SFS file.
 * @returns {string|null} - Version number or null if not found.
 */
function extractSaveVersion(fileContents) {
	// Regex to find version
	const versionMatch = fileContents.match(/GAME\s*{\s*version = ([\d.]*)/);

	return versionMatch ? versionMatch[1] : null;
}

/**
 * Extracts the save type from SFS file content.
 * @param {string} fileContents - The full text of an SFS file.
 * @returns {string|null} - Game type (CAREER, SCIENCE, SANDBOX)
 */
function extractSaveType(fileContents) {
	// Regex to find save type (CAREER, SCIENCE_SANDBOX or SANDBOX)
	const typeMatch = fileContents.match(/\tMode\s*=\s*(SCIENCE_SANDBOX|CAREER|SANDBOX)/);

	if (typeMatch) {
		if (typeMatch[1] === "SCIENCE_SANDBOX") {
			return "SCIENCE";
		}
		return typeMatch[1];
	}

	return null;
}

/**
 * Extracts available science points from the R&D SCENARIO.
 * @param {string} rndScenario - The extracted ResearchAndDevelopment SCENARIO.
 * @returns {number} - Science points rounded to 1 decimal place.
 */
function extractSciencePoints(rndScenario) {
	if (!rndScenario) return 0;

	// Extract science points and round down
	const sciMatch = rndScenario.match(/sci\s*=\s*([\d.]+)/);
	const sciencePoints = sciMatch ? Math.floor(parseFloat(sciMatch[1])) : 0;

	return sciencePoints;
}

/**
 * Extracts the number of performed experiments from the R&D SCENARIO.
 * @param {string} rndScenario - The extracted ResearchAndDevelopment SCENARIO.
 * @returns {number} - Experiment count (number of Science {} ).
 */
function extractExperimentCount(rndScenario) {
	if (!rndScenario) return 0;

	// Count number of Science entries
	const experimentCount = (rndScenario.match(/Science\s*{\s*id\s*=/g) || []).length;

	return experimentCount;
}

export default {
	readSfsFile,
	extractRandD,
	extractSaveVersion,
	extractSaveType,
	extractSciencePoints,
	extractExperimentCount
};
