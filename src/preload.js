const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getSaves: () => ipcRenderer.invoke("get-saves")
});

contextBridge.exposeInMainWorld("darkMode", {
    toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	reset: () => ipcRenderer.invoke("dark-mode:reset"),
    isDark: () => ipcRenderer.invoke("dark-mode:is-dark")
});
