const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getSaves: () => ipcRenderer.invoke("get-saves"),
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
