
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

});



// JavaScript Sound Implementation using Tone.js


// Include the Tone.js library (CDN link can be added in HTML)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.37/Tone.js"></script>

document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners to buttons
    document.querySelectorAll('.button, .control-button').forEach(button => {
        button.addEventListener('click', () => {
            playSound(button.id);
        });
    });
});

function playSound(buttonId) {
    const synth = new Tone.Synth().toDestination();
    let note;

    // Map button IDs to specific notes or actions
    switch (buttonId) {
        case 'button-a':
            note = 'C4';
            break;
        case 'button-b':
            note = 'D4';
            break;
        case 'button-c':
            note = 'E4';
            break;
        case 'button-d':
            note = 'F4';
            break;
        case 'button-1':
            note = 'G4';
            break;
        case 'button-2':
            note = 'A4';
            break;
        case 'button-3':
            note = 'B4';
            break;
        case 'button-4':
            note = 'C5';
            break;
        case 'button-5':
            note = 'D5';
            break;
        case 'button-6':
            note = 'E5';
            break;
        case 'button-7':
            note = 'F5';
            break;
        case 'button-8':
            note = 'G5';
            break;
        case 'button-9':
            note = 'A5';
            break;
        case 'record-button':
            console.log('Record button pressed');
            return;
        case 'play-button':
            console.log('Play button pressed');
            return;
        case 'erase-button':
            console.log('Erase button pressed');
            return;
        default:
            return;
    }

    // Play the mapped note
    synth.triggerAttackRelease(note, '8n');
}
