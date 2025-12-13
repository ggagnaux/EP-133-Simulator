/**
 * EP-133 Simulator - Main Controller
 * Orchestrates the audio engine, sequencer, and UI manager
 */

class EP133Simulator {
    constructor() {
        // Initialize modules
        this.audioEngine = new AudioEngine();
        this.uiManager = new UIManager();
        this.sequencer = new Sequencer(this.audioEngine, this.uiManager);

        // Application state
        this.currentTab = 'output';
        this.currentMode = 'comp';
        this.currentTheme = localStorage.getItem(CONFIG.STORAGE.THEME) || CONFIG.UI.THEMES.DARK;

        // Settings
        this.settings = {
            defaultVolume: this.loadValidatedSetting(CONFIG.STORAGE.DEFAULT_VOLUME, 50, 0, 100),
            defaultTempo: this.loadValidatedSetting(CONFIG.STORAGE.DEFAULT_TEMPO, 133, 60, 180),
            showTooltips: localStorage.getItem(CONFIG.STORAGE.SHOW_TOOLTIPS) !== 'false',
            enableSounds: localStorage.getItem(CONFIG.STORAGE.ENABLE_SOUNDS) !== 'false',
            transform: parseFloat(localStorage.getItem(CONFIG.STORAGE.TRANSFORM)) || CONFIG.UI.DEFAULT_TRANSFORM_ANGLE
        };

        this.init();
    }

    /**
     * Load and validate a setting from localStorage
     */
    loadValidatedSetting(key, defaultValue, min, max) {
        const stored = parseInt(localStorage.getItem(key));
        return (stored >= min && stored <= max) ? stored : defaultValue;
    }

    /**
     * Initialize the simulator
     */
    init() {
        this.uiManager.init();
        this.audioEngine.init();

        this.setupEventListeners();
        this.applySettings();
        this.uiManager.applyTheme(this.currentTheme);
    }

