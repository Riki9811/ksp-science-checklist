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

	// TODO: implement showing asteroid and comet samples
	// Ignore asteroid and comet samples
	jsonData.activities = jsonData.activities.filter((activity) => !activity.name.startsWith("comet") && !activity.name.startsWith("asteroid"));

	// Ignore all situations that are not possible on the selected body
	jsonData.situations = jsonData.situations.filter((situation) => {
		if (situation.requiresAtmosphere && !bodyInfo.hasAtmosphere) return false;
		if (situation.requiresWater && !bodyInfo.hasWater) return false;
		if (situation.requiresLanding && !bodyInfo.isLandable) return false;
		return true;
	});

	// Construct the table data for each situation
	const tablesData = jsonData.situations.map((situation) => constructTableData(jsonData.activities, bodyInfo, situation));

	for (const tableData of tablesData) {
		const newTitle = document.createElement("h1");
		newTitle.classList.add("table-title");
		newTitle.textContent = `${tableData.name}:`;
		const newSubTitle = document.createElement("p");
		newSubTitle.classList.add("table-sub-title");
		newSubTitle.textContent = `${tableData.recordCount} science records, ${tableData.totPoints} points.`;

		newTitle.appendChild(newSubTitle);
		mainContent.appendChild(newTitle);

		const newTable = new ScienceTable(mainContent, tableData.biomes, tableData.activities, tableData.columns);
		tables.push(newTable);
	}

	// Restore list of all experiments (done because I remove used experiments to the show un-used to user)
	scienceData.experiments = [...allExperiments];
}

function constructTableData(activities, bodyInfo, situation) {
	let recordCount = 0;
	let totPoints = 0;

	const columns = activities.map((activity) => {
		if (activity.requiresAtmosphere && !bodyInfo.hasAtmosphere) return null;

		const activityType = situation.activityTypes[activity.name];

		if (!activityType) return null;
		else if (activityType === "global") {
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
		name: situation.name,
		biomes: bodyInfo.biomes,
		activities: activities.map((activity) => activity.name),
		columns,
		recordCount,
		totPoints: Math.round(totPoints * 10) / 10
	};
}

function popExperimentById(id) {
	if (!scienceData) return null;

	const index = scienceData.experiments.findIndex((experiment) => experiment.id === id);

	if (index < 0) return { id, collected: 0, total: 0 };

	const splicedData = scienceData.experiments.splice(index, 1);
	return splicedData[0];
}
