const funcall = async () => {

    const samplesFolder = 'samples';

    const buttons = document.querySelectorAll('#buttons button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Button ${button.textContent} clicked!`);
        });
    });

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


    // Create a gain node for overall volume control
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);


    // Function to load a sound sample
    async function loadSample(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return audioCtx.decodeAudioData(arrayBuffer);
    }

    // Load the drum samples
    const samplePromises = [
        loadSample(samplesFolder + '\\kick.wav'),
        loadSample(samplesFolder + '\\snare.wav'),
        loadSample(samplesFolder + '\\hihat.wav'),
        loadSample(samplesFolder + '\\clap.wav')
    ];

    function loadSamples() {
        return Promise.all(samplePromises);    
    }

    //const samples = loadSamples();
    const samples = await Promise.all(samplePromises);





    const distortionBtn = document.getElementById('distortionBtn');
    const distortion = audioCtx.createWaveShaper();
    let distortionEnabled = false;

    distortionBtn.addEventListener('click', () => {
        distortionEnabled = !distortionEnabled;
        if (distortionEnabled) {
            distortion.curve = makeDistortionCurve(400); // Adjust distortion amount as needed
            gainNode.connect(distortion); // Connect gainNode to distortion
            distortion.connect(audioCtx.destination); // Connect distortion to destination
        } else {
            gainNode.disconnect(distortion); // Disconnect distortion
            gainNode.connect(audioCtx.destination); // Connect gainNode directly to destination
        }
    });

    function makeDistortionCurve(amount) {
        let k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for (; i < n_samples; ++i) {
            x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    }





    const pads = document.querySelectorAll('#pads button');
    pads.forEach((pad, index) => {
        pad.addEventListener('click', () => {
            const source = audioCtx.createBufferSource();
            source.buffer = samples[index % samples.length]; // Cycle through samples
            source.connect(audioCtx.destination);
            source.start(audioCtx.currentTime);


            pad.classList.add('active'); // Add the 'active' class
            setTimeout(() => {
                pad.classList.remove('active'); // Remove the 'active' class after a short delay
            }, 100); // Adjust the delay as needed

            console.log('Pad clicked!');
        });
    });


    // Sequencer
    const sequencer = document.getElementById('sequencer');
    const numSteps = 16; // Number of steps in the sequencer
    let activeSteps = Array(numSteps).fill(false); // Array to track active steps

    // Create sequencer steps
    for (let i = 0; i < numSteps; i++) {
        const step = document.createElement('div');
        step.classList.add('step');
        step.addEventListener('click', () => {
            activeSteps[i] = !activeSteps[i]; // Toggle step state
            step.classList.toggle('active', activeSteps[i]); // Update step appearance
        });
        sequencer.appendChild(step);
    }

    let currentStep = 0;
    setInterval(() => {
        currentStep = (currentStep + 1) % numSteps;
        if (activeSteps[currentStep]) {
            const padIndex = currentStep % pads.length;
            pads[padIndex].click(); // Trigger the corresponding pad


            pads[padIndex].classList.add('active');
            setTimeout(() => {
                pads[padIndex].classList.remove('active');
            }, 100);            

            screen.textContent = (currentStep + 1).toString().padStart(2, '0'); // Display current step
        }

    }, 250); // Adjust timing as needed


    const screen = document.getElementById('screen');




    // ... (previous code)

    const knobs = document.querySelectorAll('.knob');

    knobs.forEach(knob => {
        let rotation = 0;
        knob.addEventListener('mousedown', (e) => {
            const initialY = e.clientY;
            const onMouseMove = (e) => {
                const deltaY = e.clientY - initialY;
                rotation += deltaY * 0.5; // Adjust sensitivity as needed
                knob.style.transform = `rotate(${rotation}deg)`;
                initialY = e.clientY;

                // Update volume or tempo based on which knob is rotated
                if (knob === knobs[0]) {
                    // First knob controls volume
                    const volume = Math.max(0, Math.min(1, rotation / 360)); // Normalize to 0-1 range
                    gainNode.gain.value = volume; // Assuming you have a gainNode for overall volume
                } else if (knob === knobs[1]) {
                    // Second knob controls tempo
                    const tempo = Math.max(60, Math.min(300, 120 + rotation)); // Normalize to 60-300 BPM range
                    clearInterval(sequencerInterval); // Clear previous interval
                    sequencerInterval = setInterval(() => { // Set new interval
                        // ... (sequencer logic)
                    }, 60000 / tempo); // Calculate interval time from BPM
                }
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });







    const canvas = document.getElementById('waveform');
    const canvasCtx = canvas.getContext('2d');
    const analyser = audioCtx.createAnalyser();
    gainNode.connect(analyser); // Connect gainNode to analyser
    analyser.connect(audioCtx.destination); // Connect analyser to destination
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function drawWaveform() {
        requestAnimationFrame(drawWaveform);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(255, 0, 0)';
        canvasCtx.beginPath();

        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }

    drawWaveform();




    const delayBtn = document.getElementById('delayBtn');
    const delay = audioCtx.createDelay(1); // Max delay time of 1 second
    const feedback = audioCtx.createGain();
    let delayEnabled = false;
    
    // Connect delay nodes
    delay.connect(feedback);
    feedback.connect(delay);
    feedback.gain.value = 0.5; // Set feedback amount
    
    delayBtn.addEventListener('click', () => {
        delayEnabled = !delayEnabled;
        if (delayEnabled) {
            gainNode.connect(delay); // Connect gainNode to delay
            delay.connect(audioCtx.destination); // Connect delay to destination
        } else {
            gainNode.disconnect(delay); // Disconnect delay
            gainNode.connect(audioCtx.destination); // Connect gainNode directly to destination
        }
    });



    
    //const analyser = audioCtx.createAnalyser();
    gainNode.connect(analyser); // Connect gainNode to analyser
    analyser.fftSize = 64; // Adjust FFT size for different frequency resolution
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    function updateBackground() {
        requestAnimationFrame(updateBackground);
        analyser.getByteFrequencyData(frequencyData);
    
        // Calculate average frequency value
        const averageFrequency = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
    
        // Map frequency to hue value (0-360)
        const hue = averageFrequency * 360 / 255;
    
        // Set background color with varying hue
        document.getElementById('ep-133').style.backgroundColor = `hsl(${hue}, 50%, 50%)`;
    }
    
    updateBackground();    







    
}

funcall();