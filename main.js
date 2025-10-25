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
  const bgColor = savedSettings && savedSettings.darkMode ? '#0d0d0d' : '#F5F3EF';

  const options = {
    width: 320,
    height: 720,
    frame: false,
    transparent: false,
    alwaysOnTop: false,
    resizable: false,
    skipTaskbar: false,
    backgroundColor: bgColor,
    focusable: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
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

  // Ensure window can lose focus and go behind other windows
  mainWindow.setAlwaysOnTop(false);

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
  // Create tray icon from base64 PNG (simple teal icon matching app theme)
  const iconData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA2ElEQVR4nO2WQQ6DMAxE38lVOApH4SgchaNwFY7SQ1RVUKhju3ZaJP9LkZDsfGw7hgEAAAAA/oyZWTPzlZkfzHxn5ouZWY/MAjNfmXlS46nynZm5RgTgqQBP9b6r/BgRgEcBeFTPUb1HROB0AI5qjhKBUwE4qnOUCJwGwKjmKBU4BYCjmqNU4N8BRJXRVLvBc2O/CIBRRR9/N7DqmiAC0FzGqWuiCEBTGauuySIAzWSsuqaIADSRseqaKgLgl9Ht+1PWVBGA6jJWXXsQAaguY9W1FxGAn8o41fsuAAAAAOwTL+zHMoVj6c9VAAAAAElFTkSuQmCC';
  const icon = nativeImage.createFromDataURL(iconData);

  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'إظهار',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
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
