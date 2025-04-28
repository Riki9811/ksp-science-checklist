import { app, ipcMain } from "electron";
import { join } from "node:path";
import utils from "./utils/index.js";

var jsonData = undefined;

export function registerContentHandlers(window) {
	// Handle tab selection and notify all renderer processes
	ipcMain.on("onTabSelect", (_, selectedTab) => {
		window.webContents.send("updateContent", { type: "tab", value: selectedTab });
	});

	// Handle save file selection and notify all renderer processes
	ipcMain.on("onSaveSelect", (_, selectedSave) => {
		window.webContents.send("updateContent", { type: "save", value: selectedSave });
	});

	ipcMain.handle("getJsonData", async () => {
		if (jsonData) return jsonData;

		const dataPath = join(app.getAppPath(), "src", "data");

		const activitiesResult = await utils.fileSystem.readFileContents(join(dataPath, "activities.json"));
		const celestialBodiesResult = await utils.fileSystem.readFileContents(join(dataPath, "celestialBodies.json"));
		const situationsResult = await utils.fileSystem.readFileContents(join(dataPath, "situations.json"));
		const deployedExperimentsResult = await utils.fileSystem.readFileContents(join(dataPath, "deployedExperiments.json"));

		if (activitiesResult.code !== 0) {
			window.webContents.send("toasts/onBackendError", {
				title: "App Data Error",
				lines: [
					{ text: "Could not load: ", inLine: true },
					{ text: "activities.json", secondary: true, italic: true },
					{ text: "File either missing or not accessible" }
				]
			});
		}
		if (celestialBodiesResult.code !== 0) {
			window.webContents.send("toasts/onBackendError", {
				title: "App Data Error",
				lines: [
					{ text: "Could not load: ", inLine: true },
					{ text: "celestialBodies.json", secondary: true, italic: true },
					{ text: "File either missing or not accessible" }
				]
			});
		}
		if (situationsResult.code !== 0) {
			window.webContents.send("toasts/onBackendError", {
				title: "App Data Error",
				lines: [
					{ text: "Could not load: ", inLine: true },
					{ text: "situations.json", secondary: true, italic: true },
					{ text: "File either missing or not accessible" }
				]
			});
		}
		if (deployedExperimentsResult.code !== 0) {
			window.webContents.send("toasts/onBackendError", {
				title: "App Data Error",
				lines: [
					{ text: "Could not load: ", inLine: true },
					{ text: "deployedExperiments.json", secondary: true, italic: true },
					{ text: "File either missing or not accessible" }
				]
			});
		}

		// TODO: implement validation (json has correct structure?)
		jsonData = {
			activities: JSON.parse(activitiesResult.content),
			celestialBodies: JSON.parse(celestialBodiesResult.content),
			situations: JSON.parse(situationsResult.content),
			deployedExperiments: JSON.parse(deployedExperimentsResult.content)
		};

		return jsonData;
	});
}
