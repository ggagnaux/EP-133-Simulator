/**
 * EP-133 Simulator UI Manager
 * Handles DOM manipulation and visual updates
 */

class UIManager {
    constructor() {
        this.elements = {};
        this.activePads = new Set();
        this.statusAnimationInterval = null;
    }

    togglePower(isOn) {
        if (this.elements.device) {
            this.elements.device.classList.toggle('powered-off', !isOn);
        }
    }

    init() {
        this.cacheElements();
    }

    cacheElements() {
        // Cache commonly used elements
        this.elements.device = document.querySelector(CONFIG.UI.SELECTORS.DEVICE);
        this.elements.playBtn = document.querySelector('[data-pad="play"]');
        this.elements.playIcon = document.querySelector('.play-button');
        this.elements.recBtn = document.querySelector('[data-transport="rec"]');
        this.elements.recLight = document.querySelector('.status-light.red');
        this.elements.patternNumber = document.querySelector('.pattern-number');
        this.elements.statusIcons = document.querySelectorAll(CONFIG.UI.SELECTORS.STATUS_ICONS);
    }

    // --- Theme & Settings ---

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update active state in settings dialog if open
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }

    applyTransform(angle) {
        if (this.elements.device) {
            this.elements.device.style.transform = `rotateX(${angle}deg)`;
        }
    }

    // --- Playback State ---

    updatePlayState(isPlaying) {
        if (this.elements.playBtn) {
            this.elements.playBtn.classList.toggle('active', isPlaying);
        }
        if (this.elements.playIcon) {
            this.elements.playIcon.classList.toggle('active', isPlaying);
        }

        if (isPlaying) {
            this.startStatusAnimation();
        } else {
            this.stopStatusAnimation();
        }
    }

    updateRecordState(isRecording) {
        if (this.elements.recBtn) {
            this.elements.recBtn.classList.toggle('active', isRecording);
        }
        if (this.elements.recLight) {
            this.elements.recLight.classList.toggle('active', isRecording);
        }
    }

    // --- Pad Interaction ---

    highlightPad(padId, active) {
        const pad = document.querySelector(`[data-pad="${padId}"]`);
        if (pad) {
            if (active) {
                pad.classList.add('active');
                this.activePads.add(padId);
            } else {
                // Don't remove active class for toggle buttons like mute immediately if we were handling that logic here
                // But for simple press/release:
                pad.classList.remove('active');
                this.activePads.delete(padId);
            }
        }
    }

    // --- Sequencer Visualization ---

    highlightStep(step) {
        // Simple visual metronome on the pattern number or similar
        // For now, let's just flash the BPM display or similar if we want
        // Or update the status icons in a cycle
    }

    resetStepIndicators() {
        // Reset any step specific visuals
    }

    // --- Status Icon Animation ---

    startStatusAnimation(bpm = 133) {
        this.stopStatusAnimation();

        const totalIcons = this.elements.statusIcons.length;
        let currentIndex = 0;
        const cycleDuration = (60000 / bpm) * 4;
        const interval = cycleDuration / totalIcons;

        this.statusAnimationInterval = setInterval(() => {
            // Clear previous
            const prevIndex = (currentIndex - 1 + totalIcons) % totalIcons;
            if (this.elements.statusIcons[prevIndex]) {
                this.elements.statusIcons[prevIndex].classList.remove('active');
            }

            // Set current
            if (this.elements.statusIcons[currentIndex]) {
                this.elements.statusIcons[currentIndex].classList.add('active');
            }

            currentIndex = (currentIndex + 1) % totalIcons;
        }, interval);
    }

    stopStatusAnimation() {
        if (this.statusAnimationInterval) {
            clearInterval(this.statusAnimationInterval);
            this.statusAnimationInterval = null;
        }
        this.elements.statusIcons.forEach(icon => icon.classList.remove('active'));
    }

    // --- Notifications ---

    showNotification(message) {
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

        // Animate
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}
