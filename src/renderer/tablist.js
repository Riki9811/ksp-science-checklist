const tabList = document.getElementById("tab-list");
const tabs = Array.from(tabList.getElementsByClassName("tab"));

// By default selected is kerbin (TODO: remember last selected)
/** @type {HTMLElement} The tab element currently selected */
var showingTab = document.getElementById("tab-kerbin");

// Scrolls horizontally with mousewheel
tabList.addEventListener("wheel", (event) => {
	event.preventDefault();

	tabList.scrollBy({
		left: event.deltaY < 0 ? -30 : 30
	});
});

tabs.forEach((tab) => {
	tab.addEventListener("click", onTabClick);
});

/**
 * Selects the tab that's been clicked on
 * @param {MouseEvent} evt the mouse click event
 */
function onTabClick(evt) {
	if (showingTab === evt.target) {
		return;
	}

	showingTab.classList.remove("active");
	showingTab = evt.target;
	showingTab.classList.add("active");

	content.onTabSelect(showingTab.dataset.body);
}
