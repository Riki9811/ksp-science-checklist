const themeToggle = document.getElementById("theme-toggle");

(async () => {
	const isDarkMode = await window.darkMode.isDark();
	themeToggle.innerHTML = isDarkMode ? "🌙" : "🌞";
	setTitleBarOverlay();
})();

themeToggle.addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	themeToggle.innerHTML = isDarkMode ? "🌙" : "🌞";
	setTitleBarOverlay();
});

function setTitleBarOverlay() {
	const style = window.getComputedStyle(document.body);

	const bgCol = style.getPropertyValue("--bgCol-main");
	const textCol = style.getPropertyValue("--textCol");

	window.darkMode.setTitleBarOverlay({ color: bgCol, symbolColor: textCol });
}
