import { app, ipcMain } from "electron";
import { join } from "node:path";
import utils from "./utils/index.js";
import Schemas from "./data/schemas.js";
import Ajv from "ajv";

const ajv = new Ajv();
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

		const activities = await readJsonData(dataPath, "activities.json", Schemas.ACTIVITIES, window);
		const celestialBodies = await readJsonData(dataPath, "celestialBodies.json", Schemas.CELESTIAL_BODIES, window);
		const situations = await readJsonData(dataPath, "situations.json", Schemas.SITUATIONS, window);
		const deployedExperiments = await readJsonData(dataPath, "deployedExperiments.json", Schemas.DEPLOYED_EXP, window);

		jsonData = {
			activities,
			celestialBodies,
			situations,
			deployedExperiments
		};

		return jsonData;
	});
}

//#region HELPER FUNCTIONS
async function readJsonData(dataPath, fileName, schema, window) {
	const result = await utils.fileSystem.readFileContents(join(dataPath, fileName));

	if (result.code !== 0) {
		window.webContents.send("toasts/onBackendError", {
			title: "App Data Error",
			lines: [{ text: "Could not load: ", inLine: true }, { text: fileName, secondary: true, italic: true }, { text: "File either missing or not accessible" }]
		});
		return [];
	}

	const data = JSON.parse(result.content);
	const isValid = validateJsonResult(schema, data, fileName, window);

	return isValid ? data : [];
}

function validateJsonResult(schema, data, fileName, window) {
	const validate = ajv.compile(schema);

	if (!validate(data)) {
		window.webContents.send("toasts/onBackendWarning", {
			title: "Malformed JSON Data",
			lines: [
				{ text: "Invalid structure in: ", inLine: true },
				{ text: fileName, secondary: true, italic: true },
				...validate.errors.map((err) => {
					return { text: err.message, indented: true };
				}),
				{ text: "Data ignored due to validation failure." }
			]
		});
		return false;
	}

	return true;
}
//#endregion
