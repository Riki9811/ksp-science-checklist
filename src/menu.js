import { app, shell, Menu, ipcMain, BrowserWindow } from "electron";

const isMac = process.platform === "darwin";

const DefaultTemplate = [
	// { role: 'appMenu' }
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{ role: "about" },
						{ type: "separator" },
						{ role: "services" },
						{ type: "separator" },
						{ role: "hide" },
						{ role: "hideOthers" },
						{ role: "unhide" },
						{ type: "separator" },
						{ role: "quit" }
					]
				}
		  ]
		: []),
	// { role: 'fileMenu' }
	{
		label: "File",
		submenu: [
			{
				label: "Refresh Current",
				click: clickRefreshCurrent,
				...(process.env.NODE_ENV !== "development" ? { accelerator: "CommandOrControl+r" } : {})
			},
			{
				label: "Refresh All",
				click: clickRefreshAll,
				...(process.env.NODE_ENV !== "development" ? { accelerator: "CommandOrControl+Shift+r" } : {})
			},
			isMac ? { role: "close" } : { role: "quit" }
		]
	},
	// { role: 'editMenu' }
	{
		label: "Edit",
		submenu: [
			{ role: "copy" },
			{ role: "paste" },
			...(isMac
				? [
						{ role: "pasteAndMatchStyle" },
						{ role: "selectAll" },
						{ type: "separator" },
						{
							label: "Speech",
							submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }]
						}
				  ]
				: [{ type: "separator" }, { role: "selectAll" }])
		]
	},
	// { role: 'viewMenu' }
	{
		label: "View",
		submenu: [
			...(process.env.NODE_ENV === "development"
				? [
						{ role: "reload", accelerator: "CommandOrControl+r" },
						{ role: "forceReload", accelerator: "CommandOrControl+Shift+r" },
						{ role: "toggleDevTools" },
						{ type: "separator" }
				  ]
				: []),
			{ label: "Toggle Sidebar", accelerator: "CommandOrControl+b", click: clickToggleSidebar },
			{ type: "separator" },
			{ role: "resetZoom" },
			{ role: "zoomIn" },
			{ role: "zoomOut" },
			{ type: "separator" },
			{ role: "togglefullscreen" }
		]
	},
	// { role: 'windowMenu' }
	{
		label: "Window",
		submenu: [
			{ role: "minimize" },
			...(isMac ? [{ role: "zoom" }, { type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }])
		]
	},
	// { role: 'help' }
	{
		role: "help",
		submenu: [
			{
				label: "Learn More",
				click: async () => {
					await shell.openExternal("https://github.com/Riki9811/ksp-science-checklist");
				}
			},
			{
				label: "Report a bug",
				click: async () => {
					await shell.openExternal("https://github.com/Riki9811/ksp-science-checklist/issues");
				}
			}
		]
	}
];

function registerMenuHandlers() {
	ipcMain.handle("getApplicationMenu", () => {
		const appMenu = Menu.getApplicationMenu();
		return JSON.parse(JSON.stringify(appMenu, (key, value) => (key !== "commandsMap" && key !== "menu" ? value : undefined)));
	});

	ipcMain.on("menu-event", (event, commandId) => {
		const item = getMenuItemByCommandId(commandId, Menu.getApplicationMenu());
		if (item) item.click(undefined, BrowserWindow.fromWebContents(event.sender), event.sender);
	});
}

function getMenuItemByCommandId(commandId, menu) {
	if (!menu) return undefined;

	for (const item of menu.items) {
		if (item.submenu) {
			const submenuItem = getMenuItemByCommandId(commandId, item.submenu);
			if (submenuItem) return submenuItem;
		} else if (item.commandId === commandId) return item;
	}

	return undefined;
}

function clickToggleSidebar(menuItem, window, event) {
	window.webContents.send("view/onToggleSidebar");
}

function clickRefreshCurrent(menuItem, window, event) {
	window.webContents.send("content/refreshCurrent");
}

function clickRefreshAll(menuItem, window, event) {
	window.webContents.send("content/refreshAll");
}

export default { template: DefaultTemplate, registerMenuHandlers };
