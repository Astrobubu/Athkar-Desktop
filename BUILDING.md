# Building the Installer

## Quick Start

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Test the app
npm start

# 3. Build the installer
npm run dist
```

## What You'll Get

After running `npm run dist`, you'll find in the `dist/` folder:
- `أذكار المسلم Setup 1.0.0.exe` - The installer file

## Installer Features

- **No Admin Required** - Installs to user directory
- **Desktop Shortcut** - Creates a desktop icon
- **Start Menu** - Adds to Windows Start Menu
- **Uninstaller** - Includes uninstall option
- **Auto-start** - Option to run on Windows startup (user configurable)

## System Tray

The app runs in the system tray. Features:
- **Right-click menu**:
  - إظهار (Show) - Show window
  - إخفاء (Hide) - Hide window
  - الإعدادات (Settings) - Open settings
  - خروج (Quit) - Exit app

- **Double-click** - Toggle show/hide window

- **Close button (✕)** - Hides to tray (doesn't quit)

## Technical Notes

### Icon Requirements
The app uses `assets/icon.png` for all icons:
- Window icon
- Tray icon (converted to base64 in code)
- Installer icon
- Desktop shortcut icon

### Build Configuration
See `package.json` under the `build` section for:
- App ID: `com.athkar.desktop`
- Product Name: `أذكار المسلم`
- Target: Windows x64 NSIS installer

### File Size
Final installer size: ~100-150 MB (includes Electron runtime)

### Windows Compatibility
- Windows 10/11 (x64)
- Windows 7/8 (may work but untested)

## Distribution

To distribute your app:
1. Build the installer: `npm run dist`
2. Find the .exe in `dist/` folder
3. Upload to your hosting/GitHub releases
4. Users download and run the installer
5. App installs and creates shortcuts automatically

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Delete `node_modules` and `dist` folders, then reinstall: `npm install`
- Check that `assets/icon.png` exists

### App Won't Start
- Check Windows Defender/Antivirus isn't blocking it
- Try running as administrator (though shouldn't be needed)
- Check console for errors

### Tray Icon Missing
- Icon loads from base64 data in code, should always work
- If missing, restart the app

## Development

```bash
# Run with dev tools open
npm start

# Build without installer (portable)
npm run build

# Clean build
rm -rf dist node_modules
npm install
npm run dist
```

## Updates

To release a new version:
1. Update version in `package.json`
2. Make your changes
3. Run `npm run dist`
4. Distribute new installer

Users will need to uninstall old version and install new one (or overwrite install).

---

May this app benefit you and all Muslims. Ameen.
