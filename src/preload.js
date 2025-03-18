const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getSaves: () => ipcRenderer.invoke("get-saves")
});

contextBridge.exposeInMainWorld("electron", {
    getTheme: () => ipcRenderer.invoke("get-theme"),
    setTheme: (theme) => ipcRenderer.send("set-theme", theme),
});