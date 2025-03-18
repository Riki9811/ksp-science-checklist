(async () => {
	const saveList = document.getElementById("save-list");

	if (!saveList) return;

	const saveFiles = await window.api.getSaveFiles();

	saveFiles.forEach((filePath) => {
		const li = document.createElement("li");
		li.textContent = filePath.split(/[\\/]/).pop() || filePath;
		li.dataset.path = filePath;
		li.addEventListener("click", () => {
			console.log("Selected save:", filePath);
		});
		saveList.appendChild(li);
	});
})();
