document.addEventListener("DOMContentLoaded", () => {
	if (window.location.hash === "#cycle") {
		chrome.runtime.sendMessage(
			{ action: "switchToAudibleTab" },
			(response) => {
				console.log("Cycle triggered. Response:", response);

				chrome.tabs.query(
					{ url: `chrome-extension://${chrome.runtime.id}/src/cycle.html*` },
					(tabs) => {
						tabs.forEach((extTab) => {
							chrome.tabs.remove(extTab.id, () => {
								if (chrome.runtime.lastError) { /* tab already gone */ }
							});
						});
					}
				);
			}
		);
	}
});
