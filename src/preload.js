const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getSaves: () => ipcRenderer.invoke("getSaves"),
	onSavesLoaded: (callback) => ipcRenderer.on("savesLoaded", (_, saves) => callback(saves))
});

contextBridge.exposeInMainWorld("darkMode", {
	toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	reset: () => ipcRenderer.invoke("dark-mode:reset"),
	isDark: () => ipcRenderer.invoke("dark-mode:is-dark")
});

contextBridge.exposeInMainWorld("app", {
	minimize: () => ipcRenderer.send("window/minimize"),
	maximize: () => ipcRenderer.send("window/maximize"),
	unmaximize: () => ipcRenderer.send("window/unmaximize"),
	close: () => ipcRenderer.send("window/close"),

	isMaximized: () => ipcRenderer.send("window/isMaximized"),

	onMaximize: (callback) => {
		ipcRenderer.on("window/onMaximize", callback);
	},
	onUnmaximize: (callback) => {
		ipcRenderer.on("window/onUnmaximize", callback);
	}
});

contextBridge.exposeInMainWorld("content", {
	onSaveSelect: (selectedSave) => ipcRenderer.send("onSaveSelect", selectedSave),
	onTabSelect: (selectedTab) => ipcRenderer.send("onTabSelect", selectedTab),

	// Allows content.js to listen for updates
	onUpdateContent: (callback) => ipcRenderer.on("updateContent", (_, data) => callback(data))
});
