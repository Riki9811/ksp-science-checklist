const mainContent = document.getElementById("main-content");
const noContentElement = document.getElementById("no-content");

var scienceData = null;
var showingTab = "kerbin";

// Listen for content updates (triggered in sidebar.js and tablist.js)
content.onUpdateContent((data) => {
	console.log(data);

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
	// If empty new selected, so show no content message
	if (!selectedSave) {
		mainContent.appendChild(noContentElement);
		return;
	}

	// Else there is data, read it with sfsParser and show it
	noContentElement.remove();
	// main.innerHTML = `Selected Save: ${selectedSave}`;
}

/**
 * Updates content to info relative to newly selected body
 * @param {string} selectedTab name of the selected tab
 */
function onTabSelect(selectedTab) {
	showingTab = selectedTab;

	// If there is no data, show no content message
	if (!scienceData) {
		mainContent.appendChild(noContentElement);
		return;
	}

	// Else update to show correct tab
	noContentElement.remove();
	// mainContent.innerHTML = `Selected Tab: ${selectedTab}`;
}

function showContent(content) {
	mainContent.innerHTML = content;
}
