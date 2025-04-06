const mainContent = document.getElementById("main-content");

var scienceData = null;
var selectedTab = "kerbin";

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
	selectedTab = selectedTab;

	// If there is no data, don't do anything
	if (!scienceData) {
		return;
	}

	// Else update content
	updateContent();
}

function updateContent() {
	// Clear current content
	mainContent.innerHTML = "";

	console.log(scienceData);
	console.log(selectedTab);
}
