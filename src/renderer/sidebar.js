import FolderElement from "../components/FolderElement.js";

/** @type {FolderElement[]} All the folders showing */
var folders = [];
/** @type {boolean} A boolean indicating wether the sidebar is loading the folders or not */
var isLoading;

const saveList = document.getElementById("save-list");
const loadingElement = document.getElementById("saves-loading");

async function apiGetRawFolders() {
	// Set loading, remove any current folder from the UI, show loading element
	isLoading = true;
	folders.forEach((folder) => folder.remove());
	folders.length = 0;
	saveList.appendChild(loadingElement);

	// Wait for API call to get the save folders.
	/** @type {{name: string, path: string}[]} Array of partial folder data. */
	const rawFolders = await api.getRawFolders();

	// After we get a result from api remove loading and create folder elements
	isLoading = false;
	loadingElement.remove();
	rawFolders.forEach((rawFolder) => {
		const newFolder = new FolderElement(rawFolder.name, rawFolder.path, onSaveSelected);
		folders.push(newFolder);
		saveList.appendChild(newFolder.mainElement);
	});
}

function onSaveSelected(folderPath) {
	folders.forEach((folder) => {
		if (folder.path !== folderPath) folder.deselectAll();
	});
}

// Call getFolders on first app load
apiGetRawFolders();
