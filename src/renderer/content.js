import ScienceTable from "../components/ScienceTable.js";

const mainContent = document.getElementById("main-content");

var scienceData = null;
var selectedBody = "Kerbin";
const tables = [];

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

	// Save orignial list with all experiments (to restore it later)
	const allExperiments = [...scienceData.experiments];

	// Get JSON data
	const jsonData = await api.getJsonData();

	// Select current body info
	const bodyInfo = jsonData.celestialBodies.find((body) => body.name === selectedBody);
	if (!bodyInfo) {
		// TODO: implement correct error handling
		console.error(`Celestial body "${selectedBody}" not found.`);
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

	// Construct the table data for each situation
	const tablesData = jsonData.situations.map((situation) => generateSituationTableData(filteredActivities, bodyInfo, situation));

	for (const tableData of tablesData) {
		constructTableTitle(tableData.name, tableData.recordCount, tableData.totPoints);

		const newTable = new ScienceTable(mainContent, tableData.biomes, tableData.activities, tableData.columns);
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
		name: formatCamelCase(situation.name),
		biomes: bodyInfo.biomes.length > 0 ? bodyInfo.biomes.map(formatCamelCase) : [`${bodyInfo.name} (global)`],
		activities: activities.map((activity) => formatCamelCase(activity.name)),
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
	const columnHeaders = bodyInfo.recovery.map(formatCamelCase);

	const columns = bodyInfo.recovery.map((recovery) => {
		const experiment = popExperimentById(`recovery@${bodyInfo.name}${recovery}`);
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
	const columnHeaders = jsonData.deployedExperiments.map((deployable) => formatCamelCase(deployable.name.replace("deployed", "")));

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
	const columnHeaders = bodyInfo.ROCScience.map((ROCScience) => formatCamelCase(ROCScience.replace("ROCScience_", "")));

	const columns = bodyInfo.ROCScience.map((ROCScience) => {
		const experiment = popExperimentById(`${ROCScience}@${bodyInfo.name}SrfLanded`);
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
