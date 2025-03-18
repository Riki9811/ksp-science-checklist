const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getSaves: () => ipcRenderer.invoke("get-saves")
});