/**
 * @typedef {Object} ParsedSfs
 * @property {string} name - The name of the file.
 * @property {string} version - The version of the game, or `null` if not found.
 * @property {string} mode - The game mode ("CAREER", "SANDBOX_SCIENCE" or "SANDBOX"), or `null` if not found.
 * @property {number} sciencePoints - The total amount of science points, rounded to 1 decimal place. Defaults to `0` if not found.
 * @property {string[]} experiments - A list of all experiment IDs found in the ResearchAndDevelopment block. Defaults to an empty array if none are found.
 * @property {number} experimentCount - The total number of experiments found. Defaults to `0` if no experiments are found.
 */

/**
 * Parses the content of an SFS file to extract specific information.
 * @param {string} sfsContent - The content of the SFS file as a string.
 * @returns {ParsedSfs} An object containing the extracted data.
 */
export default function parseSFS(sfsContent, fileName) {
	// Extract version
	const version = extractVersion(sfsContent);

	// Extract mode
	const mode = extractMode(sfsContent);

	// If it's a Sandbox game, there is no R&D and no science to extract, so return default values
	if (mode === "SANDBOX") {
		return {
			name: fileName,
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
	const experiments = rAndDContent ? extractExperimentIds(rAndDContent) : [];

	// Return the parsed data
	return {
		name: fileName,
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
 * Extracts a list of all `id` values from the `Science` objects inside the ResearchAndDevelopment block.
 * @param {string} rAndDContent - The content of the ResearchAndDevelopment block as a string.
 * @returns {string[]} A list of all `id` values found in the `Science` objects. Returns an empty array if no `Science` objects are found or if the input is invalid.
 */
function extractExperimentIds(rAndDContent) {
	if (!rAndDContent) return []; // Return an empty array if the input is null or undefined.

	// Regular expression to match `Science` objects and capture their `id` values.
	const regex = /Science\s*{\s*id\s*=\s*([^\s]+)/g;

	let matches;
	const ids = [];

	// Use a while loop to find all matches and extract the `id` values.
	while ((matches = regex.exec(rAndDContent))) {
		ids.push(matches[1]); // Add the captured `id` value to the output array.
	}

	return ids; // Return the array of extracted `id` values.
}
