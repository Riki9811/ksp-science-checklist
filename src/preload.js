const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getSaveFiles: () => ipcRenderer.invoke("get-save-files")
});