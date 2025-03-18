(async () => {
	const saveList = document.getElementById("save-list");

	if (!saveList) return;

	const saves = await window.api.getSaves();

	saves.forEach((save) => {
        const li = document.createElement("li");
        li.textContent = save[0].split(/[\\/]/).slice(-2,-1).pop() || save[0];
		const ul = document.createElement("ul");

		save.forEach((sfsFile) => {
			const li = document.createElement("li");
			li.textContent = sfsFile.split(/[\\/]/).pop() || sfsFile;
			li.dataset.path = sfsFile;
			li.addEventListener("click", () => {
				console.log("Selected save:", sfsFile);
			});
			ul.appendChild(li);
		});

		li.appendChild(ul);
		saveList.appendChild(li);
	});
})();
