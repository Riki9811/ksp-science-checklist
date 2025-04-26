import { join, basename } from "node:path";

export const getRawFolderErrors = (kspInstallDir) => ({
	1: {
		title: "KSP Install Directory Error",
		lines: [
			{ text: "No 'saves' folder found inside:" },
			{ text: `${kspInstallDir}`, indented: true, secondary: true, italic: true },
			{ text: "Please check that the path provided as the KSP install directory is correct." }
		]
	},
	2: {
		title: "KSP Install Directory Error",
		lines: [
			{ text: "Could not access:" },
			{ text: `${join(kspInstallDir, "saves")}`, indented: true, secondary: true, italic: true },
			{
				text: "Please ensure 'read' permissions are available or try running the program as an administrator."
			}
		]
	},
	3: {
		title: "KSP Install Directory Error",
		lines: [
			{ text: "KSP Install path is not a folder:" },
			{ text: `${kspInstallDir}`, indented: true, secondary: true, italic: true },
			{ text: "Please verify the path and try refreshing." }
		]
	},
	"-1": { title: "KSP Install Directory Error", lines: "Unkown error occurred. ¯\\_(ツ)_/¯" }
});

export const getExploreFolderErrors = (sfsPath) => ({
	1: {
		title: "File Read Error",
		lines: [{ text: "File: ", inLine: true }, { text: `${basename(sfsPath)}`, secondary: true, italic: true, inLine: true }, { text: " does not exist." }]
	},
	2: {
		title: "File Read Error",
		lines: [
			{ text: "Could not access: ", inLine: true },
			{ text: `${sfsPath}`, secondary: true, italic: true },
			{
				text: "Please ensure 'read' permissions are available or try running the program as an administrator."
			}
		]
	},
	"-1": { title: "File Read Error", lines: "Unkown error occurred. ¯\\_(ツ)_/¯" }
});
