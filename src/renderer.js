//#region Save list creation
const saveList = document.getElementById("save-list");

(async () => {
	if (!saveList) return;

	// const saves = await window.api.getSaves();
	const saves = [
		{
			name: "All science",
			type: "SCIENCE",
			version: "1.12.5",
			sfsFiles: [
				{
					name: "persistent.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\All science\\persistent.sfs",
					science: 1000,
					recordCount: 100
				},
				{
					name: "quicksave.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\All science\\quicksave.sfs",
					science: 1000,
					recordCount: 100
				}
			]
		},
		{
			name: "Andrea",
			type: "CAREER",
			version: "1.12.5",
			sfsFiles: [
				{
					name: "persistent.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Andrea\\persistent.sfs",
					science: 1000,
					recordCount: 100
				}
			]
		},
		{
			name: "Riccardo",
			type: "CAREER",
			version: "1.12.5",
			sfsFiles: [
				{
					name: "persistent.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Riccardo\\persistent.sfs",
					science: 1000,
					recordCount: 100
				},
				{
					name: "quicksave.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Riccardo\\quicksave.sfs",
					science: 1000,
					recordCount: 100
				}
			]
		},
		{
			name: "Testing Facilities",
			type: "SCIENCE",
			version: "1.12.5",
			sfsFiles: [
				{
					name: "BEFORE LAUNCH.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Testing Facilities\\BEFORE LAUNCH.sfs",
					science: 1000,
					recordCount: 100
				},
				{
					name: "Before WARP.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Testing Facilities\\Before WARP.sfs",
					science: 1000,
					recordCount: 100
				},
				{
					name: "persistent.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Testing Facilities\\persistent.sfs",
					science: 1000,
					recordCount: 100
				},
				{
					name: "quicksave #1.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Testing Facilities\\quicksave #1.sfs",
					science: 1000,
					recordCount: 100
				},
				{
					name: "quicksave.sfs",
					path: "D:\\Steam\\steamapps\\common\\Kerbal Space Program\\saves\\Testing Facilities\\quicksave.sfs",
					science: 1000,
					recordCount: 100
				}
			]
		}
	];

	saves.forEach((save) => {
		const folderItem = createSfsFolderItem(save);
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
function createSfsFolderItem(folderData) {
	// Create the <li> element
	const li = document.createElement("li");
	li.classList.add("save-folder");
	li.classList.add("closed"); // Closed by default

	// Create the folder title div
	const titleDiv = document.createElement("div");
	titleDiv.classList.add("save-folder-title");

	// Create the <h2> for the folder name
	const title = document.createElement("h2");
	title.textContent = folderData.name;

	// Create the <p> for type and version info
	const info = document.createElement("p");
	info.textContent = `- ${folderData.type} - v${folderData.version}`;

	// Append title and info to the title div
	titleDiv.appendChild(title);
	titleDiv.appendChild(info);

	// Create the <ol> list for SFS files
	const ol = document.createElement("ol");
	ol.classList.add("save-file-list");

	// Generate <li> items for each SFS file and append them to the <ol>
	folderData.sfsFiles.forEach((sfsFile) => {
		const sfsItem = createSfsListItem(sfsFile);
		ol.appendChild(sfsItem);
	});

	// Append the title div and list to the folder <li>
	li.appendChild(titleDiv);
	li.appendChild(ol);

	return li;
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
function createSfsListItem(sfsData) {
	// Create the <li> element
	const li = document.createElement("li");
	li.classList.add("save-file");
	li.dataset.path = sfsData.path; // Store the path in dataset

	// Create the <h3> for the title
	const title = document.createElement("h3");
	title.textContent = sfsData.name;

	// Create the <p> for science and experiments count
	const info = document.createElement("p");
	info.textContent = `Science: ${sfsData.science}  |  Experiments: ${sfsData.recordCount}`;

	// Append elements to the <li>
	li.appendChild(title);
	li.appendChild(info);

	// Add click event listener to log the path from dataset
	li.addEventListener("click", () => {
		console.log(`Save file path: ${li.dataset.path}`);
	});

	return li;
}
//#endregion

//#region Theme
const themeToggle = document.getElementById("theme-toggle");

(async () => {
	const isDarkMode = await window.darkMode.isDark();
	themeToggle.innerHTML = isDarkMode ? "🌙" : "🌞";
})();

themeToggle.addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	themeToggle.innerHTML = isDarkMode ? "🌙" : "🌞";
});
//#endregion
