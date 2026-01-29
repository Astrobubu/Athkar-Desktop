# أذكار المسلم - Tauri Version

A beautiful Islamic Athkar (remembrance) desktop widget built with **Tauri** (Rust + Web Technologies).

## Migration from Electron

This branch contains a complete migration from Electron to Tauri, offering:

- **Smaller bundle size**: Tauri apps are typically much smaller than Electron apps
- **Better performance**: Native Rust backend with minimal resource usage
- **Enhanced security**: Tight CSP controls and secure IPC communication
- **Native system integration**: Better Windows integration with system tray

## Project Structure

```
├── public/              # Frontend files (HTML, CSS, JS)
│   ├── index.html       # Main window
│   ├── settings.html    # Settings window
│   ├── main.js          # Main window logic
│   ├── settings.js      # Settings window logic
│   ├── styles.css       # Main styles
│   ├── settings-styles.css
│   └── athkar-data.json # Athkar data
├── src-tauri/           # Rust backend
│   ├── src/
│   │   ├── main.rs      # Entry point
│   │   └── lib.rs       # Main application logic
│   ├── capabilities/    # Tauri permissions
│   ├── icons/           # App icons
│   ├── Cargo.toml       # Rust dependencies
│   └── tauri.conf.json  # Tauri configuration
└── package.json         # Node dependencies
```

## Prerequisites

- [Rust](https://rustup.rs/) (1.77.2 or later)
- [Node.js](https://nodejs.org/) (18 or later)

## Development

Install dependencies:
```bash
npm install
```

Run in development mode:
```bash
npm run dev
```

## Building

Build the application:
```bash
npm run build
```

The installer will be available in `src-tauri/target/release/bundle/nsis/`.

## Features

- **Morning & Evening Athkar**: Complete collection of Islamic remembrances
- **Progress Tracking**: Track your daily dhikr progress
- **Counter**: Click to count or use keyboard shortcuts
- **Sound Effects**: Audio feedback on each count (optional)
- **Dark Mode**: Toggle between light and dark themes
- **Customizable Font Size**: Adjust text size to your preference
- **System Tray**: Minimize to tray and access from system menu
- **Persistent Settings**: Window position and preferences are saved
- **Auto-reset**: Progress resets every 6 hours

## Keyboard Shortcuts

- `Space` - Increment counter
- `→` (Right Arrow) - Next dhikr
- `←` (Left Arrow) - Previous dhikr

## Technical Details

### Frontend (JavaScript)
- Uses Tauri API for native integration
- Web Audio API for sound effects
- LocalStorage for progress persistence
- Feather Icons for UI icons

### Backend (Rust)
- Tauri v2 framework
- Store plugin for settings persistence
- Positioner plugin for window management
- Custom tray menu implementation

## License

MIT
