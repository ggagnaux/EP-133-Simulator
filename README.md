# EP-133 Simulator

A browser-based simulation of the Teenage Engineering EP-133 K.O. II drum machine and sampler, built with vanilla JavaScript, HTML, and CSS.

## Features

### 🎵 Core Functionality
- **12 Drum Pads** with realistic sound synthesis
- **16-Step Sequencer** with visual LED feedback
- **Pattern System** - 16 patterns with 12 tracks each
- **Real-time Recording** and playback
- **Transport Controls** (Play, Stop, Record)

### 🎛️ Sound Engine
- **Web Audio API** powered sound synthesis
- **12 Different Sounds**:
  - Kick, Snare, Hi-Hat, Open Hat
  - Clap, Crash, Ride, Percussion
  - Bass, Synth, Lead, Pad
- **Real-time Parameters**:
  - Volume, Filter, Decay, Pitch control via knobs

### 🎚️ Interface
- **Authentic EP-133 Layout** with faithful visual design
- **LED Step Sequencer** showing current playback position
- **Multiple Modes**: Pattern, Track, Sound, Mixer
- **Pattern Operations**: Copy, Paste, Clear
- **Responsive Design** for different screen sizes

## Controls

### Pads
- **Click pads 1-12** to trigger sounds
- **While recording**: Click pads to program steps

### Transport
- **Play (▶)**: Start/pause playback
- **Stop (⏹)**: Stop playback and return to beginning
- **Record (⏺)**: Enable/disable recording mode

### Tempo Control
- **Click Tempo button**: Enter tempo mode
- **Left/Right arrows**: Adjust tempo (±5 BPM)
- **Up/Down arrows**: Fine tempo adjustment in tempo mode
- **OK button**: Reset tempo to 120 BPM
- **Range**: 60-200 BPM in 5 BPM increments

### Swing Control
- **Click Swing button**: Enter swing mode
- **Left/Right arrows**: Adjust swing (±5%)
- **Up/Down arrows**: Fine swing adjustment in swing mode
- **OK button**: Reset swing to 0%
- **Range**: -50% to +50% in 5% increments

### Navigation
- **Left/Right arrows**: Navigate patterns/tracks or adjust tempo/swing
- **OK button**: Context-dependent confirm action or reset values

### Knobs
- **Volume**: Master volume control
- **Filter**: Low-pass filter cutoff
- **Decay**: Sound length/sustain
- **Pitch**: Sound pitch adjustment

### Keyboard Shortcuts
- **Spacebar**: Play/pause
- **Escape**: Stop
- **Ctrl+R**: Toggle record
- **T**: Enter tempo mode
- **S**: Enter swing mode
- **Arrow Keys**: Navigate or adjust values
- **Enter**: OK/confirm action
- **1-9, 0, -, =**: Trigger pads 1-12

## Modes

### Pattern Mode
- Navigate between 16 different patterns
- Each pattern contains 12 tracks of 16 steps
- Copy/paste entire patterns

### Track Mode
- Select individual tracks (1-12)
- View/edit specific drum parts
- Track-specific sound editing

### Sound Mode
- Edit sound parameters for selected track
- Real-time knob control affects selected sound

### Mixer Mode
- Overall volume and effects control
- Master section parameters

## Getting Started

1. **Open** `index.html` in a modern web browser
2. **Click Play** to start the sequencer
3. **Click Record** to enable step recording
4. **Click pads** while playing to program beats
5. **Use knobs** to adjust sound parameters
6. **Navigate patterns** with left/right arrows

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may require user interaction to start audio)
- **Mobile**: Responsive design with touch support

## Technical Details

### Audio Synthesis
- Pure Web Audio API implementation
- No external audio files required
- Real-time synthesis of all sounds
- Algorithmic drum machine sounds

### Architecture
- **Object-oriented JavaScript** design
- **Modular sound synthesis** functions
- **Event-driven** user interaction
- **Efficient rendering** with minimal DOM updates

## File Structure

```
EP-133 Simulator/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # Core simulator logic and audio engine
└── README.md          # This documentation
```

## Development

The simulator is built with vanilla web technologies:
- **HTML5** for structure
- **CSS3** for styling and animations
- **JavaScript ES6+** for functionality
- **Web Audio API** for sound synthesis

No build tools or dependencies required - just open `index.html` in a browser!

## Future Enhancements

Potential features for future development:
- **Sample import/export**
- **MIDI connectivity**
- **Additional effects processing**
- **Pattern chaining**
- **Velocity sensitivity**
- **Audio recording/export**

## Credits

Inspired by the Teenage Engineering EP-133 K.O. II. This is an unofficial fan-made simulator created for educational and entertainment purposes.

---

**Note**: This simulator requires a modern browser with Web Audio API support. Some browsers may require user interaction before audio can play.
