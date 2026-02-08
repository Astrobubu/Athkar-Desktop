// Use global Tauri API (injected by Tauri)
const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

// Load athkar data
let athkarData = { morningAthkar: [], eveningAthkar: [] };
let originalAthkarData = null; // Store original for reset

// Load athkar data from the resource file
async function loadAthkarData() {
    try {
        let response = await fetch('athkar-data.json');
        if (!response.ok) {
            response = await fetch('/athkar-data.json');
        }
        if (!response.ok) {
            throw new Error('Failed to load athkar-data.json');
        }
        athkarData = await response.json();
        // Store original copy
        originalAthkarData = JSON.parse(JSON.stringify(athkarData));
        console.log('Athkar data loaded:', athkarData);
    } catch (error) {
        console.error('Error loading athkar data:', error);
        // Fallback data
        athkarData = {
            morningAthkar: [
                { id: 1, text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", count: 1, category: "morning", note: "آية الكرسي" },
                { id: 2, text: "أصبحنا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد صلى الله عليه وسلم، وعلى ملة أبينا إبراهيم، حنيفا مسلما، وما كان من المشركين", count: 1, category: "morning" },
                { id: 3, text: "رضيت بالله ربا، وبالإسلام دينا، وبمحمد صلى الله عليه وسلم نبيا", count: 3, category: "morning", note: "من قالها حين يصبح وحين يمسي كان حقا على الله أن يرضيه" },
                { id: 4, text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء، وهو السميع العليم", count: 3, category: "morning", note: "من قالها حين يصبح وحين يمسي لم يضره شيء" },
                { id: 5, text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور", count: 1, category: "morning" },
            ],
            eveningAthkar: [
                { id: 1, text: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", count: 1, category: "evening", note: "آية الكرسي" },
                { id: 2, text: "أمسينا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد صلى الله عليه وسلم، وعلى ملة أبينا إبراهيم، حنيفا مسلما، وما كان من المشركين", count: 1, category: "evening" },
                { id: 3, text: "رضيت بالله ربا، وبالإسلام دينا، وبمحمد صلى الله عليه وسلم نبيا", count: 3, category: "evening", note: "من قالها حين يصبح وحين يمسي كان حقا على الله أن يرضيه" },
                { id: 4, text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء، وهو السميع العليم", count: 3, category: "evening", note: "من قالها حين يصبح وحين يمسي لم يضره شيء" },
                { id: 5, text: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير", count: 1, category: "evening" },
            ]
        };
        originalAthkarData = JSON.parse(JSON.stringify(athkarData));
    }
    // Load custom athkar from localStorage
    loadCustomAthkar();
}

function loadCustomAthkar() {
    try {
        const customMorning = localStorage.getItem('customMorningAthkar');
        const customEvening = localStorage.getItem('customEveningAthkar');
        
        if (customMorning) {
            const parsed = JSON.parse(customMorning);
            if (Array.isArray(parsed) && parsed.length > 0) {
                athkarData.morningAthkar = parsed;
            }
        }
        if (customEvening) {
            const parsed = JSON.parse(customEvening);
            if (Array.isArray(parsed) && parsed.length > 0) {
                athkarData.eveningAthkar = parsed;
            }
        }
    } catch (e) {
        console.error('Error loading custom athkar:', e);
    }
}

function saveCustomAthkar() {
    try {
        localStorage.setItem('customMorningAthkar', JSON.stringify(athkarData.morningAthkar));
        localStorage.setItem('customEveningAthkar', JSON.stringify(athkarData.eveningAthkar));
    } catch (e) {
        console.error('Error saving custom athkar:', e);
    }
}

// Determine morning or evening based on time of day
// Morning athkar: from Fajr (~4 AM) until Asr (~3:30 PM)
// Evening athkar: from Asr (~3:30 PM) until Fajr (~4 AM)
function getTimeBasedCategory() {
    const hour = new Date().getHours();
    return (hour >= 4 && hour < 16) ? 'morning' : 'evening';
}

// State
let state = {
    currentCategory: getTimeBasedCategory(),
    currentAthkarIndex: 0,
    currentCount: 0,
    settings: {
        fontSize: 22,
        playSound: true,
        darkMode: false
    }
};

let editorState = {
    editingId: null
};

// View management
function showView(viewName) {
    document.getElementById('mainView').style.display = viewName === 'main' ? 'flex' : 'none';
    document.getElementById('settingsView').style.display = viewName === 'settings' ? 'flex' : 'none';
    document.getElementById('editorView').style.display = viewName === 'editor' ? 'flex' : 'none';
    
    if (viewName === 'main') {
        updateDisplay();
        calculateOptimalHeight();
    } else if (viewName === 'editor') {
        renderAthkarList();
        document.getElementById('editorCategory').textContent = state.currentCategory === 'morning' ? 'الصباح' : 'المساء';
        invoke('resize_window', { height: 720 });
    } else if (viewName === 'settings') {
        loadSettingsToUI();
        invoke('resize_window', { height: 720 });
    }
}

// Athkar functions
function getCurrentAthkarList() {
    return state.currentCategory === 'morning'
        ? athkarData.morningAthkar
        : athkarData.eveningAthkar;
}

function getCurrentAthkar() {
    const list = getCurrentAthkarList();
    return list[state.currentAthkarIndex];
}

function updateDisplay() {
    const athkar = getCurrentAthkar();
    const list = getCurrentAthkarList();

    if (!athkar) return;

    const counter = document.querySelector('.counter');
    const countBtn = document.getElementById('countBtn');
    if (counter) counter.style.display = 'block';
    if (countBtn) countBtn.style.display = 'flex';

    document.getElementById('athkarText').textContent = athkar.text;

    const infoBtn = document.getElementById('infoBtn');
    const infoTooltip = document.getElementById('infoTooltip');
    if (athkar.note || athkar.benefit) {
        infoBtn.classList.add('visible');
    } else {
        infoBtn.classList.remove('visible');
        if (infoTooltip) infoTooltip.classList.remove('visible');
    }

    document.getElementById('currentCount').textContent = state.currentCount;
    document.getElementById('totalCount').textContent = athkar.count;
    document.getElementById('athkarProgress').textContent = state.currentAthkarIndex + 1;
    document.getElementById('athkarTotal').textContent = list.length;

    if (state.currentCount >= athkar.count) {
        countBtn.textContent = '✓ تم';
        countBtn.classList.add('completed');
    } else {
        countBtn.textContent = 'تسبيح';
        countBtn.classList.remove('completed');
    }

    document.getElementById('athkarText').style.fontSize = `${state.settings.fontSize}px`;
}

function incrementCounter() {
    const athkar = getCurrentAthkar();
    if (!athkar) return;

    if (state.currentCount < athkar.count) {
        state.currentCount++;
        updateDisplay();

        if (state.settings.playSound) {
            if (state.currentCount >= athkar.count) {
                playCompletionSound();
            } else {
                playTickSound();
            }
        }

        if (state.currentCount >= athkar.count) {
            setTimeout(() => nextAthkar(), 800);
        }
    }
}

function nextAthkar() {
    const list = getCurrentAthkarList();
    if (state.currentAthkarIndex < list.length - 1) {
        state.currentAthkarIndex++;
        state.currentCount = 0;
        updateDisplay();
    } else {
        showCompletionMessage();
    }
}

function prevAthkar() {
    if (state.currentAthkarIndex > 0) {
        state.currentAthkarIndex--;
        state.currentCount = 0;
        updateDisplay();
    }
}

function switchCategory(category) {
    state.currentCategory = category;
    state.currentAthkarIndex = 0;
    state.currentCount = 0;

    document.querySelectorAll('.btn-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    updateDisplay();
}

function showCompletionMessage() {
    document.getElementById('athkarText').textContent = 'تم إنجاز جميع الأذكار 🎉';
    document.querySelector('.counter').style.display = 'none';
    document.getElementById('countBtn').style.display = 'none';
}

// Sound functions
function playTickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {}
}

function playCompletionSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 1200;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {}
}

// Progress
function saveProgress() {
    const progress = {
        category: state.currentCategory,
        index: state.currentAthkarIndex,
        count: state.currentCount
    };
    localStorage.setItem('athkarProgress', JSON.stringify(progress));
}

function loadProgress() {
    try {
        const progress = JSON.parse(localStorage.getItem('athkarProgress'));
        if (progress) {
            state.currentCategory = progress.category;
            state.currentAthkarIndex = progress.index;
            state.currentCount = progress.count;
            document.querySelectorAll('.btn-tab').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-category="${state.currentCategory}"]`).classList.add('active');
        }
    } catch (e) {}
}

// Settings
function applyDarkMode(isDark) {
    state.settings.darkMode = isDark;
    if (isDark) {
        document.body.classList.add('dark');
        document.body.style.background = '#0d0d0d';
    } else {
        document.body.classList.remove('dark');
        document.body.style.background = '#F5F3EF';
    }
    saveSettings();
}

function saveSettings() {
    localStorage.setItem('athkarSettings', JSON.stringify(state.settings));
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('athkarSettings');
        if (saved) {
            state.settings = { ...state.settings, ...JSON.parse(saved) };
        }
    } catch (e) {}
    applyDarkMode(state.settings.darkMode);
}

function loadSettingsToUI() {
    document.getElementById('fontSizeSlider').value = state.settings.fontSize;
    document.getElementById('fontSizeValue').textContent = `${state.settings.fontSize}px`;
    document.getElementById('darkModeToggle').checked = state.settings.darkMode;
    document.getElementById('playSoundToggle').checked = state.settings.playSound;
}

function resetAll() {
    if (!confirm('هل أنت متأكد من إعادة تعيين كل شيء؟ سيتم حذف التقدم والأذكار المخصصة والإعدادات.')) return;
    
    localStorage.removeItem('athkarProgress');
    localStorage.removeItem('customMorningAthkar');
    localStorage.removeItem('customEveningAthkar');
    localStorage.removeItem('athkarSettings');
    
    // Reset to defaults
    state.currentAthkarIndex = 0;
    state.currentCount = 0;
    state.settings = { fontSize: 22, playSound: true, darkMode: false };
    
    // Restore original athkar
    if (originalAthkarData) {
        athkarData = JSON.parse(JSON.stringify(originalAthkarData));
    }
    
    applyDarkMode(false);
    showView('main');
    updateDisplay();
}

// Height calculation
function calculateOptimalHeight() {
    const allAthkar = [...athkarData.morningAthkar, ...athkarData.eveningAthkar];
    if (allAthkar.length === 0) return;
    
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = 'position:absolute;visibility:hidden;width:264px;font-size:' + state.settings.fontSize + 'px;line-height:1.8;padding:12px;text-align:center;word-wrap:break-word;';
    document.body.appendChild(tempDiv);
    
    let maxHeight = 0;
    allAthkar.forEach(athkar => {
        tempDiv.textContent = athkar.text;
        maxHeight = Math.max(maxHeight, tempDiv.offsetHeight);
    });
    
    document.body.removeChild(tempDiv);
    const totalHeight = Math.ceil(276 + maxHeight);
    invoke('resize_window', { height: totalHeight });
}

// Editor functions
function renderAthkarList() {
    const list = getCurrentAthkarList();
    const container = document.getElementById('athkarList');
    
    container.innerHTML = list.map((athkar, index) => `
        <div class="athkar-item" onclick="openEditModal(${athkar.id})">
            <span class="athkar-number">${index + 1}</span>
            <span class="athkar-item-text">${athkar.text.substring(0, 40)}${athkar.text.length > 40 ? '...' : ''}</span>
            <span class="athkar-item-count">×${athkar.count}</span>
        </div>
    `).join('');
}

function openEditModal(id = null) {
    const modal = document.getElementById('editModal');
    const list = getCurrentAthkarList();
    
    editorState.editingId = id;
    
    if (id) {
        const athkar = list.find(a => a.id === id);
        if (athkar) {
            document.getElementById('editModalTitle').textContent = 'تعديل الذكر';
            document.getElementById('editText').value = athkar.text;
            document.getElementById('editCount').value = athkar.count;
            document.getElementById('editNote').value = athkar.note || '';
            document.getElementById('deleteAthkarBtn').style.display = 'inline-flex';
        }
    } else {
        document.getElementById('editModalTitle').textContent = 'إضافة ذكر جديد';
        document.getElementById('editText').value = '';
        document.getElementById('editCount').value = '1';
        document.getElementById('editNote').value = '';
        document.getElementById('deleteAthkarBtn').style.display = 'none';
    }
    
    modal.style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    editorState.editingId = null;
}

function saveAthkar() {
    const text = document.getElementById('editText').value.trim();
    const count = parseInt(document.getElementById('editCount').value) || 1;
    const note = document.getElementById('editNote').value.trim();
    
    if (!text) {
        alert('الرجاء إدخال نص الذكر');
        return;
    }
    
    const list = state.currentCategory === 'morning' ? athkarData.morningAthkar : athkarData.eveningAthkar;
    
    if (editorState.editingId) {
        const index = list.findIndex(a => a.id === editorState.editingId);
        if (index !== -1) {
            list[index] = { ...list[index], text, count, note };
        }
    } else {
        const newId = Math.max(...list.map(a => a.id), 0) + 1;
        list.push({ id: newId, text, count, note, category: state.currentCategory });
    }
    
    saveCustomAthkar();
    renderAthkarList();
    closeEditModal();
}

function deleteAthkar() {
    if (!editorState.editingId) return;
    if (!confirm('هل أنت متأكد من حذف هذا الذكر؟')) return;
    
    const list = state.currentCategory === 'morning' ? athkarData.morningAthkar : athkarData.eveningAthkar;
    const index = list.findIndex(a => a.id === editorState.editingId);
    
    if (index !== -1) {
        list.splice(index, 1);
        // Reassign IDs
        list.forEach((a, i) => a.id = i + 1);
        saveCustomAthkar();
        renderAthkarList();
        closeEditModal();
    }
}

// Event listeners
function setupEventListeners() {
    // Main view
    document.getElementById('countBtn').addEventListener('click', () => { incrementCounter(); saveProgress(); });
    document.getElementById('nextBtn').addEventListener('click', () => { nextAthkar(); saveProgress(); });
    document.getElementById('prevBtn').addEventListener('click', () => { prevAthkar(); saveProgress(); });
    document.querySelectorAll('.btn-tab').forEach(btn => {
        btn.addEventListener('click', () => { switchCategory(btn.dataset.category); saveProgress(); });
    });
    document.getElementById('closeBtn').addEventListener('click', () => invoke('close_app'));
    document.getElementById('settingsBtn').addEventListener('click', () => showView('settings'));
    
    // Info tooltip
    const infoBtn = document.getElementById('infoBtn');
    const infoTooltip = document.getElementById('infoTooltip');
    if (infoBtn && infoTooltip) {
        infoBtn.addEventListener('mouseenter', () => {
            const athkar = getCurrentAthkar();
            if (!athkar) return;
            infoTooltip.textContent = athkar.note || athkar.benefit || 'لا توجد معلومات إضافية';
            infoTooltip.classList.add('visible');
        });
        infoBtn.addEventListener('mouseleave', () => infoTooltip.classList.remove('visible'));
    }
    
    // Settings view
    document.getElementById('backFromSettings').addEventListener('click', () => showView('main'));
    document.getElementById('openEditorBtn').addEventListener('click', () => showView('editor'));
    document.getElementById('resetAllBtn').addEventListener('click', resetAll);
    document.getElementById('checkUpdateBtn').addEventListener('click', () => checkForUpdates(true));
    
    // Update notification
    document.getElementById('installUpdateBtn').addEventListener('click', installUpdate);
    document.getElementById('dismissUpdateBtn').addEventListener('click', dismissUpdate);
    
    document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
        state.settings.fontSize = parseInt(e.target.value);
        document.getElementById('fontSizeValue').textContent = `${state.settings.fontSize}px`;
        saveSettings();
    });
    
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        applyDarkMode(e.target.checked);
    });
    
    document.getElementById('playSoundToggle').addEventListener('change', (e) => {
        state.settings.playSound = e.target.checked;
        saveSettings();
    });
    
    // Editor view
    document.getElementById('backFromEditor').addEventListener('click', () => showView('settings'));
    document.getElementById('addAthkarBtn').addEventListener('click', () => openEditModal());
    
    // Edit modal
    document.getElementById('saveAthkarBtn').addEventListener('click', saveAthkar);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
    document.getElementById('deleteAthkarBtn').addEventListener('click', deleteAthkar);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (document.getElementById('mainView').style.display === 'none') return;
    
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

// Update checking
async function checkForUpdates(manual = false) {
    const statusEl = document.getElementById('updateStatus');
    const checkBtn = document.getElementById('checkUpdateBtn');

    if (manual) {
        statusEl.style.display = 'block';
        statusEl.textContent = 'جاري التحقق...';
        checkBtn.disabled = true;
    }

    try {
        const update = await invoke('check_for_update');

        if (update) {
            // Check if this version was already dismissed
            const dismissedVersion = localStorage.getItem('dismissedUpdateVersion');
            const dismissCount = parseInt(localStorage.getItem('updateDismissCount') || '0');

            // Only show notification if: manual check, OR (not dismissed this version AND shown less than 2 times)
            const shouldShow = manual || (dismissedVersion !== update.version && dismissCount < 2);

            if (shouldShow) {
                document.getElementById('updateText').textContent = `تحديث جديد متاح: ${update.version}`;
                document.getElementById('updateNotification').style.display = 'flex';

                // Track show count for this version
                if (!manual) {
                    const currentVersion = localStorage.getItem('lastShownUpdateVersion');
                    if (currentVersion === update.version) {
                        localStorage.setItem('updateDismissCount', (dismissCount + 1).toString());
                    } else {
                        localStorage.setItem('lastShownUpdateVersion', update.version);
                        localStorage.setItem('updateDismissCount', '1');
                    }
                }
            }

            if (manual) {
                statusEl.innerHTML = `<span style="color: #2D5F5D;">تحديث جديد متاح: ${update.version}</span>`;
            }
        } else {
            if (manual) {
                statusEl.innerHTML = '<span style="color: #5A8F7B;">لديك أحدث إصدار ✓</span>';
            }
        }
    } catch (error) {
        console.error('Update check failed:', error);
        if (manual) {
            statusEl.innerHTML = '<span style="color: #C74B50;">فشل التحقق من التحديثات</span>';
        }
    }

    if (manual) {
        checkBtn.disabled = false;
        setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
    }
}

async function installUpdate() {
    try {
        document.getElementById('updateText').textContent = 'جاري التحميل...';
        await invoke('install_update');
    } catch (error) {
        console.error('Update install failed:', error);
        alert('فشل تحميل التحديث. الرجاء المحاولة لاحقاً.');
    }
}

function dismissUpdate() {
    document.getElementById('updateNotification').style.display = 'none';
    // Store the dismissed version so we don't show it again
    const updateText = document.getElementById('updateText').textContent;
    const versionMatch = updateText.match(/(\d+\.\d+\.\d+)/);
    if (versionMatch) {
        localStorage.setItem('dismissedUpdateVersion', versionMatch[1]);
    }
}

// Init
async function init() {
    await loadAthkarData();
    loadProgress();
    loadSettings();
    setupEventListeners();

    // Set the correct active tab based on current category (time-based or loaded from progress)
    document.querySelectorAll('.btn-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${state.currentCategory}"]`).classList.add('active');

    updateDisplay();

    document.getElementById('dragHandle').setAttribute('data-tauri-drag-region', '');
    
    setTimeout(calculateOptimalHeight, 100);
    
    // Check for updates on startup (once per day)
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (!lastCheck || (now - parseInt(lastCheck)) > dayMs) {
        localStorage.setItem('lastUpdateCheck', now.toString());
        checkForUpdates(false);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init().catch(console.error));
} else {
    init().catch(console.error);
}

setInterval(saveProgress, 5000);
setInterval(() => {
    state.currentAthkarIndex = 0;
    state.currentCount = 0;
    localStorage.removeItem('athkarProgress');
    updateDisplay();
}, 6 * 60 * 60 * 1000);
