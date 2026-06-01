// popup.js

function switchToTab(tab) {
	chrome.tabs.update(tab.id, { active: true }, () => {
		if (chrome.runtime.lastError) return;
		chrome.windows.update(tab.windowId, { focused: true }, () => {
			window.close();
		});
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const cycleButton = document.getElementById("cycle-button");
	const tabList = document.getElementById("audible-tabs");
	const noAudible = document.getElementById("no-audible");
	const shortcutInfo = document.getElementById("shortcut-info");

	chrome.commands.getAll((commands) => {
		const cmd = commands.find((c) => c.name === "switch-to-audible-tab");
		const shortcut = cmd?.shortcut;
		shortcutInfo.title = "To customize, navigate to chrome://extensions/shortcuts";

		if (shortcut) {
			const keys = shortcut.split("+").map((k) => k === "Command" ? "Cmd" : k);
			shortcutInfo.innerHTML = "Shortcut: " + keys.map((k) => `<kbd>${k}</kbd>`).join("+");
		} else {
			const msg = document.createElement("span");
			msg.className = "no-shortcut-msg";
			msg.textContent = "No shortcut set";
			shortcutInfo.appendChild(msg);
		}
	});

	cycleButton.addEventListener("click", () => {
		chrome.runtime.sendMessage({ action: "switchToAudibleTab" }, () => {
			window.close();
		});
	});

	chrome.tabs.query({ audible: true }, (tabs) => {
		if (tabs.length === 0) {
			noAudible.classList.add("visible");
			return;
		}

		cycleButton.disabled = false;

		tabs.forEach((tab) => {
			const li = document.createElement("li");

			const img = document.createElement("img");
			img.className = "favicon";
			img.src = tab.favIconUrl || "assets/default-favicon.png";
			img.onerror = () => { img.src = "assets/default-favicon.png"; };

			const span = document.createElement("span");
			span.className = "tab-title";
			span.textContent = tab.title;

			li.appendChild(img);
			li.appendChild(span);
			li.addEventListener("click", () => switchToTab(tab));
			tabList.appendChild(li);
		});
	});
});
