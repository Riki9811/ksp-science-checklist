import PopupToast from "../components/PopupToast.js";
import "./content.js";
import "./sidebar.js";
import "./tablist.js";
import "./themeButton.js";
import "./titlebar.js";
import "./resizer.js";

// Register toast events to make them callable from the node back-end
api.onBackendInfo((data) => PopupToast.showInfo(data.title, data.lines, data.timeout));
api.onBackendSuccess((data) => PopupToast.showSuccess(data.title, data.lines, data.timeout));
api.onBackendWarning((data) => PopupToast.showWarning(data.title, data.lines, data.timeout));
api.onBackendError((data) => PopupToast.showError(data.title, data.lines, data.timeout));
