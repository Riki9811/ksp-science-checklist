const themeToggle = document.getElementById("theme-toggle");

(async () => {
	const isDarkMode = await window.darkMode.isDark();
	themeToggle.innerHTML = isDarkMode ? "🌙" : "🌞";
})();

themeToggle.addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	themeToggle.innerHTML = isDarkMode ? "🌙" : "🌞";
});
