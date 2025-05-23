import PopupToast from "../components/PopupToast.js";
import ScienceCell from "../components/ScienceCell.js";
import ScienceTable from "../components/ScienceTable.js";

const mainContent = document.getElementById("main-content");

var scienceData = null;
var selectedBody = "Kerbin";
const tables = [];
const remainingList = [];

// Listen for content updates (triggered in sidebar.js and tablist.js)
content.onUpdateContent((data) => {
	if (data.type === "tab") {
		onTabSelect(data.value);
	} else if (data.type === "save") {
		onSaveSelect(data.value);
	}
});

/**
 * Updates content to show newly selected save, or shows no-content element if selectedSave is null
 * @param {string} selectedSave path to the save to show
 */
function onSaveSelect(selectedSave) {
	// Update scienceData
	scienceData = selectedSave;

	// Update content
	updateContent();
}

/**
 * Updates content to info relative to newly selected body
 * @param {string} selectedTab name of the selected tab
 */
function onTabSelect(selectedTab) {
	selectedBody = selectedTab;

	// If there is no data, don't do anything
	if (!scienceData) {
		return;
	}

	// Else update content
	updateContent();
}

async function updateContent() {
	// Clear current content
	mainContent.innerHTML = "";
	tables.length = 0;
	remainingList.length = 0;

	// Save orignial list with all experiments (to restore it later)
	const allExperiments = [...scienceData.experiments];

	// Get JSON data
	const jsonData = await api.getJsonData();

	// Select current body info
	const bodyInfo = jsonData.celestialBodies.find((body) => body.name === selectedBody);
	if (!bodyInfo) {
		PopupToast.showError("Data Missing", `Missing data for selected celestial body: ${selectedBody}.`);
		return;
	}

	// Sort biomes in alphabetical order
	bodyInfo.biomes.sort();
	bodyInfo.specialBiomes.sort();

	// Ignore all situations that are not possible on the selected body
	jsonData.situations = jsonData.situations.filter((situation) => {
		if (situation.requiresAtmosphere && !bodyInfo.hasAtmosphere) return false;
		if (situation.requiresWater && !bodyInfo.hasWater) return false;
		if (situation.requiresLanding && !bodyInfo.isLandable) return false;
		return true;
	});

	// Ignore all deplyed experiments that are not possible on the selected body
	jsonData.deployedExperiments = jsonData.deployedExperiments.filter((deployable) => {
		if (deployable.requiresAtmosphere && !bodyInfo.hasAtmosphere) return false;
		if (deployable.requiresVacuum && bodyInfo.hasAtmosphere) return false;
		return true;
	});

	constructSituationTables(jsonData, bodyInfo);
	constructDeployablesTable(jsonData, bodyInfo);
	constructROCScienceTable(bodyInfo);
	constructCraftRecoveryTable(bodyInfo);
	constructSamplesTables("asteroidSample", jsonData, bodyInfo);
	constructSamplesTables("cometSample_short", jsonData, bodyInfo);
	constructSamplesTables("cometSample_intermediate", jsonData, bodyInfo);
	constructSamplesTables("cometSample_long", jsonData, bodyInfo);
	constructSamplesTables("cometSample_interstellar", jsonData, bodyInfo);
	constructSpecialBiomesTables(jsonData, bodyInfo);

	listRemainingExperiments(bodyInfo);

	// Restore list of all experiments (done because I remove used experiments to the show un-used to user)
	scienceData.experiments = [...allExperiments];
}

//#region Table Common Functions
function popExperimentById(id) {
	if (!scienceData) return null;

	const index = scienceData.experiments.findIndex((experiment) => experiment.id === id);

	if (index < 0) return { id, collected: 0, total: 0 };

	const splicedData = scienceData.experiments.splice(index, 1);
	return splicedData[0];
}

function filterSamplesByBody(sampleType, bodyName) {
	if (!scienceData) return [];

	const idStart = `${sampleType}@${bodyName}`;
	return scienceData.experiments.filter((experiment) => experiment.id.startsWith(idStart));
}

function constructTableTitle(title, recordCount, totPoints) {
	const newTitle = document.createElement("h1");
	newTitle.classList.add("table-title");
	newTitle.textContent = `${title}:`;

	const newSubTitle = document.createElement("p");
	newSubTitle.classList.add("table-sub-title");
	newSubTitle.textContent = `${recordCount} science records, ${Math.round(totPoints * 10) / 10} points.`;

	newTitle.appendChild(newSubTitle);
	mainContent.appendChild(newTitle);
}

function formatCamelCase(s) {
	var newS = s.replace(/([A-Z][^A-Z])/g, " $1").trim();
	return newS.charAt(0).toUpperCase() + newS.slice(1);
}
//#endregion

