const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Load athkar data
const athkarData = JSON.parse(fs.readFileSync(path.join(__dirname, 'athkar-data.json'), 'utf8'));

// State management
let state = {
    currentCategory: 'morning',
    currentAthkarIndex: 0,
    currentCount: 0,
    settings: {
        fontSize: 22,
        playSound: true,
        darkMode: false
    }
};

// Get current athkar list
function getCurrentAthkarList() {
    return state.currentCategory === 'morning'
        ? athkarData.morningAthkar
        : athkarData.eveningAthkar;
}

// Get current athkar
function getCurrentAthkar() {
    const list = getCurrentAthkarList();
    return list[state.currentAthkarIndex];
}

// Update display
function updateDisplay() {
    const athkar = getCurrentAthkar();
    const list = getCurrentAthkarList();

    // Show counter and button when not completed
    const counter = document.querySelector('.counter');
    const countBtn = document.getElementById('countBtn');
    if (counter) counter.style.display = 'block';
    if (countBtn) countBtn.style.display = 'flex';

    // Update text
    document.getElementById('athkarText').textContent = athkar.text;

    // Show/hide info button based on note availability
    const infoBtn = document.getElementById('infoBtn');
    const infoTooltip = document.getElementById('infoTooltip');
    if (athkar.note || athkar.benefit) {
        infoBtn.classList.add('visible');
    } else {
        infoBtn.classList.remove('visible');
        if (infoTooltip) {
            infoTooltip.classList.remove('visible');
        }
    }

    // Update counter
    document.getElementById('currentCount').textContent = state.currentCount;
    document.getElementById('totalCount').textContent = athkar.count;

    // Update progress indicator
    document.getElementById('athkarProgress').textContent = state.currentAthkarIndex + 1;
    document.getElementById('athkarTotal').textContent = list.length;

    // Update count button
    if (state.currentCount >= athkar.count) {
        countBtn.textContent = '✓ تم';
        countBtn.classList.add('completed');
    } else {
        countBtn.textContent = 'تسبيح';
        countBtn.classList.remove('completed');
    }

    // Apply font size from settings
    document.getElementById('athkarText').style.fontSize = `${state.settings.fontSize}px`;
}

// Increment counter
function incrementCounter() {
    const athkar = getCurrentAthkar();

    if (state.currentCount < athkar.count) {
        state.currentCount++;
        updateDisplay();

        // Play sound effect (if enabled)
        if (state.settings.playSound) {
            // Check if this is the last count for this dhikr
            if (state.currentCount >= athkar.count) {
                // Play completion sound when moving to next dhikr
                playCompletionSound();
            } else {
                // Play regular tick sound for repeated dhikr
                playTickSound();
            }
        }

        // Auto-advance when completed
        if (state.currentCount >= athkar.count) {
            setTimeout(() => {
                nextAthkar();
            }, 800);
        }
    }
}

// Next athkar
function nextAthkar() {
    const list = getCurrentAthkarList();
    if (state.currentAthkarIndex < list.length - 1) {
        state.currentAthkarIndex++;
        state.currentCount = 0;
        updateDisplay();
    } else {
        // Completed all athkar
        showCompletionMessage();
    }
}

// Previous athkar
function prevAthkar() {
    if (state.currentAthkarIndex > 0) {
        state.currentAthkarIndex--;
        state.currentCount = 0;
        updateDisplay();
    }
}

