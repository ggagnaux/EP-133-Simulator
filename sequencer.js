/**
 * EP-133 Simulator Sequencer
 * Handles timing, patterns, and playback logic
 */

class Sequencer {
    constructor(audioEngine, uiManager) {
        this.audioEngine = audioEngine;
        this.uiManager = uiManager;

        this.isPlaying = false;
        this.isRecording = false;
        this.bpm = CONFIG.SEQUENCER.DEFAULT_TEMPO;
        this.currentStep = 0;
        this.intervalId = null;

        // Simple pattern structure: 16 steps, each can have multiple pad triggers
        // For now, just storing visual "active" steps for demo purposes
        this.patterns = {
            1: Array(16).fill(null)
        };
        this.currentPatternId = 1;
    }

    setBpm(bpm) {
        this.bpm = Math.max(CONFIG.SEQUENCER.MIN_TEMPO, Math.min(CONFIG.SEQUENCER.MAX_TEMPO, bpm));
        if (this.isPlaying) {
            this.restart();
        }
    }

    start() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.audioEngine.resume();
        this.uiManager.updatePlayState(true);

        this.runLoop();
    }

    stop() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.uiManager.updatePlayState(false);
        this.uiManager.resetStepIndicators();

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    toggleRecord() {
        this.isRecording = !this.isRecording;
        this.uiManager.updateRecordState(this.isRecording);
    }

    restart() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.runLoop();
    }

    runLoop() {
        const stepTime = (60000 / this.bpm) / 4; // 16th notes

        this.intervalId = setInterval(() => {
            this.processStep();
        }, stepTime);
    }

    processStep() {
        // Visual update
        this.uiManager.highlightStep(this.currentStep);

        // Audio trigger (placeholder for actual pattern playback)
        // const stepData = this.patterns[this.currentPatternId][this.currentStep];
        // if (stepData) { ... }

        // Advance step
        this.currentStep = (this.currentStep + 1) % CONFIG.SEQUENCER.STEPS_PER_PATTERN;
    }
}