//#region Situation Tables
function constructSituationTables(jsonData, bodyInfo) {
	// Ignore asteroid and comet samples
	const filteredActivities = jsonData.activities.filter((activity) => !activity.name.startsWith("comet") && !activity.name.startsWith("asteroid"));

	// List of all biome names formatted
	const biomes = bodyInfo.biomes.length > 0 ? bodyInfo.biomes.map(formatCamelCase) : [`${bodyInfo.displayName} (global)`];

	// Construct the table data for each situation
	const tablesData = jsonData.situations.map((situation) => generateSituationTableData(filteredActivities, bodyInfo, situation));

	for (const tableData of tablesData) {
		constructTableTitle(tableData.name, tableData.recordCount, tableData.totPoints);

		const newTable = new ScienceTable(mainContent, biomes, tableData.activities, tableData.columns);
		tables.push(newTable);
	}
}

function generateSituationTableData(activities, bodyInfo, situation) {
	let recordCount = 0;
	let totPoints = 0;

	const columns = activities.map((activity) => {
		if (activity.requiresAtmosphere && !bodyInfo.hasAtmosphere) return null;

		const activityType = situation.activityTypes[activity.name];

		if (!activityType) return null;
		else if (activityType === "global" || bodyInfo.biomes.length === 0) {
			const experiment = popExperimentById(`${activity.name}@${bodyInfo.name}${situation.name}`);
			if (experiment && experiment.total > 0) {
				recordCount++;
				totPoints += experiment.collected;
			}
			return [experiment];
		}

		return bodyInfo.biomes.map((biomeName) => {
			const experiment = popExperimentById(`${activity.name}@${bodyInfo.name}${situation.name}${biomeName}`);
			if (experiment && experiment.total > 0) {
				recordCount++;
				totPoints += experiment.collected;
			}
			return experiment;
		});
	});

	return {
		name: situation.displayName,
		activities: activities.map((activity) => activity.displayName),
		columns,
		recordCount,
		totPoints
	};
}
//#endregion

//#region Craft Recovery Table
function constructCraftRecoveryTable(bodyInfo) {
	let recordCount = 0;
	let totPoints = 0;

	const rowHeaders = [bodyInfo.name];
	const columnHeaders = bodyInfo.recovery.map((recovery) => recovery.displayName);

	const columns = bodyInfo.recovery.map((recovery) => {
		const experiment = popExperimentById(`recovery@${bodyInfo.name}${recovery.name}`);
		if (experiment && experiment.total > 0) {
			recordCount++;
			totPoints += experiment.collected;
		}
		return [experiment];
	});

	constructTableTitle("Craft Recovery", recordCount, totPoints);

	const newTable = new ScienceTable(mainContent, rowHeaders, columnHeaders, columns, true);
	tables.push(newTable);
}
//#endregion

//#region Deployables Table
function constructDeployablesTable(jsonData, bodyInfo) {
	if (!bodyInfo.isLandable) return;

	let recordCount = 0;
	let totPoints = 0;

	const rowHeaders = [`${bodyInfo.name} surface`];
	const columnHeaders = jsonData.deployedExperiments.map((deployable) => deployable.displayName);

	const columns = jsonData.deployedExperiments.map((deployable) => {
		const experiment = popExperimentById(`${deployable.name}@${bodyInfo.name}SrfLanded`);
		if (experiment && experiment.total > 0) {
			recordCount++;
			totPoints += experiment.collected;
		}
		return [experiment];
	});

	constructTableTitle("Doployables", recordCount, totPoints);

	const newTable = new ScienceTable(mainContent, rowHeaders, columnHeaders, columns, true);
	tables.push(newTable);
}
//#endregion

//#region ROCScience Table
function constructROCScienceTable(bodyInfo) {
	if (!bodyInfo.ROCScience || bodyInfo.ROCScience.length === 0) return;

	let recordCount = 0;
	let totPoints = 0;

	const rowHeaders = ["Scan/Analysis"];
	const columnHeaders = bodyInfo.ROCScience.map((ROCScience) => ROCScience.displayName);

	const columns = bodyInfo.ROCScience.map((ROCScience) => {
		const experiment = popExperimentById(`${ROCScience.name}@${bodyInfo.name}SrfLanded`);
		if (experiment && experiment.total > 0) {
			recordCount++;
			totPoints += experiment.collected;
		}
		return [experiment];
	});

	constructTableTitle("Surface features", recordCount, totPoints);

	const newTable = new ScienceTable(mainContent, rowHeaders, columnHeaders, columns, true);
	tables.push(newTable);
}
//#endregion

