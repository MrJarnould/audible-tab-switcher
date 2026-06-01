// background.js

// Cycle to the next audible tab, remembering the last tab switched to across
// all trigger mechanisms (keyboard shortcut, popup button, external URL).
// Tabs are sorted by ID for a stable, deterministic cycle order.
function switchToAudibleTab(onDone) {
	chrome.tabs.query({ audible: true }, (audibleTabs) => {
		if (audibleTabs.length === 0) {
			onDone?.();
			return;
		}

		audibleTabs.sort((a, b) => a.id - b.id);

		chrome.storage.session.get("lastAudibleTabId", ({ lastAudibleTabId }) => {
			const currentIndex = audibleTabs.findIndex((t) => t.id === lastAudibleTabId);
			const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % audibleTabs.length;
			const tab = audibleTabs[nextIndex];

			chrome.storage.session.set({ lastAudibleTabId: tab.id });

			chrome.tabs.update(tab.id, { active: true }, () => {
				if (chrome.runtime.lastError) {
					onDone?.();
					return;
				}
				chrome.windows.update(tab.windowId, { focused: true }, () => {
					onDone?.();
				});
			});
		});
	});
}

// Handle messages from anywhere (popup, externally, etc.)
function handleMessage(request, sender, sendResponse) {
	if (request.action === "switchToAudibleTab") {
		switchToAudibleTab(() => sendResponse({ success: true }));
		return true; // keep message channel open for async response
	}
}

// Listen for internal messages
chrome.runtime.onMessage.addListener(handleMessage);

// Listen for external messages
chrome.runtime.onMessageExternal.addListener(handleMessage);

// Listen for command shortcut
chrome.commands.onCommand.addListener((command) => {
	if (command === "switch-to-audible-tab") {
		switchToAudibleTab();
	}
});
