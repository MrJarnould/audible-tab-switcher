# Find Audible Tabs - Chrome Extension

A simple Chrome extension that helps you find tabs that are currently playing audio.

## Features

- Lists all tabs that are currently playing audio with their favicon and title
- Click any tab in the list to switch to it
- Keyboard shortcut to cycle through audible tabs without opening the popup
- Cycle button in the popup to step through audible tabs one by one
- The keyboard shortcut, cycle button, and external URL all share the same cycle position
- Shortcut display in the popup reflects your current configuration
- Clean, minimal interface
- External access for integration with tools like SketchyBar

## Project Structure

```text
find-audible-tabs-extension/
├── manifest.json           # Extension configuration
├── src/                    # Source code
│   ├── popup.html          # Main popup HTML
│   ├── cycle.html          # External trigger page
│   ├── css/                # Stylesheets
│   │   └── popup.css       # Popup styling
│   ├── js/                 # JavaScript files
│   │   ├── popup.js        # Popup functionality
│   │   ├── background.js   # Background script for shortcuts
│   │   └── cycle.js        # External trigger script
│   └── assets/             # Images and icons
│       ├── icon16.png      # 16x16 icon
│       ├── icon48.png      # 48x48 icon
│       ├── icon128.png     # 128x128 icon
│       └── default-favicon.png # Default favicon fallback
```

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar
6. Note your extension ID from the extensions page (you'll need it for external integrations)

## Usage

### Popup Interface

Click on the extension icon in your toolbar to see a list of all tabs currently playing audio. Each tab is shown with its favicon and title. Click any tab in the list to switch to it, or use the "Cycle Through Audible Tabs" button to advance through them in sequence.

The popup displays your currently configured keyboard shortcut. Hovering over it shows a tooltip with instructions for changing it.

### Keyboard Shortcut

The default shortcut is `Cmd+Shift+A` on Mac and `Ctrl+Shift+A` on Windows/Linux. Each press advances to the next audible tab in sequence, cycling back to the first after the last. The shortcut, popup cycle button, and external URL all share the same position in the cycle.

### Customizing the Keyboard Shortcut

1. Go to `chrome://extensions/shortcuts` in Chrome
2. Find "Audible Tab Switcher" in the list
3. Click the pencil icon next to "Switch to the audible tab"
4. Press your desired key combination
5. Click "OK" to save

## External Integration (SketchyBar)

You can trigger the extension from external applications like SketchyBar using the `cycle.html` page:

```bash
#!/bin/bash
# SketchyBar script to cycle to the next audible Chrome tab
open -a "Google Chrome" "chrome-extension://YOUR_EXTENSION_ID/src/cycle.html#cycle"
```

Replace `YOUR_EXTENSION_ID` with your actual extension ID from `chrome://extensions/`. When opened, the page advances the cycle to the next audible tab and closes itself automatically.

Alternatively, you can trigger the cycle by sending a keystroke directly:

```bash
#!/bin/bash
# Adjust the keystroke to match your configured shortcut
osascript -e 'tell application "Google Chrome" to activate' \
          -e 'tell application "System Events" to keystroke "a" using {command down, shift down}'
```
