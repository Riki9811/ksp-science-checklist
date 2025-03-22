import { saves } from "./tempSaves.js";

const saveList = document.getElementById("save-list");

(async () => {
	if (!saveList) return;

	// const saves = await window.api.getSaves();

	saves.forEach((save) => {
		const folderItem = createSaveFolder(save);
		const spacer = document.createElement("li");
		spacer.appendChild(document.createElement("div")); // Empty div to create space between folders
		spacer.classList.add("spacer");

		saveList.appendChild(spacer);
		saveList.appendChild(folderItem);
	});
})();

/**
 * Creates an <li> element for a save folder entry.
 * @param {Object} folderData - The save folder data.
 * @param {string} folderData.name - The name of the save folder.
 * @param {string} folderData.type - The type of save (CAREER, SCIENCE, SANDBOX).
 * @param {string} folderData.version - The game version.
 * @param {Array} folderData.sfsFiles - Array of SFS file objects.
 * @returns {HTMLElement} The generated <li> element.
 */
function createSaveFolder(folderData) {
	// Create the <li> element
	const saveFolder = document.createElement("li");
	saveFolder.classList.add("save-folder");
	saveFolder.classList.add("closed"); // Closed by default

	// Create the folder title div and append
	const titleDiv = createSaveFolderTitle(folderData, saveFolder);

	// Create the <ol> list for SFS files
	const ol = document.createElement("ol");
	ol.classList.add("save-file-list");

	// Generate <li> items for each SFS file and append them to the <ol>
	folderData.sfsFiles.forEach((sfsFile) => ol.appendChild(createSaveFileList(sfsFile)));

	// Append the title div and list to the folder <li>
	saveFolder.appendChild(titleDiv);
	saveFolder.appendChild(ol);

	return saveFolder;
}

/**
 * Creates a <div> element for a save folder title.
 * @param {Object} folderData - The save folder data.
 * @param {string} folderData.name - The name of the save folder.
 * @param {string} folderData.type - The type of save (CAREER, SCIENCE, SANDBOX).
 * @param {string} folderData.version - The game version.
 * @param {HTMLElement} saveFolder - The game saveFolder element (parent to title).
 * @returns {HTMLElement} The generated <div> element.
 */
function createSaveFolderTitle(folderData, saveFolder) {
	// Create the folder title div
	const titleDiv = document.createElement("div");
	titleDiv.classList.add("save-folder-title");

	// Create the chevron icon from fontawesome
	const chevron = document.createElement("i");
	chevron.classList.add("fa-solid", "fa-chevron-down");
	titleDiv.appendChild(chevron);
	titleDiv.addEventListener("click", () => saveFolder.classList.toggle("closed"));

	// Create the <h2> for the folder name
	const title = document.createElement("h2");
	title.textContent = folderData.name;

	// Create the <p> for type and version info
	const info = document.createElement("p");
	info.textContent = `- ${folderData.type} - v${folderData.version}`;

	// Append title and info to the title div
	titleDiv.appendChild(title);
	titleDiv.appendChild(info);

	return titleDiv;
}

/**
 * Creates an <li> element for an SFS file entry.
 * @param {Object} sfsData - The SFS file data.
 * @param {string} sfsData.name - The name of the save file.
 * @param {string} sfsData.path - The full path to the save file.
 * @param {number} sfsData.science - The amount of science collected.
 * @param {number} sfsData.recordCount - The number of experiments recorded.
 * @returns {HTMLElement} The generated <li> element.
 */
function createSaveFileList(sfsData) {
	// Create the <li> element
	const saveFile = document.createElement("li");
	saveFile.classList.add("save-file");
	saveFile.dataset.path = sfsData.path; // Store the path in dataset

	// Create the <h3> for the title
	const title = document.createElement("h3");
	title.textContent = sfsData.name;

	// Create the <p> for science and experiments count
	const info = document.createElement("p");
	info.textContent = `Science: ${sfsData.science}  |  Experiments: ${sfsData.recordCount}`;

	// Create the chevron icon from fontawesome
	const chevron = document.createElement("i");
	chevron.classList.add("fa-solid", "fa-chevron-right");

	// Append elements to the <li>
	saveFile.appendChild(title);
	saveFile.appendChild(info);
	saveFile.appendChild(chevron);

	// Add click event listener to log the path from dataset
	saveFile.addEventListener("click", () => setSelected(saveFile));

	return saveFile;
}

// The html element of the currently selected save
var selectedSaveElement = null;

/**
 * Sets the selected save as the element in input, toggles the selected class correctly
 * and triggers the part that reads the file and shows the tables in the main.
 * @param {HTMLElement} saveFileElement the saveFile element that must be selected
 */
function setSelected(saveFileElement) {
	if (selectedSaveElement) selectedSaveElement.classList.remove("selected");

	if (selectedSaveElement === saveFileElement) {
		selectedSaveElement = null;
	} else {
		selectedSaveElement = saveFileElement;
		saveFileElement.classList.add("selected");
		console.log(saveFileElement.dataset.path);
	}
}
