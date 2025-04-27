import { basename } from "node:path";

/**
 * Parses the content of an SFS file to extract specific information.
 * @param {string} sfsContent - The content of the SFS file as a string.
 * @returns {Object} An object containing the extracted data.
 */
export default function parseSFS(sfsContent, filePath) {
	const fileName = basename(filePath);

	// Extract version
	const version = extractVersion(sfsContent);

	// Extract mode
	const mode = extractMode(sfsContent);

	// If it's a Sandbox game, there is no R&D and no science to extract, so return default values
	if (mode === "SANDBOX") {
		return {
			name: fileName,
			path: filePath,
			version,
			mode,
			sciencePoints: 0,
			experiments: [],
			experimentCount: 0
		};
	}

	// Isolate the ResearchAndDevelopment SCENARIO block
	const rAndDContent = isolateResearchAndDevelopment(sfsContent);

	// Extract the amount of science points
	const sciencePoints = rAndDContent ? extractSciencePoints(rAndDContent) : 0;

	// Extract the list of science experiment IDs
	const experiments = rAndDContent ? extractExperiments(rAndDContent) : [];

	// Return the parsed data
	return {
		name: fileName,
		path: filePath,
		version,
		mode,
		sciencePoints,
		experiments,
		experimentCount: experiments.length
	};
}

/**
 * Extracts the `version` from the GAME block in the SFS content.
 * @param {string} sfsContent - The content of the SFS file as a string.
 * @returns {string|null} The extracted version, or `null` if not found.
 */
function extractVersion(sfsContent) {
	const versionMatch = sfsContent.match(/GAME\s*{[^}]*\bversion\s*=\s*([^\s]+)/);
	return versionMatch ? versionMatch[1] : null;
}

/**
 * Extracts the `mode` from the GAME block in the SFS content.
 * @param {string} sfsContent - The content of the SFS file as a string.
 * @returns {string|null} The extracted mode, or `null` if not found.
 */
function extractMode(sfsContent) {
	const modeMatch = sfsContent.match(/GAME\s*{[^}]*\bMode\s*=\s*([^\s]+)/);
	return modeMatch ? modeMatch[1] : null;
}

/**
 * Isolates the `ResearchAndDevelopment` SCENARIO block from the SFS content.
 * This function removes unnecessary whitespace and fixes indentation in the result.
 *
 * @param {string} sfsContent - The content of the SFS file as a string.
 * @returns {string|null} The isolated `ResearchAndDevelopment` SCENARIO block, or `null` if not found.
 */
function isolateResearchAndDevelopment(sfsContent) {
	const rAndDMatch = sfsContent.match(/SCENARIO\s*{\s*name\s*=\s*ResearchAndDevelopment([\s\S]*?)\s*}\s*SCENARIO/);

	if (!rAndDMatch) return null;
	return rAndDMatch[1].replace(/^\t\t/gm, "").trim();
}

/**
 * Extracts the `sci` amount from the ResearchAndDevelopment block.
 * @param {string} rAndDContent - The content of the ResearchAndDevelopment block as a string.
 * @returns {number} The extracted amount of science points, rounded to 1 decimal place. Returns `0` if not found.
 */
function extractSciencePoints(rAndDContent) {
	const sciMatch = rAndDContent.match(/\ssci\s=\s([^\s]+)/);
	return sciMatch ? Math.round(parseFloat(sciMatch[1]) * 10) / 10 : 0;
}

/**
 * Extracts a list of experiments from the `Science` objects inside the ResearchAndDevelopment block.
 * Each experiment includes its `id`, `collected` (sci), and `total` (cap) values.
 *
 * @param {string} rAndDContent - The content of the ResearchAndDevelopment block as a string.
 * @returns {Array<{id: string, collected: number, total: number}>} A list of experiment objects.
 * Returns an empty array if no `Science` objects are found or if the input is invalid.
 */
function extractExperiments(rAndDContent) {
	if (!rAndDContent) return []; // Return an empty array if the input is null or undefined.

	// Regular expression to match `Science` objects and capture `id`, `sci`, and `cap` values.
	const regex = /Science\s*{\s*id\s*=\s*([\S ]+)[^}]*?\bsci\s*=\s*([^\s]+)[^}]*?\bcap\s*=\s*([^\s]+)/g;

	let matches;
	const experiments = [];

	// Use a while loop to find all matches and extract the `id`, `sci`, and `cap` values.
	while ((matches = regex.exec(rAndDContent))) {
		const id = matches[1];
		const collected = parseFloat(matches[2]);
		const total = parseFloat(matches[3]);

		// Add the extracted experiment object to the output array.
		experiments.push({ id, collected, total });
	}

	return experiments; // Return the array of extracted experiment objects.
}
