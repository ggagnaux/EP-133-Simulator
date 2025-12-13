/**
 * EP-133 Simulator - Main Controller
 * Coordinates interactions between Audio, Sequencer, and UI modules.
 */

class EP133Simulator {
    constructor() {
        this.audioEngine = new AudioEngine();
        this.uiManager = new UIManager();
        this.sequencer = new Sequencer(this.audioEngine, this.uiManager);

        this.currentTab = 'output';
        this.currentMode = 'comp';
        this.isPoweredOn = true;

        // Settings
        this.settings = {
            defaultVolume: parseInt(localStorage.getItem(CONFIG.STORAGE.DEFAULT_VOLUME)) || 50,
            defaultTempo: parseInt(localStorage.getItem(CONFIG.STORAGE.DEFAULT_TEMPO)) || 133,
            showTooltips: localStorage.getItem(CONFIG.STORAGE.SHOW_TOOLTIPS) !== 'false',
            enableSounds: localStorage.getItem(CONFIG.STORAGE.ENABLE_SOUNDS) !== 'false',
            transform: parseFloat(localStorage.getItem(CONFIG.STORAGE.TRANSFORM)) || CONFIG.UI.DEFAULT_TRANSFORM_ANGLE
        };

        this.init();
    }

    init() {
        this.uiManager.init();
        this.audioEngine.init();

        this.setupEventListeners();
        this.applySettings();

        // Initial UI update
        this.uiManager.applyTheme(localStorage.getItem(CONFIG.STORAGE.THEME) || 'dark');
    }

    applySettings() {
        this.audioEngine.setVolume(this.settings.defaultVolume);
        this.sequencer.setBpm(this.settings.defaultTempo);
        this.uiManager.applyTransform(this.settings.transform);

        // Update UI controls to match settings
        const volSlider = document.getElementById('volume-default');
        if (volSlider) volSlider.value = this.settings.defaultVolume;

        const tempoSlider = document.getElementById('tempo-default');
        if (tempoSlider) tempoSlider.value = this.settings.defaultTempo;
    }

    setupEventListeners() {
        // --- Menu Interactions ---
        document.querySelectorAll(CONFIG.UI.SELECTORS.MENU_BTNS).forEach(btn => {
            btn.addEventListener('click', (e) => this.handleMenuClick(e.currentTarget.dataset.menu));
        });

        // --- Tab Switching ---
        document.querySelectorAll(CONFIG.UI.SELECTORS.TABS).forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
        });

        // --- Control Buttons ---
        document.querySelectorAll(CONFIG.UI.SELECTORS.CONTROL_BTNS).forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.currentTarget.dataset.btn));
        });

        // --- Pads ---
        document.querySelectorAll(CONFIG.UI.SELECTORS.PADS).forEach(pad => {
            const padId = pad.dataset.pad;

            // Mouse events
            pad.addEventListener('mousedown', (e) => {
                if (e.button === 0) this.handlePadPress(padId);
            });
            pad.addEventListener('mouseup', () => this.handlePadRelease(padId));
            pad.addEventListener('mouseleave', () => this.handlePadRelease(padId));

            // Touch events
            pad.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handlePadPress(padId);
            });
            pad.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handlePadRelease(padId);
            });
        });

        // --- Transport ---
        document.querySelectorAll(CONFIG.UI.SELECTORS.TRANSPORT_BTNS).forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTransport(e.currentTarget.dataset.transport));
        });

        // --- Keyboard Shortcuts ---
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('keyup', (e) => this.handleKeyRelease(e));

        // --- Dialogs ---
        this.setupDialogListeners();
    }

    handlePadPress(padId) {
        if (!this.isPoweredOn || !padId) return;

        // Visual feedback
        this.uiManager.highlightPad(padId, true);

        // Audio feedback
        if (this.settings.enableSounds) {
            this.audioEngine.playPadSound(padId);
        }

        // Logic
        switch (padId) {
            case 'play':
                this.sequencer.togglePlay();
                break;
            case 'record':
                this.sequencer.toggleRecord();
                break;
            // Add other special pad logic here
        }
    }

    handlePadRelease(padId) {
        if (!this.isPoweredOn || !padId) return;

        this.uiManager.highlightPad(padId, false);
        // Note: We don't stop audio immediately on release for one-shot feel, 
        // but AudioEngine handles envelope decay.
    }

    handleTransport(action) {
        if (!this.isPoweredOn) return;

        switch (action) {
            case 'play':
                this.sequencer.togglePlay();
                break;
            case 'rec':
                this.sequencer.toggleRecord();
                break;
            // Add seq/write logic
        }
    }

    handleKeyPress(e) {
        if (!this.isPoweredOn || e.repeat) return;

        const keyMap = {
            ' ': 'play',
            'Enter': 'enter',
            'r': 'record',
            '1': '1', '2': '2', '3': '3',
            '4': '4', '5': '5', '6': '6',
            '7': '7', '8': '8', '9': '9',
            '0': '0'
        };

        const padId = keyMap[e.key];
        if (padId) {
            this.handlePadPress(padId);
        }
    }

    handleKeyRelease(e) {
        if (!this.isPoweredOn) return;

        const keyMap = {
            ' ': 'play',
            'Enter': 'enter',
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

    // --- Menu & Dialog Logic (Simplified for brevity, similar to original) ---

    handleMenuClick(menu) {
        if (!this.isPoweredOn) return;

        if (menu === 'settings') {
            this.showSettingsDialog();
        } else if (menu === 'about') {
            this.showAboutDialog();
        }
    }

    showSettingsDialog() {
        const dialog = document.getElementById('settings-dialog');
        if (dialog) dialog.classList.add('active');
    }

    showAboutDialog() {
        const dialog = document.getElementById('about-dialog');
        if (dialog) dialog.classList.add('active');
    }

    setupDialogListeners() {
        // Close buttons
        document.querySelectorAll('.dialog-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.dialog-overlay').classList.remove('active');
            });
        });

        // Theme toggles
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.uiManager.applyTheme(theme);
                localStorage.setItem(CONFIG.STORAGE.THEME, theme);
            });
        });

        // Save settings
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // Save logic would go here
                document.getElementById('settings-dialog').classList.remove('active');
                this.uiManager.showNotification('Settings Saved');
            });
        }
    }

    switchTab(tab) {
        if (tab === 'power') {
            this.togglePower();
            return;
        }

        if (!this.isPoweredOn) return;

        document.querySelectorAll(CONFIG.UI.SELECTORS.TABS).forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.currentTab = tab;
    }

    togglePower() {
        this.isPoweredOn = !this.isPoweredOn;
        this.uiManager.togglePower(this.isPoweredOn);

        if (!this.isPoweredOn) {
            this.sequencer.stop();
            this.audioEngine.stopAllSounds();
        }
    }

    switchMode(mode) {
        if (!this.isPoweredOn) return;

        document.querySelectorAll(CONFIG.UI.SELECTORS.CONTROL_BTNS).forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-btn="${mode}"]`).classList.add('active');
        this.currentMode = mode;
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    window.ep133 = new EP133Simulator();
});
