const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Load current settings
let currentSettings = {
    fontSize: 18,
    playSound: true,
    darkMode: false
};

// Load saved settings
function loadSettings() {
    try {
        const settingsPath = path.join(__dirname, 'user-settings.json');
        if (fs.existsSync(settingsPath)) {
            const savedSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            currentSettings = { ...currentSettings, ...savedSettings };
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }

    // Apply settings to form
    document.getElementById('fontSize').value = currentSettings.fontSize;
    document.getElementById('fontSizeValue').textContent = `${currentSettings.fontSize}px`;

    document.getElementById('playSound').checked = currentSettings.playSound;
    document.getElementById('darkMode').checked = currentSettings.darkMode;

    // Apply dark mode to settings window
    if (currentSettings.darkMode) {
        document.body.classList.add('dark');
    }
}

// Font size slider
document.getElementById('fontSize').addEventListener('input', (e) => {
    document.getElementById('fontSizeValue').textContent = `${e.target.value}px`;
});

// Save button
document.getElementById('saveBtn').addEventListener('click', () => {
    const settings = {
        fontSize: parseInt(document.getElementById('fontSize').value),
        playSound: document.getElementById('playSound').checked,
        darkMode: document.getElementById('darkMode').checked
    };

    ipcRenderer.send('save-settings', settings);

    // Show success message
    const saveBtn = document.getElementById('saveBtn');
    const originalHTML = saveBtn.innerHTML;
    saveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> تم الحفظ!`;
    saveBtn.style.background = 'hsl(142.1 76.2% 36.3%)';

    setTimeout(() => {
        saveBtn.innerHTML = originalHTML;
        saveBtn.style.background = '';
        window.close();
    }, 1000);
});

// Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
    window.close();
});

// Close button in header
document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    window.close();
});

// Reset progress button
document.getElementById('resetProgress').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من إعادة تعيين التقدم؟ سيتم حذف جميع البيانات المحفوظة.')) {
        ipcRenderer.send('reset-progress');

        // Show success message
        const resetBtn = document.getElementById('resetProgress');
        const originalHTML = resetBtn.innerHTML;
        resetBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> تم إعادة التعيين!`;
        resetBtn.style.background = 'hsl(142.1 76.2% 36.3%)';

        setTimeout(() => {
            resetBtn.innerHTML = originalHTML;
            resetBtn.style.background = '';
        }, 2000);
    }
});

// Initialize
loadSettings();

// Make settings header draggable
const settingsHeader = document.getElementById('settingsDragHandle');
if (settingsHeader) {
    settingsHeader.style.webkitAppRegion = 'drag';
    const buttons = settingsHeader.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.style.webkitAppRegion = 'no-drag';
    });
}
