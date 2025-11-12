# ♟️ LiChesscom — Chess.com to Lichess Game Analyzer Chrome Extension

### Seamlessly transfer your Chess.com games to Lichess for free AI-powered analysis.

---

## 📖 Overview

**LiChesscom** is a lightweight Chrome extension that bridges the gap between **Chess.com** and **Lichess.org**.  
With a single click, it automatically imports your Chess.com game into Lichess’s analysis board — letting you review positions, mistakes, and tactics using Lichess’s free and open-source analysis tools.

This project showcases modern **Chrome Extension development** using JavaScript, HTML, and CSS — integrating with live browser tabs, DOM monitoring, and REST APIs for seamless automation.

---

## 🚀 Features

- **One-Click Transfer:** Instantly send your Chess.com game to Lichess with one button.  
- **Automatic PGN Capture:** Dynamically detects and extracts game data using the DOM.  
- **Lichess API Integration:** Securely imports PGN via the official Lichess API.  
- **Chrome Scripting & Tab Management:** Injects and executes scripts in active browser tabs.  
- **Minimal UI:** Clean popup interface for a smooth user experience.

---

## 🧩 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **JavaScript (ES6)** | Core scripting logic and Chrome API interaction |
| **HTML5 / CSS3** | Popup interface and UI design |
| **Chrome Extension API (Manifest v3)** | Permissions, popup configuration, and script injection |
| **MutationObserver API** | Detects live changes on Chess.com for game links |
| **Lichess.org REST API** | PGN import and free engine analysis |
| **Firebase Auth (planned)** | Setup for potential authentication and user session features |

---

## 🧠 How It Works

1. When the **“Transfer Analysis”** button is clicked:
   - The extension injects a content script into the active Chess.com tab.
   - The script observes DOM mutations to detect newly generated PGN links.
   - Once a PGN is found, it’s sent to the **Lichess import endpoint**.
   - The analyzed game opens automatically in a new tab.

2. Uses **Chrome’s Scripting API** to safely run the code in browser context.

3. All actions occur **locally** — no data storage, tracking, or account creation required.

---

## 📦 Project Structure

```
LiChesscom/
├── main.html          # Popup interface (UI)
├── main.css           # Styling for the popup
├── script.js          # Core automation and logic
├── manifest.json      # Chrome extension configuration (Manifest v3)
├── package.json       # Firebase dependency (for future use)
└── icons/             # Extension icons (rook set)
```

---

## ⚙️ Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/lichesscom.git
   ```
2. Open Chrome and go to:
   ```
   https://chromewebstore.google.com/detail/lichesscom/jmknpincljfjkkljahbflgideobafdmo
   ```
3. Enable **Developer mode** (top-right corner).
4. Click **Load unpacked** and select the project folder.
5. Navigate to a Chess.com game.
6. Open the extension popup and click **“Transfer Analysis”**.

