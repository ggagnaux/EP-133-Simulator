# EP-133 K.O. II Sampler Composer Simulator

A JavaScript-based web simulator of the Teenage Engineering EP-133 K.O. II sampler composer device.

## Project Overview

This project recreates the visual interface and basic functionality of the EP-133 K.O. II sampler composer, featuring an accurate representation of the device's layout, controls, and interactive elements.

## Features

### Visual Interface
- **Authentic Design**: Pixel-perfect recreation of the EP-133 interface
- **Responsive Layout**: Adapts to different screen sizes while maintaining proportions
- **3D Perspective**: Subtle 3D transform for realistic device appearance
- **Interactive Elements**: All buttons, pads, and knobs are clickable/interactive

### Device Components

#### Top Section
- **Tab Bar**: 6 tabs (OUTPUT, INPUT, SYNC, FX, MIDI, SETUP)
- **Device Header**: K.O. II branding and speaker grille simulation

#### Main Display
- **LCD-style Display**: Dark background with green text
- **Status Indicators**: 
  - Recording light (red)
  - BPM display (133 default)
  - Pattern number
  - Play status indicator
  - FX indicator

#### Control Section
- **Left Controls**:
  - Volume/Cutoff knob (white)
  - Mode buttons (SOUND, MIX, COMP)
- **Center Pad Matrix**: 4x4 grid of pressure-sensitive pads
  - Number pads (0-9)
  - Function pads (MUTE, TRIG, LIFT, PUNCH, CH-OP, ACCENT)
- **Right Controls**:
  - Tempo knob (orange)
  - Pitch knob (black)

#### Transport Section
- **Crossfader Slider**: Horizontal slider control
- **Transport Buttons**: SEQ, REC, PLAY, WRITE

### Functionality

#### Audio Features
- **Web Audio API Integration**: Real-time audio synthesis
- **Pad Sounds**: Each numbered pad generates a unique tone
- **Oscillator-based Synthesis**: Square wave generation for authentic retro sound

#### Interaction Methods
- **Mouse Controls**: Click and drag for all interface elements
- **Keyboard Shortcuts**:
  - Number keys (1-9, 0) map to corresponding pads
  - Spacebar for Play/Pause
  - 'R' key for Record
  - Enter key for Sequencer

#### Sequencer
- **Pattern-based Sequencing**: 16-step sequencer with visual feedback
- **BPM Control**: Adjustable tempo from 60-200 BPM
- **Real-time Playback**: Visual step indication during playback

#### Visual Feedback
- **LED Simulation**: Glowing effects for active status lights
- **Button States**: Visual feedback for pressed/active states
- **Knob Rotation**: Visual rotation based on parameter values
- **Pad Illumination**: Active pads show pulsing animation

## Technical Specifications

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Advanced styling, animations, and responsive design
- **Vanilla JavaScript**: Core functionality and interactivity
- **Web Audio API**: Real-time audio synthesis and processing

### Browser Compatibility
- Chrome 66+
- Firefox 60+
- Safari 12+
- Edge 79+

### Performance
- **Optimized Rendering**: Hardware-accelerated CSS transforms
- **Efficient Event Handling**: Delegated event listeners
- **Memory Management**: Proper cleanup of audio resources

## File Structure

```
EP-133/
├── index.html         # Main HTML structure
├── style.css          # Complete styling and animations
├── script.js          # Core JavaScript functionality
├── README.md          # This documentation
└── EP-133.png         # Reference image
```

## Color Scheme

### Device Colors
- **Main Body**: Light gray gradient (#e8e8e8 to #d0d0d0)
- **Display**: Black background (#000) with green text (#00ff00)
- **Orange Elements**: Gradient (#ff6600 to #cc5500)
- **Active States**: Various colors for different feedback types

### Status Indicators
- **Recording**: Red (#ff0000)
- **Play Active**: Yellow (#ffff00)
- **Normal Display**: Green (#00ff00)
- **Secondary Status**: Blue (#0066ff)

## Control Mapping

### Pads (4x4 Matrix)
```
[ 7 ] [ 8 ] [ 9 ] [MUTE ]
[ 4 ] [ 5 ] [ 6 ] [TRIG ]
[ 1 ] [ 2 ] [ 3 ] [LIFT ]
[PUN] [ 0 ] [CHO] [ACCNT]
```

### Keyboard Shortcuts
- **1-9, 0**: Trigger corresponding pads
- **Spacebar**: Play/Pause
- **R**: Record toggle
- **Enter**: Sequencer toggle

## Development Notes

### CSS Architecture
- **Component-based Styling**: Modular CSS for each device section
- **CSS Custom Properties**: Used for consistent theming
- **Flexbox/Grid Layout**: Modern layout techniques for precise positioning
- **Animation Performance**: GPU-accelerated transforms and opacity changes

### JavaScript Architecture
- **Class-based Structure**: EP133Simulator main class
- **Event-driven Programming**: Comprehensive event handling system
- **State Management**: Centralized state for all device parameters
- **Audio Context Management**: Proper Web Audio API resource handling

### Responsive Design
- **Mobile-first Approach**: Optimized for touch devices
- **Breakpoint Strategy**: Single breakpoint at 768px
- **Touch-friendly Sizing**: Adequate touch targets for mobile use

## Future Enhancements

### Planned Features
- **Sample Loading**: File upload and playback functionality
- **Pattern Storage**: Save/load pattern sequences
- **Effects Processing**: Audio effects implementation
- **MIDI Support**: Web MIDI API integration
- **Recording Capability**: Sample recording from microphone
- **Export Functionality**: Pattern/sequence export

### Technical Improvements
- **WebAssembly Integration**: For advanced audio processing
- **Service Worker**: Offline functionality
- **IndexedDB**: Local storage for samples and patterns
- **Web Workers**: Background audio processing

## Installation

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Allow audio permissions if prompted
4. Start creating music!

## Usage Tips

1. **Getting Started**: Click the orange PLAY button to begin
2. **Making Sounds**: Press numbered pads (1-9, 0) to trigger sounds
3. **Recording**: Press REC button and play pads to record sequences
4. **Tempo Control**: Adjust the orange TEMPO knob to change BPM
5. **Volume**: Use the white VOL/CF knob to control output level

## Browser Audio Note

Due to browser security policies, audio contexts require user interaction to start. Click any button or pad to initialize audio functionality.

## Contributing

This project welcomes contributions for:
- Additional sound synthesis methods
- Enhanced visual effects
- Mobile optimization improvements
- Accessibility enhancements
- Bug fixes and performance optimizations

## License

This project is for educational and demonstration purposes. The EP-133 design and branding are property of Teenage Engineering.

---

**Last Updated**: July 30, 2025
**Version**: 1.0.0
**Compatibility**: Modern browsers with Web Audio API support