    /**
     * Apply loaded settings
     */
    applySettings() {
        this.audioEngine.setVolume(this.settings.defaultVolume);
        this.sequencer.setBpm(this.settings.defaultTempo);
        this.uiManager.applyTransform(this.settings.transform);
        this.updateDisplay();
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Menu buttons
        document.querySelectorAll(CONFIG.UI.SELECTORS.MENU_BTNS).forEach(btn => {
            btn.addEventListener('click', () => this.handleMenuClick(btn.dataset.menu));
        });

        // Tabs
        document.querySelectorAll(CONFIG.UI.SELECTORS.TABS).forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Control buttons
        document.querySelectorAll(CONFIG.UI.SELECTORS.CONTROL_BTNS).forEach(btn => {
            btn.addEventListener('click', () => this.switchMode(btn.dataset.btn));
        });

        // Pads
        document.querySelectorAll(CONFIG.UI.SELECTORS.PADS).forEach(pad => {
            const padId = pad.dataset.pad;

            pad.addEventListener('mousedown', (e) => {
                if (e.button === 0) this.handlePadPress(padId);
            });
            pad.addEventListener('mouseup', () => this.handlePadRelease(padId));
            pad.addEventListener('mouseleave', () => this.handlePadRelease(padId));

            pad.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handlePadPress(padId);
            });
            pad.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handlePadRelease(padId);
            });
            pad.addEventListener('contextmenu', (e) => e.preventDefault());
        });

        // Transport buttons
        document.querySelectorAll(CONFIG.UI.SELECTORS.TRANSPORT_BTNS).forEach(btn => {
            btn.addEventListener('click', () => this.handleTransport(btn.dataset.transport));
        });

        // Knobs
        document.querySelectorAll(CONFIG.UI.SELECTORS.KNOBS).forEach(knob => {
            knob.addEventListener('mousedown', (e) => this.startKnobDrag(e, knob));
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('keyup', (e) => this.handleKeyRelease(e));

        // Dialogs
        this.setupDialogListeners();
    }

    /**
     * Handle pad press
     */
    handlePadPress(padId) {
        if (!padId) return;

        this.uiManager.highlightPad(padId, true);

        if (this.settings.enableSounds) {
            this.audioEngine.playPadSound(padId);
        }

        // Handle special pads
        switch (padId) {
            case 'play':
                this.sequencer.togglePlay();
                break;
            case 'record':
                this.sequencer.toggleRecord();
                break;
            // TODO: Add other special pad handlers
        }
    }

    /**
     * Handle pad release
     */
    handlePadRelease(padId) {
        if (!padId) return;

        const persistentPads = ['mute', 'accent', 'play'];
        if (!persistentPads.includes(padId)) {
            this.uiManager.highlightPad(padId, false);
        }
    }

    /**
     * Handle transport button clicks
     */
    handleTransport(action) {
        switch (action) {
            case 'play':
                this.sequencer.togglePlay();
                break;
            case 'rec':
                this.sequencer.toggleRecord();
                break;
            // TODO: Add seq/write handlers
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyPress(e) {
        if (e.repeat) return;

        const keyMap = {
            ' ': 'play',
            'r': 'record',
            '1': '1', '2': '2', '3': '3',
            '4': '4', '5': '5', '6': '6',
            '7': '7', '8': '8', '9': '9',
            '0': '0'
        };

        const padId = keyMap[e.key];
        if (padId) {
            e.preventDefault();
            this.handlePadPress(padId);
        }
    }

    /**
     * Handle keyboard releases
     */
    handleKeyRelease(e) {
        const keyMap = {
            ' ': 'play',
            'r': 'record',
            '1': '1', '2': '2', '3': '3',
            '4': '4', '5': '5', '6': '6',
            '7': '7', '8': '8', '9': '9',
            '0': '0'
        };

        const padId = keyMap[e.key];
        if (padId) {
            this.handlePadRelease(padId);
        }
    }

    /**
     * Start knob drag interaction
     */
    startKnobDrag(e, knob) {
        e.preventDefault();

        const startY = e.clientY;
        const control = knob.dataset.control;
        const startValue = this.getKnobValue(control);

        const handleMouseMove = (e) => {
            const deltaY = startY - e.clientY;
            const newValue = Math.max(0, Math.min(100, startValue + deltaY));
            this.setKnobValue(control, newValue);
            this.updateKnobRotation(knob, newValue);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    /**
     * Get current value for a knob control
     */
    getKnobValue(control) {
        switch (control) {
            case 'volume': return this.settings.defaultVolume;
            case 'tempo': return ((this.sequencer.bpm - MIN_TEMPO) / 120) * 100;
            case 'pitch': return 50; // TODO: Implement pitch
            default: return 50;
        }
    }

    /**
     * Set value for a knob control
     */
    setKnobValue(control, value) {
        switch (control) {
            case 'volume':
                this.settings.defaultVolume = value;
                this.audioEngine.setVolume(value);
                break;
            case 'tempo':
                const newBpm = Math.round(MIN_TEMPO + (value / 100) * 120);
                this.sequencer.setBpm(newBpm);
                break;
            case 'pitch':
                // TODO: Implement pitch control
                break;
        }
        this.updateDisplay();
    }

    /**
     * Update knob visual rotation
     */
    updateKnobRotation(knob, value) {
        const rotation = (value / 100) * (CONFIG.UI.KNOB_ROTATION.MAX - CONFIG.UI.KNOB_ROTATION.MIN) + CONFIG.UI.KNOB_ROTATION.MIN;
        knob.style.transform = `rotate(${rotation}deg)`;
    }

    /**
     * Switch tab
     */
    switchTab(tab) {
        document.querySelectorAll(CONFIG.UI.SELECTORS.TABS).forEach(t => t.classList.remove('active'));
        const tabElement = document.querySelector(`[data-tab="${tab}"]`);
        if (tabElement) tabElement.classList.add('active');
        this.currentTab = tab;
    }

    /**
     * Switch mode
     */
    switchMode(mode) {
        document.querySelectorAll(CONFIG.UI.SELECTORS.CONTROL_BTNS).forEach(btn => btn.classList.remove('active'));
        const modeBtn = document.querySelector(`[data-btn="${mode}"]`);
        if (modeBtn) modeBtn.classList.add('active');
        this.currentMode = mode;
    }

    /**
     * Handle menu clicks
     */
    handleMenuClick(menu) {
        switch (menu) {
            case 'settings':
                this.showSettingsDialog();
                break;
            case 'about':
                this.showAboutDialog();
                break;
            // TODO: Add other menu handlers
        }
    }

    /**
     * Set up dialog-related event listeners
     */
    setupDialogListeners() {
        // Close buttons
        document.querySelectorAll('.dialog-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.dialog-overlay').classList.remove('active');
            });
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTheme = btn.dataset.theme;
                this.uiManager.applyTheme(this.currentTheme);
                localStorage.setItem(CONFIG.STORAGE.THEME, this.currentTheme);
            });
        });

        // Save settings button
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // Reset settings button
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
    }

    /**
     * Show settings dialog
     */
    showSettingsDialog() {
        const dialog = document.getElementById('settings-dialog');
        if (dialog) {
            this.loadSettingsIntoDialog();
            dialog.classList.add('active');
        }
    }

    /**
     * Show about dialog
     */
    showAboutDialog() {
        const dialog = document.getElementById('about-dialog');
        if (dialog) dialog.classList.add('active');
    }

    /**
     * Load current settings into dialog
     */
    loadSettingsIntoDialog() {
        const volumeSlider = document.getElementById('volume-default');
        const tempoSlider = document.getElementById('tempo-default');
        const transformSlider = document.getElementById('transform-value');

        if (volumeSlider) {
            volumeSlider.value = this.settings.defaultVolume;
            volumeSlider.nextElementSibling.textContent = this.settings.defaultVolume;
        }

        if (tempoSlider) {
            tempoSlider.value = this.settings.defaultTempo;
            tempoSlider.nextElementSibling.textContent = this.settings.defaultTempo + ' BPM';
        }

        if (transformSlider) {
            transformSlider.value = this.settings.transform;
            transformSlider.nextElementSibling.textContent = this.settings.transform + '°';
        }
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const volumeSlider = document.getElementById('volume-default');
        const tempoSlider = document.getElementById('tempo-default');
        const transformSlider = document.getElementById('transform-value');

        this.settings.defaultVolume = parseInt(volumeSlider.value);
        this.settings.defaultTempo = parseInt(tempoSlider.value);
        this.settings.transform = parseFloat(transformSlider.value);

        localStorage.setItem(CONFIG.STORAGE.DEFAULT_VOLUME, this.settings.defaultVolume);
        localStorage.setItem(CONFIG.STORAGE.DEFAULT_TEMPO, this.settings.defaultTempo);
        localStorage.setItem(CONFIG.STORAGE.TRANSFORM, this.settings.transform);

        this.applySettings();
        document.getElementById('settings-dialog').classList.remove('active');
        this.uiManager.showNotification('Settings saved successfully!');
    }

    /**
     * Reset settings to defaults
     */
    resetSettings() {
        Object.values(CONFIG.STORAGE).forEach(key => localStorage.removeItem(key));

        this.settings = {
            defaultVolume: 50,
            defaultTempo: 133,
            showTooltips: true,
            enableSounds: true,
            transform: 0
        };

        this.currentTheme = CONFIG.UI.THEMES.DARK;
        this.uiManager.applyTheme(this.currentTheme);
        this.applySettings();
        this.loadSettingsIntoDialog();
        this.uiManager.showNotification('Settings reset to defaults!');
    }

    /**
     * Update all display elements
     */
    updateDisplay() {
        this.uiManager.updateDisplay({
            bpm: this.sequencer.bpm,
            currentPattern: this.sequencer.currentPatternId
        });
    }
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    window.ep133 = new EP133Simulator();
});