// Switch category
function switchCategory(category) {
    state.currentCategory = category;
    state.currentAthkarIndex = 0;
    state.currentCount = 0;

    // Update button states
    document.querySelectorAll('.btn-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    updateDisplay();
}

// Show completion message
function showCompletionMessage() {
    const athkarText = document.getElementById('athkarText');
    athkarText.textContent = 'تم إنجاز جميع الأذكار';
    
    // Hide counter and button when completed
    const counter = document.querySelector('.counter');
    const countBtn = document.getElementById('countBtn');
    if (counter) counter.style.display = 'none';
    if (countBtn) countBtn.style.display = 'none';
}

// Play tick sound for repeated dhikr (simple beep using Web Audio API)
function playTickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        // Lower volume from 0.3 to 0.15
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// Play completion sound for moving to next dhikr (different tone)
function playCompletionSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Higher frequency for completion sound
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';

        // Lower volume
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

// Save progress
function saveProgress() {
    const progress = {
        category: state.currentCategory,
        index: state.currentAthkarIndex,
        count: state.currentCount
    };
    localStorage.setItem('athkarProgress', JSON.stringify(progress));
}

// Load progress
function loadProgress() {
    try {
        const progress = JSON.parse(localStorage.getItem('athkarProgress'));
        if (progress) {
            state.currentCategory = progress.category;
            state.currentAthkarIndex = progress.index;
            state.currentCount = progress.count;

            // Update category buttons
            document.querySelectorAll('.btn-tab').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-category="${state.currentCategory}"]`).classList.add('active');
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Event listeners
function setupEventListeners() {
    const countBtn = document.getElementById('countBtn');
    if (countBtn) {
        countBtn.addEventListener('click', () => {
            incrementCounter();
            saveProgress();
        });
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextAthkar();
            saveProgress();
        });
    }

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevAthkar();
            saveProgress();
        });
    }

    document.querySelectorAll('.btn-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            switchCategory(btn.dataset.category);
            saveProgress();
        });
    });

    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            ipcRenderer.send('close-app');
        });
    }

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            ipcRenderer.send('open-settings');
        });
    }

    const infoBtn = document.getElementById('infoBtn');
    const infoTooltip = document.getElementById('infoTooltip');
    
    if (infoBtn && infoTooltip) {
        infoBtn.addEventListener('mouseenter', () => {
            const athkar = getCurrentAthkar();
            const info = athkar.note || athkar.benefit || 'لا توجد معلومات إضافية';
            infoTooltip.textContent = info;
            infoTooltip.classList.add('visible');
        });
        
        infoBtn.addEventListener('mouseleave', () => {
            infoTooltip.classList.remove('visible');
        });
        
        // Replace feather icons inside button
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        incrementCounter();
        saveProgress();
    } else if (e.code === 'ArrowRight') {
        nextAthkar();
        saveProgress();
    } else if (e.code === 'ArrowLeft') {
        prevAthkar();
        saveProgress();
    }
});

// Settings management
ipcRenderer.on('settings-updated', (event, settings) => {
    state.settings = { ...state.settings, ...settings };
    
    // Apply dark mode
    if (settings.darkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    
    updateDisplay();
    
    // Recalculate height if font size changed
    if (settings.fontSize) {
        calculateOptimalHeight();
    }
});

ipcRenderer.on('reset-progress', () => {
    state.currentAthkarIndex = 0;
    state.currentCount = 0;
    localStorage.removeItem('athkarProgress');
    updateDisplay();
});

// Load settings on startup
ipcRenderer.send('load-settings');
ipcRenderer.on('settings-loaded', (event, settings) => {
    state.settings = { ...state.settings, ...settings };
    
    // Apply dark mode on startup
    if (settings.darkMode) {
        document.body.classList.add('dark');
    }
    
    updateDisplay();
});

// Calculate optimal window height based on tallest dhikr
function calculateOptimalHeight() {
    const allAthkar = [...athkarData.morningAthkar, ...athkarData.eveningAthkar];
    
    // Create temporary element to measure text height
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = '264px'; // 320px - content padding (32px) - text padding (24px)
    tempDiv.style.fontSize = `${state.settings.fontSize}px`;
    tempDiv.style.lineHeight = '1.8';
    tempDiv.style.fontFamily = 'Amiri, Traditional Arabic, Arabic Typesetting, serif';
    tempDiv.style.padding = '12px';
    tempDiv.style.textAlign = 'center';
    tempDiv.style.wordWrap = 'break-word';
    document.body.appendChild(tempDiv);
    
    let maxHeight = 0;
    allAthkar.forEach(athkar => {
        tempDiv.textContent = athkar.text;
        const height = tempDiv.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
    
    document.body.removeChild(tempDiv);
    
    // Base height: header(40) + counter(48) + button(54) + nav(56) + gaps(48) + extra buffer(30) = 276
    const totalHeight = Math.ceil(276 + maxHeight);
    
    // Send to main process to resize window
    ipcRenderer.send('resize-window', totalHeight);
}

// Initialize
function init() {
    loadProgress();
    setupEventListeners();
    updateDisplay();
    
    // Make entire header draggable
    const header = document.getElementById('dragHandle');
    if (header) {
        header.style.webkitAppRegion = 'drag';
        // Make buttons clickable within draggable area
        const buttons = header.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.webkitAppRegion = 'no-drag';
        });
    }
    
    // Calculate height after a short delay to ensure DOM is fully rendered
    setTimeout(() => {
        calculateOptimalHeight();
    }, 100);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Auto-save progress periodically
setInterval(saveProgress, 5000);

// Auto-reset every 6 hours
setInterval(() => {
    state.currentAthkarIndex = 0;
    state.currentCount = 0;
    localStorage.removeItem('athkarProgress');
    updateDisplay();
}, 6 * 60 * 60 * 1000);
