/**
 * EP-133 Simulator Audio Engine
 * Handles Web Audio API context and sound generation
 */

class AudioEngine {
    constructor() {
        this.context = null;
        this.oscillators = {};
        this.masterGain = null;
        this.volume = 0.5;
        this.enabled = false;
    }

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.setVolume(this.volume);
            this.enabled = true;
            console.log('Audio Engine initialized');
        } catch (error) {
            console.error('Audio context not supported', error);
            this.enabled = false;
        }
    }

    resume() {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    setVolume(value) {
        // Value between 0 and 100
        this.volume = Math.max(0, Math.min(100, value)) / 100;
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(this.volume, this.context.currentTime);
        }
    }

    playPadSound(padId) {
        if (!this.enabled || !this.context) return;

        this.resume();

        // Stop existing sound for this pad if any
        this.stopPadSound(padId);

        const frequency = CONFIG.AUDIO.FREQUENCIES[padId];
        if (!frequency) return; // Not a musical pad

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = CONFIG.AUDIO.DEFAULT_WAVEFORM;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

        // Envelope
        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + CONFIG.AUDIO.NOTE_DURATION);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(now + CONFIG.AUDIO.NOTE_DURATION);

        // Store reference to stop it later if needed
        this.oscillators[padId] = { osc: oscillator, gain: gainNode };

        // Cleanup after playback
        oscillator.onended = () => {
            delete this.oscillators[padId];
        };
    }

    stopPadSound(padId) {
        if (this.oscillators[padId]) {
            try {
                const { osc, gain } = this.oscillators[padId];
                // Quick fade out to avoid clicks
                gain.gain.cancelScheduledValues(this.context.currentTime);
                gain.gain.setValueAtTime(gain.gain.value, this.context.currentTime);
                gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.05);
                osc.stop(this.context.currentTime + 0.05);
            } catch (e) {
                // Ignore errors if already stopped
            }
            delete this.oscillators[padId];
        }
    }

    stopAllSounds() {
        Object.keys(this.oscillators).forEach(padId => this.stopPadSound(padId));
    }
}