//#region Asteroid/Comet Table
function constructSamplesTables(sampleType, jsonData, bodyInfo) {
	// Get all samples containing the bodyInfo.name
	const samples = filterSamplesByBody(sampleType, bodyInfo.name);

	if (!samples || samples.length === 0) return;

	let title = "";
	switch (sampleType) {
		case "cometSample_short":
			title = "Short Comet Samples";
			break;
		case "cometSample_intermediate":
			title = "Intermediate Comet Samples";
			break;
		case "cometSample_long":
			title = "Long Comet Samples";
			break;
		case "cometSample_interstellar":
			title = "Interstellar Comet Samples";
			break;
		default:
			title = "Asteroid Samples";
			break;
	}
	const tableData = generateSamplesTableData(sampleType, samples, bodyInfo, jsonData);

	constructTableTitle(title, tableData.recordCount, tableData.totPoints);

	const newTable = new ScienceTable(mainContent, tableData.rowHeaders, tableData.columnHeaders, tableData.columns, true);
	tables.push(newTable);
}

function generateSamplesTableData(sampleType, samples, bodyInfo, jsonData) {
	let recordCount = 0;
	let totPoints = 0;

	const names = [
		...new Set(
			samples.map((sample) => {
				const split = sample.id.split("_");
				return split[split.length - 1];
			})
		)
	];

	const situations = [...new Set(samples.map((sample) => sample.id.split("@")[1].split("_")[0].substring(bodyInfo.name.length)))];

	const columns = names.map((name) => {
		return situations.map((situation) => {
			const id = `${sampleType}@${bodyInfo.name}${situation}_${name}`;
			const experiment = popExperimentById(id);
			if (experiment && experiment.total > 0) {
				recordCount++;
				totPoints += experiment.collected;
			}
			return experiment;
		});
	});

	return {
		rowHeaders: situations.map((s) => formatSampleSituation(s, jsonData)),
		columnHeaders: names,
		columns,
		recordCount,
		totPoints
	};
}

function formatSampleSituation(situationString, jsonData) {
	for (const situation of jsonData.situations) {
		const name = situation.name;
		if (situationString.startsWith(name) && situationString.length > name.length) {
			return `${situation.displayName} / ${formatCamelCase(situationString.slice(name.length))}`;
		}
	}

	return formatCamelCase(situationString);
}
//#endregion

//#region Special biomes Table
function constructSpecialBiomesTables(jsonData, bodyInfo) {
	if (!bodyInfo.specialBiomes || bodyInfo.specialBiomes.length === 0) return;

	const landedSituation = jsonData.situations.filter((situation) => situation.name === "SrfLanded")[0];

	// List of all special biome names formatted
	const biomes = bodyInfo.specialBiomes.map(formatCamelCase);

	const filteredActivities = jsonData.activities.filter((activity) => {
		const isComet = activity.name.startsWith("comet");
		const isAsteroid = activity.name.startsWith("asteroid");
		const isBiomeSpecific = landedSituation.activityTypes[activity.name] === "biome";

		return !isComet && !isAsteroid && isBiomeSpecific;
	});

	const tableData = generateSpecialBiomesTableData(filteredActivities, bodyInfo, landedSituation);

	constructTableTitle(tableData.name, tableData.recordCount, tableData.totPoints);

	const newTable = new ScienceTable(mainContent, biomes, tableData.activities, tableData.columns);
	tables.push(newTable);
}

function generateSpecialBiomesTableData(activities, bodyInfo, situation) {
	let recordCount = 0;
	let totPoints = 0;

	const columns = activities.map((activity) => {
		if (activity.requiresAtmosphere && !bodyInfo.hasAtmosphere) return null;

		return bodyInfo.specialBiomes.map((biomeName) => {
			const experiment = popExperimentById(`${activity.name}@${bodyInfo.name}${situation.name}${biomeName}`);
			if (experiment && experiment.total > 0) {
				recordCount++;
				totPoints += experiment.collected;
			}
			return experiment;
		});
	});

	return {
		name: situation.displayName + " (Special Biomes)",
		activities: activities.map((activity) => activity.displayName),
		columns,
		recordCount,
		totPoints
	};
}
//#endregion

//#region Remaining Experiments
function listRemainingExperiments(bodyInfo) {
	const remainingExperiments = scienceData.experiments.filter((experiment) => experiment.id.includes(bodyInfo.name));

	if (remainingExperiments.length === 0) return;

	let recordCount = remainingExperiments.length;
	let totPoints = remainingExperiments.reduce((accumulator, experiment) => accumulator + experiment.collected, 0);

	constructTableTitle("Remaining/Unhandled Experiments", recordCount, totPoints);

	const container = document.createElement("div");
	container.classList.add("remaining-experiment-container");

	remainingExperiments.forEach((experiment) => {
		const experimentId = document.createElement("p");
		experimentId.textContent = experiment.id;
		container.appendChild(experimentId);

		const cell = document.createElement("div");
		new ScienceCell(cell, experiment.id, experiment.collected, experiment.total);
		container.appendChild(cell);

		const spacer = document.createElement("div");
		spacer.classList.add("remaining-experiments-spacer");
		container.appendChild(spacer);
	});

	container.removeChild(container.lastChild);
	mainContent.appendChild(container);
}
//#endregion
