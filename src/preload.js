const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getRawFolders: () => ipcRenderer.invoke("getRawFolders"),
	exploreFolder: (folderPath) => ipcRenderer.invoke("exploreFolder", folderPath),
	getJsonData: () => ipcRenderer.invoke("getJsonData"),

	onBackendInfo: (callback) => {
		ipcRenderer.on("toasts/onBackendInfo", (_, data) => callback(data));
	},
	onBackendSuccess: (callback) => {
		ipcRenderer.on("toasts/onBackendSuccess", (_, data) => callback(data));
	},
	onBackendWarning: (callback) => {
		ipcRenderer.on("toasts/onBackendWarning", (_, data) => callback(data));
	},
	onBackendError: (callback) => {
		ipcRenderer.on("toasts/onBackendError", (_, data) => callback(data));
	}
});

contextBridge.exposeInMainWorld("darkMode", {
	toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	reset: () => ipcRenderer.invoke("dark-mode:reset"),
	isDark: () => ipcRenderer.invoke("dark-mode:is-dark"),
	setTitleBarOverlay: (options) => ipcRenderer.send("dark-mode:setTitleBarOverlay", options)
});

contextBridge.exposeInMainWorld("app", {
	minimize: () => ipcRenderer.send("window/minimize"),
	maximize: () => ipcRenderer.send("window/maximize"),
	unmaximize: () => ipcRenderer.send("window/unmaximize"),
	close: () => ipcRenderer.send("window/close"),

	isMaximized: () => ipcRenderer.invoke("window/isMaximized"),
	isFullScreen: () => ipcRenderer.invoke("window/isFullScreen"),

	onMaximize: (callback) => {
		ipcRenderer.on("window/onMaximize", callback);
	},
	onUnmaximize: (callback) => {
		ipcRenderer.on("window/onUnmaximize", callback);
	},
	onEnterFullScreen: (callback) => {
		ipcRenderer.on("window/onEnterFullScreen", callback);
	},
	onLeaveFullScreen: (callback) => {
		ipcRenderer.on("window/onLeaveFullScreen", callback);
	},
	onWindowResize: (callback) => {
		ipcRenderer.on("window/onWindowResize", callback);
	},

	isMacOs: () => ipcRenderer.invoke("isMacOs"),
	isLinux: () => ipcRenderer.invoke("isLinux"),

	showAboutPanel: () => ipcRenderer.send("showAboutPanel"),

	onToggleSidebar: (callback) => {
		ipcRenderer.on("view/onToggleSidebar", callback);
	}
});

contextBridge.exposeInMainWorld("content", {
	onSaveSelect: (selectedSave) => ipcRenderer.send("onSaveSelect", selectedSave),
	onTabSelect: (selectedTab) => ipcRenderer.send("onTabSelect", selectedTab),

	onUpdateContent: (callback) => ipcRenderer.on("updateContent", (_, data) => callback(data)),

	onRefreshCurrent: (callback) => ipcRenderer.on("content/refreshCurrent", callback),
	onRefreshAll: (callback) => ipcRenderer.on("content/refreshAll", callback)
});

contextBridge.exposeInMainWorld("menu", {
	getApplicationMenu: () => ipcRenderer.invoke("getApplicationMenu"),
	sendMenuEvent: (commandId) => ipcRenderer.send("menu-event", commandId)
});
