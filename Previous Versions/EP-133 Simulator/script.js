class EP133Simulator {
    constructor() {
        this.isPlaying = false;
        this.isRecording = false;
        this.currentStep = 0;
        this.tempo = 120;
        this.swing = 0;
        this.currentPattern = 1;
        this.currentTrack = 1;
        this.mode = 'pattern';
        this.stepInterval = null;
        this.audioContext = null;
        this.patterns = {};
        this.sounds = {};
        this.knobValues = {
            volume: 0.7,
            filter: 0.5,
            decay: 0.5,
            pitch: 0.5
        };
        
        this.init();
    }

    init() {
        this.initAudio();
        this.initPatterns();
        this.bindEvents();
        this.updateDisplay();
        this.createSounds();
        
        // Set initial mode button state
        document.querySelector('[data-action="pattern"]').closest('.mode-btn').classList.add('active');
        
        // Initialize tempo display
        document.getElementById('tempoValue').textContent = this.tempo;
        document.getElementById('swingValue').textContent = this.swing;
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    initPatterns() {
        // Initialize 16 patterns with 12 tracks each
        for (let p = 1; p <= 16; p++) {
            this.patterns[p] = {};
            for (let t = 1; t <= 12; t++) {
                this.patterns[p][t] = new Array(16).fill(false);
            }
        }
    }

    createSounds() {
        // Create basic drum sounds using Web Audio API
        this.sounds = {
            1: this.createKickSound(),
            2: this.createSnareSound(),
            3: this.createHiHatSound(),
            4: this.createOpenHatSound(),
            5: this.createClapSound(),
            6: this.createCrashSound(),
            7: this.createRideSound(),
            8: this.createPercSound(),
            9: this.createBassSound(),
            10: this.createSynthSound(),
            11: this.createLeadSound(),
            12: this.createPadSound()
        };
    }

    createKickSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
            
            filter.type = 'lowpass';
            filter.frequency.value = 100;
            
            gainNode.gain.setValueAtTime(this.knobValues.volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        };
    }

    createSnareSound() {
        return () => {
            if (!this.audioContext) return;
            
            const bufferSize = this.audioContext.sampleRate * 0.1;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 1000;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            noise.start(this.audioContext.currentTime);
        };
    }

    createHiHatSound() {
        return () => {
            if (!this.audioContext) return;
            
            const bufferSize = this.audioContext.sampleRate * 0.05;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 10000;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            noise.start(this.audioContext.currentTime);
        };
    }

    createOpenHatSound() {
        return () => {
            if (!this.audioContext) return;
            
            const bufferSize = this.audioContext.sampleRate * 0.3;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1);
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 8000;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            noise.start(this.audioContext.currentTime);
        };
    }

    createClapSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Multiple short bursts for clap effect
            for (let burst = 0; burst < 3; burst++) {
                setTimeout(() => {
                    const bufferSize = this.audioContext.sampleRate * 0.01;
                    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                    const output = buffer.getChannelData(0);
                    
                    for (let i = 0; i < bufferSize; i++) {
                        output[i] = (Math.random() * 2 - 1);
                    }
                    
                    const noise = this.audioContext.createBufferSource();
                    noise.buffer = buffer;
                    
                    const filter = this.audioContext.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 2000;
                    
                    const gainNode = this.audioContext.createGain();
                    gainNode.gain.setValueAtTime(this.knobValues.volume * 0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                    
                    noise.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    noise.start(this.audioContext.currentTime);
                }, burst * 10);
            }
        };
    }

    createCrashSound() {
        return () => {
            if (!this.audioContext) return;
            
            const bufferSize = this.audioContext.sampleRate * 2;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.5);
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 5000;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            noise.start(this.audioContext.currentTime);
        };
    }

    createRideSound() {
        return () => {
            if (!this.audioContext) return;
            
            const bufferSize = this.audioContext.sampleRate * 0.5;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.8);
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 3000;
            
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.15, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            
            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            noise.start(this.audioContext.currentTime);
        };
    }

    createPercSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createBassSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 55 * Math.pow(2, (this.knobValues.pitch - 0.5) * 2);
            
            filter.type = 'lowpass';
            filter.frequency.value = 200 + (this.knobValues.filter * 1000);
            
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.4, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (0.5 * this.knobValues.decay + 0.1));
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + (0.5 * this.knobValues.decay + 0.1));
        };
    }

    createSynthSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.value = 220 * Math.pow(2, (this.knobValues.pitch - 0.5) * 2);
            
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (0.3 * this.knobValues.decay + 0.1));
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + (0.3 * this.knobValues.decay + 0.1));
        };
    }

    createLeadSound() {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.value = 440 * Math.pow(2, (this.knobValues.pitch - 0.5) * 2);
            
            filter.type = 'lowpass';
            filter.frequency.value = 500 + (this.knobValues.filter * 2000);
            
            gainNode.gain.setValueAtTime(this.knobValues.volume * 0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (0.4 * this.knobValues.decay + 0.1));
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + (0.4 * this.knobValues.decay + 0.1));
        };
    }

    createPadSound() {
        return () => {
            if (!this.audioContext) return;
            
            // Create multiple oscillators for a richer pad sound
            for (let i = 0; i < 3; i++) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.value = (110 + i * 55) * Math.pow(2, (this.knobValues.pitch - 0.5) * 2);
                
                gainNode.gain.setValueAtTime(this.knobValues.volume * 0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (1 * this.knobValues.decay + 0.5));
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + (1 * this.knobValues.decay + 0.5));
            }
        };
    }

    bindEvents() {
        // Pad events
        document.querySelectorAll('.pad').forEach(pad => {
            pad.addEventListener('click', (e) => this.handlePadClick(e));
        });

        // Transport controls
        document.getElementById('playBtn').addEventListener('click', () => this.togglePlay());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('recBtn').addEventListener('click', () => this.toggleRecord());

        // Control buttons (mode buttons and function buttons)
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]').dataset.action;
                if (['play', 'stop', 'record'].includes(action)) return; // Skip transport controls
                if (['left', 'right', 'ok'].includes(action)) {
                    this.handleNavClick(e);
                } else {
                    this.handleControlClick(e);
                }
            });
        });

        // Step LEDs for direct step editing
        document.querySelectorAll('.step-led').forEach((led, index) => {
            led.addEventListener('click', () => {
                if (this.mode === 'pattern' || this.mode === 'track') {
                    this.toggleStep(index, this.currentTrack);
                }
            });
        });

        // Knobs
        document.querySelectorAll('.knob').forEach(knob => {
            knob.addEventListener('mousedown', (e) => this.startKnobDrag(e));
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handlePadClick(e) {
        const padNumber = parseInt(e.target.dataset.pad);
        
        // Play sound
        if (this.sounds[padNumber]) {
            this.sounds[padNumber]();
            this.flashPad(padNumber);
        }

        // If recording, toggle step
        if (this.isRecording && this.isPlaying) {
            this.toggleStep(this.currentStep, padNumber);
        }
    }

    flashPad(padNumber) {
        const pad = document.querySelector(`[data-pad="${padNumber}"]`);
        pad.classList.add('playing');
        setTimeout(() => {
            pad.classList.remove('playing');
        }, 200);
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        document.getElementById('playBtn').classList.add('active');
        
        const stepDuration = this.calculateStepDuration();
        
        this.stepInterval = setInterval(() => {
            this.playStep();
            this.currentStep = (this.currentStep + 1) % 16;
            this.updateStepLEDs();
        }, stepDuration);
        
        this.updateDisplay();
    }

    pause() {
        this.isPlaying = false;
        document.getElementById('playBtn').classList.remove('active');
        
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
        }
        
        this.updateDisplay();
    }

    stop() {
        this.pause();
        this.currentStep = 0;
        this.updateStepLEDs();
        this.updateDisplay();
    }

    toggleRecord() {
        this.isRecording = !this.isRecording;
        const recBtn = document.getElementById('recBtn');
        
        if (this.isRecording) {
            recBtn.classList.add('active');
        } else {
            recBtn.classList.remove('active');
        }
        
        this.updateDisplay();
    }

    playStep() {
        const pattern = this.patterns[this.currentPattern];
        
        // Play all tracks that have a step at current position
        for (let track = 1; track <= 12; track++) {
            if (pattern[track] && pattern[track][this.currentStep]) {
                if (this.sounds[track]) {
                    this.sounds[track]();
                    this.flashPad(track);
                }
            }
        }
    }

    toggleStep(step, track) {
        const pattern = this.patterns[this.currentPattern];
        if (pattern[track]) {
            pattern[track][step] = !pattern[track][step];
            this.updateStepLEDs();
        }
    }

    updateStepLEDs() {
        document.querySelectorAll('.step-led').forEach((led, index) => {
            led.classList.remove('active', 'current');
            
            // Show current step
            if (index === this.currentStep) {
                led.classList.add('current');
            }
            
            // Show active steps for current track
            const pattern = this.patterns[this.currentPattern];
            if (pattern[this.currentTrack] && pattern[this.currentTrack][index]) {
                led.classList.add('active');
            }
        });
    }

    handleControlClick(e) {
        const action = e.target.closest('[data-action]').dataset.action;
        
        // Remove active class from mode buttons
        if (['pattern', 'track', 'sound', 'mixer'].includes(action)) {
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        }
        
        // Remove active class from tempo/swing buttons
        if (['tempo', 'swing'].includes(action)) {
            document.querySelectorAll('.tempo-btn, .swing-btn').forEach(btn => btn.classList.remove('active'));
        }
        
        switch (action) {
            case 'pattern':
                this.mode = 'pattern';
                e.target.closest('.mode-btn').classList.add('active');
                break;
            case 'track':
                this.mode = 'track';
                e.target.closest('.mode-btn').classList.add('active');
                break;
            case 'sound':
                this.mode = 'sound';
                e.target.closest('.mode-btn').classList.add('active');
                break;
            case 'mixer':
                this.mode = 'mixer';
                e.target.closest('.mode-btn').classList.add('active');
                break;
            case 'fx':
                this.mode = 'fx';
                break;
            case 'master':
                this.mode = 'master';
                break;
            case 'tempo':
                this.mode = 'tempo';
                e.target.closest('.tempo-btn').classList.add('active');
                break;
            case 'swing':
                this.mode = 'swing';
                e.target.closest('.swing-btn').classList.add('active');
                break;
            case 'copy':
                this.copyPattern();
                break;
            case 'paste':
                this.pastePattern();
                break;
            case 'clear':
                this.clearPattern();
                break;
            case 'shift':
                this.shiftMode = !this.shiftMode;
                const shiftBtn = e.target.closest('.func-btn');
                if (this.shiftMode) {
                    shiftBtn.classList.add('active');
                } else {
                    shiftBtn.classList.remove('active');
                }
                break;
        }
        
        this.updateDisplay();
    }

    handleNavClick(e) {
        const action = e.target.closest('[data-action]').dataset.action;
        
        switch (action) {
            case 'left':
                if (this.mode === 'pattern') {
                    this.currentPattern = Math.max(1, this.currentPattern - 1);
                } else if (this.mode === 'track') {
                    this.currentTrack = Math.max(1, this.currentTrack - 1);
                } else if (this.mode === 'tempo') {
                    this.adjustTempo(-1);
                } else if (this.mode === 'swing') {
                    this.adjustSwing(-1);
                }
                break;
            case 'right':
                if (this.mode === 'pattern') {
                    this.currentPattern = Math.min(16, this.currentPattern + 1);
                } else if (this.mode === 'track') {
                    this.currentTrack = Math.min(12, this.currentTrack + 1);
                } else if (this.mode === 'tempo') {
                    this.adjustTempo(1);
                } else if (this.mode === 'swing') {
                    this.adjustSwing(1);
                }
                break;
            case 'ok':
                // Context-dependent OK action
                if (this.mode === 'tempo') {
                    this.resetTempo();
                } else if (this.mode === 'swing') {
                    this.resetSwing();
                }
                break;
        }
        
        this.updateDisplay();
        this.updateStepLEDs();
        
        // Restart playback with new tempo if playing
        if (this.isPlaying && (this.mode === 'tempo' || this.mode === 'swing')) {
            this.restartPlayback();
        }
    }

    adjustTempo(direction) {
        const oldTempo = this.tempo;
        
        if (direction > 0) {
            this.tempo = Math.min(200, this.tempo + 5);
        } else {
            this.tempo = Math.max(60, this.tempo - 5);
        }
        
        // Update display
        document.getElementById('tempoValue').textContent = this.tempo;
        
        // If tempo changed and we're playing, restart with new timing
        if (oldTempo !== this.tempo && this.isPlaying) {
            this.restartPlayback();
        }
    }

    adjustSwing(direction) {
        if (direction > 0) {
            this.swing = Math.min(50, this.swing + 5);
        } else {
            this.swing = Math.max(-50, this.swing - 5);
        }
        
        // Update display
        document.getElementById('swingValue').textContent = this.swing;
        
        // If swing changed and we're playing, restart with new timing
        if (this.isPlaying) {
            this.restartPlayback();
        }
    }

    resetTempo() {
        this.tempo = 120;
        document.getElementById('tempoValue').textContent = this.tempo;
        
        if (this.isPlaying) {
            this.restartPlayback();
        }
    }

    resetSwing() {
        this.swing = 0;
        document.getElementById('swingValue').textContent = this.swing;
        
        if (this.isPlaying) {
            this.restartPlayback();
        }
    }

    restartPlayback() {
        // Stop current playback
        if (this.stepInterval) {
            clearInterval(this.stepInterval);
        }
        
        // Start with new timing
        const stepDuration = this.calculateStepDuration();
        
        this.stepInterval = setInterval(() => {
            this.playStep();
            this.currentStep = (this.currentStep + 1) % 16;
            this.updateStepLEDs();
        }, stepDuration);
    }

    calculateStepDuration() {
        // Base duration for 16th notes in milliseconds
        let stepDuration = (60 / this.tempo / 4) * 1000;
        
        // Apply swing (affects every other step)
        // Positive swing delays odd steps, negative swing rushes them
        const swingRatio = 1 + (this.swing / 100);
        
        // For now, we'll use the base duration
        // More complex swing implementation could alternate timing
        return stepDuration;
    }

    getSwingAdjustedDuration(stepIndex) {
        const baseDuration = (60 / this.tempo / 4) * 1000;
        
        // Apply swing to off-beats (steps 1, 3, 5, 7, 9, 11, 13, 15)
        if (stepIndex % 2 === 1) {
            const swingMultiplier = 1 + (this.swing / 100);
            return baseDuration * swingMultiplier;
        }
        
        return baseDuration;
    }

    startKnobDrag(e) {
        e.preventDefault();
        const knob = e.target.closest('.knob');
        const param = knob.dataset.param;
        const startY = e.clientY;
        const startValue = this.knobValues[param];
        
        const handleMouseMove = (e) => {
            const deltaY = startY - e.clientY;
            const newValue = Math.max(0, Math.min(1, startValue + deltaY / 100));
            this.knobValues[param] = newValue;
            this.updateKnobVisual(knob, newValue);
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    updateKnobVisual(knob, value) {
        const pointer = knob.querySelector('.knob-pointer');
        const rotation = (value - 0.5) * 270; // -135 to +135 degrees
        pointer.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }

    handleKeyDown(e) {
        // Keyboard shortcuts
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'Escape':
                this.stop();
                break;
            case 'KeyR':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleRecord();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (this.mode === 'tempo') {
                    this.adjustTempo(1);
                } else if (this.mode === 'swing') {
                    this.adjustSwing(1);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (this.mode === 'tempo') {
                    this.adjustTempo(-1);
                } else if (this.mode === 'swing') {
                    this.adjustSwing(-1);
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.handleNavClick({ target: { closest: () => ({ dataset: { action: 'left' } }) } });
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.handleNavClick({ target: { closest: () => ({ dataset: { action: 'right' } }) } });
                break;
            case 'Enter':
                e.preventDefault();
                this.handleNavClick({ target: { closest: () => ({ dataset: { action: 'ok' } }) } });
                break;
            case 'KeyT':
                e.preventDefault();
                this.mode = 'tempo';
                this.updateDisplay();
                break;
            case 'KeyS':
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    this.mode = 'swing';
                    this.updateDisplay();
                }
                break;
            case 'Digit1':
            case 'Digit2':
            case 'Digit3':
            case 'Digit4':
            case 'Digit5':
            case 'Digit6':
            case 'Digit7':
            case 'Digit8':
            case 'Digit9':
                e.preventDefault();
                const padNum = parseInt(e.code.slice(-1));
                if (padNum <= 12) {
                    this.handlePadClick({ target: { dataset: { pad: padNum } } });
                }
                break;
            case 'Digit0':
                e.preventDefault();
                this.handlePadClick({ target: { dataset: { pad: '10' } } });
                break;
            case 'Minus':
                e.preventDefault();
                this.handlePadClick({ target: { dataset: { pad: '11' } } });
                break;
            case 'Equal':
                e.preventDefault();
                this.handlePadClick({ target: { dataset: { pad: '12' } } });
                break;
        }
    }

    copyPattern() {
        this.clipboard = JSON.parse(JSON.stringify(this.patterns[this.currentPattern]));
        this.updateDisplay('COPIED');
    }

    pastePattern() {
        if (this.clipboard) {
            this.patterns[this.currentPattern] = JSON.parse(JSON.stringify(this.clipboard));
            this.updateStepLEDs();
            this.updateDisplay('PASTED');
        }
    }

    clearPattern() {
        this.patterns[this.currentPattern] = {};
        for (let t = 1; t <= 12; t++) {
            this.patterns[this.currentPattern][t] = new Array(16).fill(false);
        }
        this.updateStepLEDs();
        this.updateDisplay('CLEARED');
    }

    updateDisplay(message = null) {
        const displayText = document.getElementById('displayText');
        const displayLine2 = document.getElementById('displayLine2');
        
        if (message) {
            displayText.textContent = message;
            setTimeout(() => this.updateDisplay(), 1000);
            return;
        }
        
        let line1 = '';
        let line2 = '';
        
        switch (this.mode) {
            case 'pattern':
                line1 = `PATTERN ${this.currentPattern.toString().padStart(2, '0')}`;
                line2 = this.isPlaying ? 'PLAYING' : this.isRecording ? 'RECORDING' : 'READY';
                break;
            case 'track':
                line1 = `TRACK ${this.currentTrack.toString().padStart(2, '0')}`;
                line2 = this.getTrackName(this.currentTrack);
                break;
            case 'sound':
                line1 = 'SOUND EDIT';
                line2 = this.getTrackName(this.currentTrack);
                break;
            case 'mixer':
                line1 = 'MIXER';
                line2 = `VOL ${Math.round(this.knobValues.volume * 100)}`;
                break;
            case 'tempo':
                line1 = 'TEMPO';
                line2 = `${this.tempo} BPM`;
                break;
            case 'swing':
                line1 = 'SWING';
                line2 = `${this.swing > 0 ? '+' : ''}${this.swing}%`;
                break;
            case 'fx':
                line1 = 'FX';
                line2 = 'EFFECTS';
                break;
            case 'master':
                line1 = 'MASTER';
                line2 = 'OUTPUT';
                break;
            default:
                line1 = 'EP-133';
                line2 = 'READY';
        }
        
        displayText.textContent = line1;
        displayLine2.textContent = line2;
    }

    getTrackName(trackNumber) {
        const trackNames = {
            1: 'KICK',
            2: 'SNARE',
            3: 'HI-HAT',
            4: 'OPEN-HAT',
            5: 'CLAP',
            6: 'CRASH',
            7: 'RIDE',
            8: 'PERC',
            9: 'BASS',
            10: 'SYNTH',
            11: 'LEAD',
            12: 'PAD'
        };
        return trackNames[trackNumber] || 'TRACK';
    }
}

// Initialize the EP-133 simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EP133Simulator();
});

// Add some helper functions for browser compatibility
if (!window.AudioContext && window.webkitAudioContext) {
    window.AudioContext = window.webkitAudioContext;
}
