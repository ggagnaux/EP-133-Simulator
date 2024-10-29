
$(document).ready(function() {
    //$('.knob').knob();

    $(".knob").knob({
        'min': 0,
        'max': 100,
        'angleOffset': -135, /* Adjusted angle offset */
        'angleArc': 270,     /* Adjusted angle arc */
        'fgColor': '#f07800',  /* Refined foreground color */
        'bgColor': '#232323',  /* Refined background color */
        'thickness': 0.25,    /* Decreased thickness */
        'width': 30,          /* Updated width */
        'height': 30,         /* Updated height */
        'displayInput': false
    });    

    // Initialize the grid buttons
    $(".grid-button").click(function() {
        $(this).toggleClass("active");
    });

    // Initialize the group buttons
    $(".group-button").click(function() {
        $(this).toggleClass("active");
    });

    $("#slider-vertical").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 100,
        value: 60,
        slide: function( event, ui ) {
            //$( "#amount" ).val( ui.value );
        }
    });
    //$( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );


    // Add event listeners to remaining buttons
    const buttonIds = [
        // Number buttons
        "button-0", "button-1", "button-2", "button-3", "button-4", "button-5", "button-6", "button-7", "button-8", "button-9", 

        // Group buttons
        "button-A", "button-B", "button-C", "button-D", 

        // Other buttons
        "button-keys", "button-fader", "button-minus", "button-plus", "button-sample", "button-timing", "button-fx", "button-erase", "button-play", "button-record",
        "button-shift", "button-dot", "button-enter"      
    ];

    buttonIds.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                handleButtonClick(buttonId);
            });
        }
    });

    function handleButtonClick(buttonId) {
        console.log(`Button ${buttonId} clicked`);


        const frequency = buttonFrequencies[buttonId];
        if (frequency) {
            playSound(frequency);
        }

        // Add specific logic for each button here
        switch (buttonId) {
            case "button-0": 
            case "button-1": break;
            case "button-2": break;
            case "button-3": break;
            case "button-4": break;
            case "button-5": break;
            case "button-6": break;
            case "button-7": break;
            case "button-8": break;
            case "button-9": break;

            case "button-A": break;
            case "button-B": break;
            case "button-C": break;
            case "button-D": break;

            case "button-keys": break;
            case "button-fader": break;
            case "button-minus": break;
            case "button-plus": break;
            case "button-sample": break;
            case "button-timing": break;
            case "button-fx": break;
            case "button-erase": break;
            case "button-play": break;
            case "button-record": break;
            case "button-shift": break; 
            case "button-dot": break;
            case "button-enter": break;
        }
    }


    // JavaScript Sound Implementation using Web Audio API
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(frequency) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'triangle'; // You can change this to 'square', 'sawtooth', or 'triangle'

        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    // Mapping of button IDs to frequencies
    const buttonFrequencies = {
        'button-A': 261.63, // C4
        'button-B': 293.66, // D4
        'button-C': 329.63, // E4
        'button-D': 349.23, // F4
        'button-1': 392.00, // G4
        'button-2': 440.00, // A4
        'button-3': 493.88, // B4
        'button-4': 523.25, // C5
        'button-5': 587.33, // D5
        'button-6': 659.25, // E5
        'button-7': 698.46, // F5
        'button-8': 783.99, // G5
        'button-9': 880.00, // A5
        'button-0': 900.00, // Unknown - Need to set correct value
    };
});



