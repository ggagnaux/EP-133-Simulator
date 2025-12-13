/**
 * EP-133 Simulator Configuration
 */


const CONFIG = {
    // Audio Constants
    AUDIO: {
        FREQUENCIES: {
            '1': 261.63, // C4
            '2': 293.66, // D4
            '3': 329.63, // E4
            '4': 349.23, // F4
            '5': 392.00, // G4
            '6': 440.00, // A4
            '7': 493.88, // B4
            '8': 523.25, // C5
            '9': 587.33, // D5
            '0': 659.25  // E5
        },
        DEFAULT_WAVEFORM: 'sine',
        NOTE_DURATION: 0.5,
        FADE_OUT_DURATION: 0.1
    },

    // Sequencer Constants
    SEQUENCER: {
        MIN_TEMPO: 60,
        MAX_TEMPO: 180,
        DEFAULT_TEMPO: 133,
        STEPS_PER_PATTERN: 16,
        PPQ: 4 // Pulses per quarter note (16th notes)
    },

    // UI Constants
    UI: {
        DEFAULT_TRANSFORM_ANGLE: 0,
        THEMES: {
            DARK: 'dark',
            LIGHT: 'light'
        },
        SELECTORS: {
            PADS: '.pad',
            KNOBS: '.knob',
            TABS: '.tab',
            MENU_BTNS: '.menu-btn',
            CONTROL_BTNS: '.control-btn',
            TRANSPORT_BTNS: '.transport-btn',
            STATUS_ICONS: '.status-icon',
            DEVICE: '.ep133-device'
        }
    },

    // Storage Keys
    STORAGE: {
        THEME: 'ep133-theme',
        DEFAULT_VOLUME: 'ep133-default-volume',
        DEFAULT_TEMPO: 'ep133-default-tempo',
        TRANSFORM: 'ep133-transform',
        SHOW_TOOLTIPS: 'ep133-show-tooltips',
        ENABLE_SOUNDS: 'ep133-enable-sounds'
    }
};
