# Build Instructions for Athkar Desktop

## Prerequisites
- Node.js installed
- npm or yarn package manager

## Building the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Windows
```bash
npm run dist
```

This will create an installer in the `dist` folder.

### 3. Run in Development
```bash
npm start
```

## Icon Setup
The app icon is located at `assets/icon.png`. The build process will automatically use this icon for:
- Application window icon
- System tray icon
- Installer icon
- Desktop shortcut icon

## Features
- **System Tray**: App runs in system tray with show/hide/quit menu
- **Dark Mode**: Automatic theme switching
- **Window Position**: Remembers last window position
- **Always on Top**: Widget stays on top of other windows

## Installer
The installer (NSIS) will be created with:
- Desktop shortcut
- Start menu shortcut
- User installation (no admin required)
- Uninstaller included
