const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;
let tray = null;

// Load window position
function loadWindowPosition() {
  try {
    const settingsPath = path.join(__dirname, 'user-settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      return settings.windowPosition || null;
    }
  } catch (error) {
    console.error('Error loading window position:', error);
  }
  return null;
}

// Save window position
function saveWindowPosition() {
  try {
    const bounds = mainWindow.getBounds();
    const settingsPath = path.join(__dirname, 'user-settings.json');
    let settings = {};
    
    if (fs.existsSync(settingsPath)) {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
    
    settings.windowPosition = { x: bounds.x, y: bounds.y };
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error saving window position:', error);
  }
}

function createWindow() {
  const savedPosition = loadWindowPosition();
  
  const savedSettings = loadSavedSettings();
  const bgColor = savedSettings && savedSettings.darkMode ? '#0d0d0d' : '#e8e8e8';

  const options = {
    width: 320,
    height: 480,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    backgroundColor: bgColor,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  };

  if (savedPosition) {
    options.x = savedPosition.x;
    options.y = savedPosition.y;
  }

  mainWindow = new BrowserWindow(options);

  mainWindow.loadFile('index.html');
  mainWindow.setIgnoreMouseEvents(false);

  // Save position when window is moved
  mainWindow.on('moved', () => {
    saveWindowPosition();
  });
}

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  const savedSettings = loadSavedSettings();
  const bgColor = savedSettings && savedSettings.darkMode ? '#1a1a1a' : '#fafafa';

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 520,
    parent: mainWindow,
    modal: true,
    frame: false,
    transparent: false,
    resizable: false,
    backgroundColor: bgColor,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile('settings.html');

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function loadSavedSettings() {
  try {
    const settingsPath = path.join(__dirname, 'user-settings.json');
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return null;
}

function createTray() {
  // Create tray icon from base64 PNG (moon and star icon)
  const iconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADGUlEQVR4nO2WS2hTURCGv3ObprYN1lqtWkVEEBQVXYiI4kZEd4ILN4IbRXDhxo0rV+5cuHLhQlwILkRQFBQRFAQfqIiK+KgW0VrTR5I2TZP7cKEmNW3Se9MkBf/VzJyZ8585M2fmBv5z/Q+gnVgMWAp0A0uAVqABqJbfn4FPwDPgLjAAtAC1KepXA6uAHcA+oBdYVUCuBmgD+oEjwE7gMvAWmAJieTSqGfgC3AB6iiRPdtQCB4F7wBwQA14Ae4FmA81q4DTwGAjn6B8COoAaE4KtwD3gE9APbMs1VoRaZeEuYDvwArhdgO9i3gSsN3FhMNGuO4Uxm2QKHAK2GnC2qnLeCVwA2nP4W+XrPq5oAyiKZh+wW7tvpzXJv1dLdhfQl6PerXPWGGiYfEQ09Sx3YQKol5mnB4pQl+zMCeCuBv0OmDYgqM8SXAqMahT6gFOSM4Cz0hmQ3BbgjixmxQNZYDn4pxKmLBVXrXgEOCqfJ3LOeUnyBzXvLMlcVRpcSjHxBjiYxXkYuJbibJJ82kRjqiGxCvgqg0fF0Qy8kmyH5u2WTJB0Oo1IV9F0TsBdWUgOdKTp+8Dv2tgPDAKNks+aaqQbP6BLg+0RB+P8vuljGnwFrM/RPlHQXG+qsUzG/siA74RiG5aMdnoknMvCd0o8QZN0AKCSfC0B3jvtSSB0pGhrylH/s9wbsHgAoIJ8DQJvtMUH0xGn7DcKl5yvKXCLmxYPAFSSrxXA27QEyRe/AWbkXyV522qqkW78gC4N9kXGhnKQ75Qvng1fs3Xgvy3mgIca7LU06JRMYLOhRiYd0+D+yFiz9ILmiE0cWq/ZN/PJWPYA4u5awx2xSYN2a+NJc8aAJxq8v8CAzsn/IeCxiUayD3C+pR2rkl/wlh6oA9o1Z79WtYXU71xwVhe5dDolW3DQE+3+CzU75PcUc+/+Ysv5PloD3PilYt4BP1TNdC9pSm/gKnDK5E1Y5P0t51B96vwOYLtkE/9wrgA/lCJ9f+vN9h/rfwCbHgnZJqV3VAAAAABJRU5ErkJggg==';
  const icon = nativeImage.createFromDataURL(iconData);
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'إظهار',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'إخفاء',
      click: () => {
        if (mainWindow) {
          mainWindow.hide();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'الإعدادات',
      click: () => {
        createSettingsWindow();
      }
    },
    { type: 'separator' },
    {
      label: 'خروج',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('أذكار المسلم');
  tray.setContextMenu(contextMenu);
  
  // Double click to show/hide
  tray.on('double-click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', (e) => {
  // Don't quit app when windows are closed, keep running in tray
  e.preventDefault();
});

// IPC handlers
ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

ipcMain.on('close-app', () => {
  if (mainWindow) {
    mainWindow.hide();
  }
});

ipcMain.on('minimize-app', () => {
  mainWindow.minimize();
});

ipcMain.on('save-settings', (event, settings) => {
  const settingsPath = path.join(__dirname, 'user-settings.json');
  let existingSettings = {};
  
  if (fs.existsSync(settingsPath)) {
    existingSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  }
  
  const updatedSettings = { ...existingSettings, ...settings };
  
  fs.writeFileSync(
    settingsPath,
    JSON.stringify(updatedSettings, null, 2)
  );
  
  mainWindow.webContents.send('settings-updated', settings);
  
  // Update main window background if dark mode changed
  if (settings.darkMode !== undefined) {
    const bgColor = settings.darkMode ? '#0d0d0d' : '#e8e8e8';
    mainWindow.setBackgroundColor(bgColor);
    
    if (settingsWindow) {
      const settingsBgColor = settings.darkMode ? '#1a1a1a' : '#fafafa';
      settingsWindow.setBackgroundColor(settingsBgColor);
    }
  }
});

ipcMain.on('load-settings', (event) => {
  try {
    const settingsPath = path.join(__dirname, 'user-settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      event.reply('settings-loaded', settings);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
});

ipcMain.on('reset-progress', () => {
  mainWindow.webContents.send('reset-progress');
});

ipcMain.on('resize-window', (event, height) => {
  const bounds = mainWindow.getBounds();
  mainWindow.setSize(320, height);
  mainWindow.setBounds({ ...bounds, width: 320, height: height });
});
