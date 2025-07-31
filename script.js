const MIN_TEMPO = 60;
const MAX_TEMPO = 180;

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
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAudio();
        this.updateDisplay();
        this.applyTheme();
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
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('ep133-theme', this.currentTheme);
        this.applyTheme();
    }

    updateThemeIcon() {
        const themeBtn = document.querySelector('[data-menu="theme"]');
        if (themeBtn) {
            const icon = themeBtn.querySelector('.menu-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
            }
        }
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
            case 'theme':
                this.toggleTheme();
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
        // TODO: Implement settings interface
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
        
        // Close dialog with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const dialog = document.getElementById('about-dialog');
                if (dialog && dialog.classList.contains('active')) {
                    this.hideAboutDialog();
                }
            }
        });
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
        
        const playBtn = document.querySelector('[data-transport="play"]');
        const playIcon = document.querySelector('.play-button');
        
        if (this.isPlaying) {
            playBtn.classList.add('active');
            playIcon.classList.add('active');
            this.startSequencer();
        } else {
            playBtn.classList.remove('active');
            playIcon.classList.remove('active');
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
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EP133Simulator();
});

// Add some global functions for debugging
window.EP133Debug = {
    logState: function() {
        console.log('EP-133 Simulator State:', {
            playing: this.isPlaying,
            recording: this.isRecording,
            pattern: this.currentPattern,
            bpm: this.bpm,
            mode: this.currentMode,
            tab: this.currentTab
        });
    }
};
