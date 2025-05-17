const resizer = document.getElementById("resizer");
const sidebar = document.getElementById("sidebar");

let dragging = false;
let startX = 0;
let startWidth = 0;
let minWidth = 130;
let maxWidth = 500;

resizer.addEventListener("mousedown", startDrag);

function startDrag(evt) {
	// Define starting variables
	dragging = true;
	startX = evt.clientX;
	startWidth = getSidebarWidth();
	maxWidth = Math.floor((window.innerWidth / 3) * 2);

	// Listen to mouse movement and end of drag
	window.addEventListener("mousemove", resizeByMouse);
	window.addEventListener("mouseup", endDrag);

	// Correctly style the cursor
	if (startWidth === minWidth) document.body.style.cursor = "e-resize";
	else if (startWidth === maxWidth) document.body.style.cursor = "w-resize";
	else document.body.style.cursor = "col-resize";
}

function endDrag() {
	// Set variable as not dragging
	dragging = true;

	// Remove listeners
	window.removeEventListener("mousemove", resizeByMouse);
	window.removeEventListener("mouseup", endDrag);

	// Correctly style the cursor
	document.body.style.cursor = "";
}

function resizeByMouse(evt) {
	// If the variable is not set we should not be resizing
	if (!dragging) {
		endDrag();
		return;
	}

	let neededCursor = "col-resize";

	// Calculate new size for sidebar
	let newWidth = evt.clientX - startX + startWidth;
	// Clamp between limits
	if (newWidth < minWidth) {
		neededCursor = "e-resize";
		newWidth = minWidth;
	} else if (newWidth > maxWidth) {
		neededCursor = "w-resize";
		newWidth = maxWidth;
	}
	// Apply new size
	setSidebarWidth(newWidth);

	// Correctly style the cursor
	document.body.style.cursor = neededCursor;
	resizer.style.cursor = neededCursor == "col-resize" ? "" : neededCursor;
}

function getSidebarWidth() {
	// Get the css variable --sidebar-width
	const style = window.getComputedStyle(document.body);
	const cssVar = style.getPropertyValue("--sidebar-width");

	return parseInt(cssVar.replace("px", ""));
}

function setSidebarWidth(width) {
	document.body.style.setProperty("--sidebar-width", width + "px");
}

// Register sidebar toggle
app.onToggleSidebar(() => toggle());

function toggle() {
	if (sidebar.classList.contains("closed")) {
		resizer.style.width = "";
		setSidebarWidth(clampWidthInRange(startWidth));
	} else {
		resizer.style.width = "0px";
		startWidth = getSidebarWidth();
		setSidebarWidth(0);
	}

	sidebar.classList.toggle("closed");
}

// Register window resize event
app.onWindowResize(() => windowResize());

function windowResize() {
	maxWidth = Math.floor((window.innerWidth / 3) * 2);

	if (!sidebar.classList.contains("closed")) {
		const currWidth = getSidebarWidth();

		if (currWidth > maxWidth) {
			setSidebarWidth(maxWidth);
		} else if (currWidth < minWidth) {
			setSidebarWidth(minWidth);
		}
	}
}

function clampWidthInRange(width) {
	maxWidth = Math.floor((window.innerWidth / 3) * 2);

	return Math.max(minWidth, Math.min(width, maxWidth));
}
