
class EP133Simulator {
    constructor() {
        this.isPlaying = false;
        this.isRecording = false;
        this.currentPattern = 1;
        this.bpm = 133;
        this.volume = 50;
        this.tempo = 50;
        this.pitch = 50;
        this.currentTab = 'output';
        this.currentMode = 'comp';
        this.activePads = new Set();
        this.sequences = {};
        this.audioContext = null;
        this.oscillators = {};
        this.currentTheme = localStorage.getItem('ep133-theme') || 'dark';
        this.settings = {
            defaultVolume: parseInt(localStorage.getItem('ep133-default-volume')) || 50,
            defaultTempo: parseInt(localStorage.getItem('ep133-default-tempo')) || 133,
            showTooltips: localStorage.getItem('ep133-show-tooltips') !== 'false',
            enableSounds: localStorage.getItem('ep133-enable-sounds') !== 'false',
            transform: parseFloat(localStorage.getItem('ep133-transform')) || DEFAULT_TRANSFORM_ANGLE
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAudio();
        this.applyTheme();
        this.applySettings();
        this.updateDisplay();
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio context not supported');
        }
    }


    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        //this.updateThemeIcon();
    }


    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('ep133-theme', this.currentTheme);
        this.applyTheme();
    }

    showSettingsDialog() {
        const dialog = document.getElementById('settings-dialog');
        if (dialog) {
            this.loadSettingsIntoDialog();
            dialog.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideSettingsDialog() {
        const dialog = document.getElementById('settings-dialog');
        if (dialog) {
            dialog.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    loadSettingsIntoDialog() {
        // Set current theme
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === this.currentTheme) {
                btn.classList.add('active');
            }
        });

        // Set slider values
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

        // Set checkbox values
        const showTooltips = document.getElementById('show-tooltips');
        const enableSounds = document.getElementById('enable-sounds');

        if (showTooltips) {
            showTooltips.checked = this.settings.showTooltips;
        }

        if (enableSounds) {
            enableSounds.checked = this.settings.enableSounds;
        }
    }

    selectTheme(theme) {
        // Remove active class from all theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));

        // Add active class to selected theme button
        const selectedBtn = document.querySelector(`[data-theme="${theme}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Apply theme immediately
        this.currentTheme = theme;
        this.applyTheme();
    }

    saveSettings() {
        // Get values from dialog
        const volumeSlider = document.getElementById('volume-default');
        const tempoSlider = document.getElementById('tempo-default');
        const transformSlider = document.getElementById('transform-value');
        const showTooltips = document.getElementById('show-tooltips');
        const enableSounds = document.getElementById('enable-sounds');

        // Update settings object
        this.settings.defaultVolume = parseInt(volumeSlider.value);
        this.settings.defaultTempo = parseInt(tempoSlider.value);
        this.settings.transform = parseFloat(transformSlider.value);
        this.settings.showTooltips = showTooltips.checked;
        this.settings.enableSounds = enableSounds.checked;

        // Save to localStorage
        localStorage.setItem('ep133-theme', this.currentTheme);
        localStorage.setItem('ep133-default-volume', this.settings.defaultVolume);
        localStorage.setItem('ep133-default-tempo', this.settings.defaultTempo);
        localStorage.setItem('ep133-transform', this.settings.transform);
        localStorage.setItem('ep133-show-tooltips', this.settings.showTooltips);
        localStorage.setItem('ep133-enable-sounds', this.settings.enableSounds);

        // Apply settings
        this.applySettings();

        // Close dialog
        this.hideSettingsDialog();

        // Show success message
        this.showNotification('Settings saved successfully!');
    }

    resetSettings() {
        // Reset to defaults
        this.currentTheme = 'dark';
        this.settings = {
            defaultVolume: 50,
            defaultTempo: 133,
            showTooltips: true,
            enableSounds: true,
            transform: DEFAULT_TRANSFORM_ANGLE
        };

        // Clear localStorage
        localStorage.removeItem('ep133-theme');
        localStorage.removeItem('ep133-default-volume');
        localStorage.removeItem('ep133-default-tempo');
        localStorage.removeItem('ep133-transform');
        localStorage.removeItem('ep133-show-tooltips');
        localStorage.removeItem('ep133-enable-sounds');

        // Apply settings
        this.applyTheme();
        this.applySettings();

        // Reload dialog
        this.loadSettingsIntoDialog();

        // Show notification
        this.showNotification('Settings reset to defaults!');
    }

    applySettings() {
        // Apply default volume and tempo
        this.volume = this.settings.defaultVolume;
        this.bpm = this.settings.defaultTempo;

        // Apply transform
        this.applyTransform();

        // Update display
        this.updateDisplay();
    }

    applyTransform() {
        const device = document.querySelector('.ep133-device');
        if (device) {
            device.style.transform = `rotateX(${this.settings.transform}deg)`;
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--text-accent);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            z-index: 2000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    setupEventListeners() {
        // Menu button interactions
        document.querySelectorAll('.menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleMenuClick(e.target.closest('.menu-btn').dataset.menu);
            });

            // Touch events for mobile
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.classList.add('touch-active');
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('touch-active');
                this.handleMenuClick(btn.dataset.menu);
            });
        });

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.btn);
            });

            // Touch events for mobile
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.switchMode(e.target.dataset.btn);
            });
        });

        // Pads
        document.querySelectorAll('.pad').forEach(pad => {
            pad.addEventListener('mousedown', (e) => {
                this.handlePadPress(e.target.dataset.pad);
            });

            pad.addEventListener('mouseup', (e) => {
                this.handlePadRelease(e.target.dataset.pad);
            });

            // Prevent context menu on right click
            pad.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });

            // Touch events for mobile
            pad.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handlePadPress(e.target.dataset.pad);
            });

            pad.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handlePadRelease(e.target.dataset.pad);
            });
        });

        // Transport buttons
        document.querySelectorAll('.transport-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleTransport(e.target.dataset.transport);
            });
        });

        // Knobs
        document.querySelectorAll('.knob').forEach(knob => {
            knob.addEventListener('mousedown', (e) => {
                this.startKnobDrag(e, knob);
            });
        });

        // Slider
        const slider = document.querySelector('.slider');
        if (slider) {
            slider.addEventListener('input', (e) => {
                this.handleSlider(e.target.value);
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });

        document.addEventListener('keyup', (e) => {
            this.handleKeyRelease(e);
        });

        // Dialog event listeners
        this.setupDialogEventListeners();
    }

    switchTab(tab) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        this.currentTab = tab;
        this.updateDisplay();
    }

    switchMode(mode) {
        // Remove active class from all control buttons
        document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        document.querySelector(`[data-btn="${mode}"]`).classList.add('active');

        this.currentMode = mode;
        this.updateDisplay();
    }

    handleMenuClick(menuItem) {
        // Remove active class from all menu buttons
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked menu button
        const clickedBtn = document.querySelector(`[data-menu="${menuItem}"]`);
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }

        // Handle different menu actions
        switch (menuItem) {
            case 'samples':
                this.showSamplesMenu();
                break;
            case 'patterns':
                this.showPatternsMenu();
                break;
            case 'settings':
                this.showSettingsMenu();
                break;
            case 'help':
                this.showHelpMenu();
                break;
            case 'about':
                this.showAboutMenu();
                break;
        }
    }

    showSamplesMenu() {
        console.log('Samples menu selected');
        // TODO: Implement samples management interface
    }

    showPatternsMenu() {
        console.log('Patterns menu selected');
        // TODO: Implement patterns management interface
    }

    showSettingsMenu() {
        console.log('Settings menu selected');
        this.showSettingsDialog();
    }

    showHelpMenu() {
        console.log('Help menu selected');
        // TODO: Implement help interface
    }

    showAboutMenu() {
        console.log('About menu selected');
        this.showAboutDialog();
    }

    showAboutDialog() {
        const dialog = document.getElementById('about-dialog');
        if (dialog) {
            dialog.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    hideAboutDialog() {
        const dialog = document.getElementById('about-dialog');
        if (dialog) {
            dialog.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    setupDialogEventListeners() {
        // Close button for about dialog
        const closeBtn = document.getElementById('close-about-dialog');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAboutDialog();
            });
        }

        // Close dialog when clicking outside
        const dialog = document.getElementById('about-dialog');
        if (dialog) {
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    this.hideAboutDialog();
                }
            });
        }

        // Settings dialog event listeners
        this.setupSettingsDialogEventListeners();

        // Close dialog with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const aboutDialog = document.getElementById('about-dialog');
                const settingsDialog = document.getElementById('settings-dialog');
                if (aboutDialog && aboutDialog.classList.contains('active')) {
                    this.hideAboutDialog();
                } else if (settingsDialog && settingsDialog.classList.contains('active')) {
                    this.hideSettingsDialog();
                }
            }
        });
    }

    setupSettingsDialogEventListeners() {
        // Close button for settings dialog
        const closeBtn = document.getElementById('close-settings-dialog');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideSettingsDialog();
            });
        }

        // Close settings dialog when clicking outside
        const dialog = document.getElementById('settings-dialog');
        if (dialog) {
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    this.hideSettingsDialog();
                }
            });
        }

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.selectTheme(theme);
            });
        });

        // Settings sliders
        const volumeSlider = document.getElementById('volume-default');
        const tempoSlider = document.getElementById('tempo-default');
        const transformSlider = document.getElementById('transform-value');

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = value;
            });
        }

        if (tempoSlider) {
            tempoSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = value + ' BPM';
            });
        }

        if (transformSlider) {
            transformSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                e.target.nextElementSibling.textContent = value + '°';
            });
        }

        // Save and reset buttons
        const saveBtn = document.getElementById('save-settings');
        const resetBtn = document.getElementById('reset-settings');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    }

    handlePadPress(padId) {
        if (!padId) return;

        const pad = document.querySelector(`[data-pad="${padId}"]`);
        if (!pad) return;

        // Visual feedback
        pad.classList.add('active');
        this.activePads.add(padId);

        // Play sound based on pad
        this.playPadSound(padId);

        // Handle specific pad functions
        switch (padId) {
            case 'play':
                this.togglePlay();
                break;
            case 'mute':
                this.toggleMute();
                break;
            case 'trig':
                this.triggerSequence();
                break;
            case 'lift':
                this.liftSample();
                break;
            case 'punch':
                this.punchIn();
                break;
            case 'chop':
                this.chopSample();
                break;
            case 'accent':
                this.toggleAccent();
                break;
            default:
                if (!isNaN(padId)) {
                    this.selectPattern(parseInt(padId));
                }
                break;
        }

        this.updateDisplay();
    }

    handlePadRelease(padId) {
        if (!padId) return;

        const pad = document.querySelector(`[data-pad="${padId}"]`);
        if (pad && !['mute', 'accent'].includes(padId)) {
            pad.classList.remove('active');
        }

        this.activePads.delete(padId);
        this.stopPadSound(padId);
    }

    playPadSound(padId) {
        if (!this.audioContext) return;

        // Create a simple oscillator for demonstration
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Different frequencies for different pads
        const frequencies = {
            '1': 261.63, '2': 293.66, '3': 329.63,
            '4': 349.23, '5': 392.00, '6': 440.00,
            '7': 493.88, '8': 523.25, '9': 587.33,
            '0': 659.25
        };

        oscillator.frequency.setValueAtTime(
            frequencies[padId] || 440,
            this.audioContext.currentTime
        );

        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);

        this.oscillators[padId] = oscillator;
    }

    stopPadSound(padId) {
        if (this.oscillators[padId]) {
            try {
                this.oscillators[padId].stop();
            } catch (e) {
                // Oscillator might already be stopped
            }
            delete this.oscillators[padId];
        }
    }

    handleTransport(action) {
        switch (action) {
            case 'play':
                this.togglePlay();
                break;
            case 'rec':
                this.toggleRecord();
                break;
            case 'seq':
                this.toggleSequencer();
                break;
            case 'write':
                this.writeSequence();
                break;
        }
        this.updateDisplay();
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;

        const playBtn = document.querySelector('[data-pad="play"]');
        const playIcon = document.querySelector('.play-button');

        if (this.isPlaying) {
            if (playBtn) playBtn.classList.add('active');
            if (playIcon) playIcon.classList.add('active');
            this.startSequencer();
        } else {
            if (playBtn) playBtn.classList.remove('active');
            if (playIcon) playIcon.classList.remove('active');
            this.stopSequencer();
        }
    }

    toggleRecord() {
        this.isRecording = !this.isRecording;

        const recBtn = document.querySelector('[data-transport="rec"]');
        const statusLight = document.querySelector('.status-light.red');

        if (this.isRecording) {
            recBtn.classList.add('active');
            statusLight.classList.add('active');
        } else {
            recBtn.classList.remove('active');
            statusLight.classList.remove('active');
        }
    }

    startSequencer() {
        if (this.sequencerInterval) {
            clearInterval(this.sequencerInterval);
        }

        // Start status icon animation
        this.startStatusIconAnimation();

        const stepTime = 60000 / (this.bpm * 4); // 16th notes
        let currentStep = 0;

        this.sequencerInterval = setInterval(() => {
            this.playStep(currentStep);
            currentStep = (currentStep + 1) % 16;
        }, stepTime);
    }

    stopSequencer() {
        if (this.sequencerInterval) {
            clearInterval(this.sequencerInterval);
            this.sequencerInterval = null;
        }

        // Stop status icon animation
        this.stopStatusIconAnimation();
    }

    startStatusIconAnimation() {
        if (this.statusIconAnimationInterval) {
            clearInterval(this.statusIconAnimationInterval);
        }

        const statusIcons = document.querySelectorAll('.status-icon');
        const totalIcons = statusIcons.length;
        let currentIconIndex = 0;

        // Calculate timing based on BPM - complete cycle in one bar (4 beats)
        const cycleDuration = (60000 / this.bpm) * 4; // Duration for one complete cycle
        const iconInterval = cycleDuration / totalIcons; // Time per icon

        // Reset all icons first
        statusIcons.forEach(icon => {
            icon.classList.remove('active');
        });

        this.statusIconAnimationInterval = setInterval(() => {
            // Disable previous icon
            if (currentIconIndex > 0) {
                statusIcons[currentIconIndex - 1].classList.remove('active');
            } else if (currentIconIndex === 0 && statusIcons[totalIcons - 1]) {
                statusIcons[totalIcons - 1].classList.remove('active');
            }

            // Enable current icon
            if (statusIcons[currentIconIndex]) {
                statusIcons[currentIconIndex].classList.add('active');
            }

            // Move to next icon
            currentIconIndex = (currentIconIndex + 1) % totalIcons;
        }, iconInterval);
    }

    stopStatusIconAnimation() {
        if (this.statusIconAnimationInterval) {
            clearInterval(this.statusIconAnimationInterval);
            this.statusIconAnimationInterval = null;
        }

        // Clear all active status icons
        const statusIcons = document.querySelectorAll('.status-icon');
        statusIcons.forEach(icon => {
            icon.classList.remove('active');
        });
    }

    playStep(step) {
        // Highlight current step (simple implementation)
        const stepIndicator = document.querySelector('.pattern-number');
        if (stepIndicator) {
            stepIndicator.style.color = step % 4 === 0 ? '#ffff00' : '#00ff00';
        }
    }

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

    getKnobValue(control) {
        switch (control) {
            case 'volume': return this.volume;
            case 'tempo': return this.tempo;
            case 'pitch': return this.pitch;
            default: return 50;
        }
    }

    setKnobValue(control, value) {
        switch (control) {
            case 'volume':
                this.volume = value;
                break;
            case 'tempo':
                this.tempo = value;
                this.bpm = Math.round(MIN_TEMPO + (value / 100) * 120); // 60-180 BPM
                // Restart sequencer if playing to apply new BPM immediately
                if (this.isPlaying) {
                    this.startSequencer();
                }
                break;
            case 'pitch':
                this.pitch = value;
                break;
        }
        this.updateDisplay();
    }

    updateKnobRotation(knob, value) {
        const rotation = (value / 100) * 270 - 135; // -135 to +135 degrees
        knob.style.transform = `rotate(${rotation}deg)`;
    }

    handleKeyPress(e) {
        // Map keyboard to pads
        const keyMap = {
            '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8',
            '9': '9', '0': '0',
            ' ': 'play', // Spacebar for play
            'r': 'rec',
            'Enter': 'seq'
        };

        const padId = keyMap[e.key];
        if (padId && !e.repeat) {
            this.handlePadPress(padId);
        }
    }

    handleKeyRelease(e) {
        const keyMap = {
            '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8',
            '9': '9', '0': '0'
        };

        const padId = keyMap[e.key];
        if (padId) {
            this.handlePadRelease(padId);
        }
    }

    selectPattern(number) {
        this.currentPattern = number;
        this.updateDisplay();
    }

    toggleMute() {
        // Toggle mute functionality
        console.log('Mute toggled');
    }

    triggerSequence() {
        // Trigger sequence functionality
        console.log('Sequence triggered');
    }

    liftSample() {
        // Lift sample functionality
        console.log('Sample lifted');
    }

    punchIn() {
        // Punch in functionality
        console.log('Punch in activated');
    }

    chopSample() {
        // Chop sample functionality
        console.log('Sample chopped');
    }

    toggleAccent() {
        // Toggle accent functionality
        console.log('Accent toggled');
    }

    toggleSequencer() {
        // Toggle sequencer functionality
        console.log('Sequencer toggled');
    }

    writeSequence() {
        // Write sequence functionality
        console.log('Sequence written');
    }

    handleSlider(value) {
        // Handle crossfader
        console.log('Crossfader:', value);
    }

    updateDisplay() {
        // Update BPM display
        const bpmDisplay = document.querySelector('.bpm-display');
        if (bpmDisplay) {
            bpmDisplay.textContent = this.bpm;
        }

        // Update pattern number
        const patternDisplay = document.querySelector('.pattern-number');
        if (patternDisplay) {
            patternDisplay.textContent = this.currentPattern;
        }

        // Update status indicators based on current mode and tab
        this.updateStatusIndicators();
    }

    updateStatusIndicators() {
        // Update various status indicators based on current state
        const fxIndicator = document.querySelector('.fx-indicator');
        if (fxIndicator) {
            fxIndicator.style.opacity = this.currentTab === 'fx' ? '1' : '0.3';
        }
    }

    // Status icon management methods
    setStatusIcon(iconNumber, active = true) {
        const icon = document.querySelector(`[data-icon^="${iconNumber}"]`);
        let iconPairElement = null;
        let pairId = null;

        if (icon) {

            // Is this icon part of an icon pair?
            switch (iconNumber) {
                case STATUSID_SOUNDMODE: pairId = STATUSID_SOUNDMODE2; break;
                case STATUSID_SOUNDMODE2: pairId = STATUSID_SOUNDMODE; break;
                case STATUSID_MAINMODE: pairId = STATUSID_MAINMODE2; break;
                case STATUSID_MAINMODE2: pairId = STATUSID_MAINMODE; break;
                case STATUSID_TEMPO: pairId = STATUSID_TEMPO2; break;
                case STATUSID_TEMPO2: pairId = STATUSID_TEMPO; break;
                case STATUSID_ERASE: pairId = STATUSID_ERASE2; break;
                case STATUSID_ERASE2: pairId = STATUSID_ERASE; break;
                case STATUSID_SYSTEM: pairId = STATUSID_SYSTEM2; break;
                case STATUSID_SYSTEM2: pairId = STATUSID_SYSTEM; break;
                case STATUSID_SWING: pairId = STATUSID_SWING2; break;
                case STATUSID_SWING2: pairId = STATUSID_SWING; break;
                    break;
            }

            if (pairId != null) {
                iconPairElement = document.querySelector(`[data-icon="${pairId}"]`);
            }


            if (active) {
                icon.classList.add('active');
                iconPairElement?.classList.add('active');
            } else {
                icon.classList.remove('active');
                iconPairElement?.classList.remove('active');
            }
        }
    }

    clearAllStatusIcons() {
        const icons = document.querySelectorAll('.status-icon');
        icons.forEach(icon => {
            icon.classList.remove('active');
        });
    }

    setStatusIconPattern(pattern) {
        // pattern should be an array of 80 boolean values or icon numbers
        this.clearAllStatusIcons();
        pattern.forEach((isActive, index) => {
            if (isActive) {
                this.setStatusIcon(index + 1, true);
            }
        });
    }


}

let simulatorInstance = null;


// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    simulatorInstance = new EP133Simulator();
    window.EP133Debug.testSpriteIcons();
});

window.EP133Debug = {
    logState: function () {
        if (simulatorInstance) {
            console.log('EP-133 Simulator State:', {
                playing: simulatorInstance.isPlaying,
                recording: simulatorInstance.isRecording,
                pattern: simulatorInstance.currentPattern,
                bpm: simulatorInstance.bpm,
                mode: simulatorInstance.currentMode,
                tab: simulatorInstance.currentTab
            });
        }
    },

    // Status icon debug functions
    testStatusIcons: function () {
        if (simulatorInstance) {
            // Test pattern - activate every 5th icon
            const pattern = Array(80).fill(false).map((_, i) => (i + 1) % 5 === 0);
            simulatorInstance.setStatusIconPattern(pattern);
            console.log('Test pattern applied to status icons');
        }
    },

    clearStatusIcons: function () {
        if (simulatorInstance) {
            simulatorInstance.clearAllStatusIcons();
            console.log('All status icons cleared');
        }
    },

    setRandomIcons: function () {
        if (simulatorInstance) {
            const pattern = Array(80).fill(false).map(() => Math.random() > 0.7);
            simulatorInstance.setStatusIconPattern(pattern);
            console.log('Random pattern applied to status icons');
        }
    },

    // Test sprite functionality

    testSpriteIcons: function () {
        if (simulatorInstance) {
            // Test a few specific icons to verify spriting works
            simulatorInstance.clearAllStatusIcons();
            simulatorInstance.setStatusIcon(STATUSID_BATTERY, true);  // First icon
            simulatorInstance.setStatusIcon(STATUSID_YLEVEL3, true); // Last icon of first row
            simulatorInstance.setStatusIcon(STATUSID_MUTE, true); // First icon of second row
            simulatorInstance.setStatusIcon(STATUSID_YLEVEL4, true); // Last icon of second row
            simulatorInstance.setStatusIcon(STATUSID_KEYSMODE, true); // First icon of third row
            simulatorInstance.setStatusIcon(STATUSID_FREETIMEMODE, true); // Last icon of third row
            simulatorInstance.setStatusIcon(STATUSID_FADERAUTOMATION, true); // First icon of fourth row
            simulatorInstance.setStatusIcon(STATUSID_SWING2, true); // Last icon
            console.log('Sprite test pattern applied - check if icons display correctly');
        }
    },

    testSpriteIconPairs: function () {
        if (simulatorInstance) {
            // Test a few specific icons to verify spriting works
            simulatorInstance.clearAllStatusIcons();

            // Set the first icon of each icon pair.
            // The paired icon should also activate/deactivate
            simulatorInstance.setStatusIcon(STATUSID_SOUNDMODE, true);
            simulatorInstance.setStatusIcon(STATUSID_MAINMODE, true);
            simulatorInstance.setStatusIcon(STATUSID_ERASE, true);
            simulatorInstance.setStatusIcon(STATUSID_SYSTEM, true);
            simulatorInstance.setStatusIcon(STATUSID_SWING, true);

            console.log('Sprite test pattern applied - check if icons display correctly');
        }
    }
};
