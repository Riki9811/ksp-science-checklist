import { app, shell } from "electron";

const isMac = process.platform === "darwin";

const Menu_Template = [
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
			{ label: "Refresh Current", click: () => console.log("refresh current"), accelerator: "CommandOrControl+r" },
			{ label: "Refresh All", click: () => console.log("refresh all"), accelerator: "CommandOrControl+Shift+r" },
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
						{ role: "reload", accelerator: "CommandOrControl+Alt+r" },
						{ role: "forceReload", accelerator: "CommandOrControl+Alt+Shift+r" },
						{ role: "toggleDevTools" },
						{ type: "separator" }
				  ]
				: []),
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
			{ role: "zoom" },
			...(isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }])
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

function convertToWindows(template) {
	return template.map(convertMenuItem);
}

function convertMenuItem(menu_item) {
	if (menu_item.type && menu_item.type == "separator") return menu_item;

	const hasSubmenu = menu_item.submenu?.length >= 0;
	const label = menu_item.role ?? menu_item.label;
	const accelerator = menu_item.accelerator;
	return hasSubmenu ? { label, accelerator, submenu: menu_item.submenu.map(convertMenuItem) } : { label, accelerator };
}

export default { default: Menu_Template, convertToWindows };
