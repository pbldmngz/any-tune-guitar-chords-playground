// Create a single AudioContext instance
const audioContext = new (window.AudioContext)();

// Create a simple reverb effect using ConvolverNode
const createReverb = () => {
    const convolver = audioContext.createConvolver();
    // You would typically load an impulse response file here
    // For simplicity, we'll use a small buffer to create a basic reverb effect
    const reverbBuffer = audioContext.createBuffer(2, 0.5 * audioContext.sampleRate, audioContext.sampleRate);
    for (let channel = 0; channel < reverbBuffer.numberOfChannels; channel++) {
        const channelData = reverbBuffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * 0.2; // Simple noise-based reverb
        }
    }
    convolver.buffer = reverbBuffer;
    return convolver;
};

const reverb = createReverb();

// Helper function to calculate the frequency of a note
function getFrequency(note: string, octave: number): number {
    const A4 = 440;
    const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteIndex = NOTES.indexOf(note);
    if (noteIndex === -1) throw new Error(`Invalid note: ${note}`);

    const semitoneOffset = noteIndex - NOTES.indexOf("A") + (octave - 4) * 12;
    return A4 * Math.pow(2, semitoneOffset / 12);
}

// Calculate the note frequency based on tuning and frets
function calculateFrequencies(tuning: string[], frets: number[]): number[] {
    const baseOctaves = [4, 4, 3, 3, 2, 2]; // Standard guitar tuning octaves
    const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    return tuning.map((note, index) => {
        const fret = frets[index];
        if (fret === -1) return -1; // Muted string

        const baseNoteIndex = NOTES.indexOf(note);
        const fretNoteIndex = (baseNoteIndex + fret) % NOTES.length;
        const octaveOffset = Math.floor((baseNoteIndex + fret) / NOTES.length);

        return getFrequency(NOTES[fretNoteIndex], baseOctaves[index] + octaveOffset);
    });
}

/**
 * Calculates sound duration in seconds based on tempo (BPM) and note length
 * @param tempo Beats per minute
 * @param noteLength Note length in beats (1 = whole note, 0.25 = quarter note, etc.)
 * @returns Duration in seconds
 */
export const calculateSoundDurationByTempo = (tempo: number, noteLength: number = 0.25): number => {
    const secondsPerBeat = 60 / tempo;
    return secondsPerBeat * noteLength;
};

export const playChord = (
    tuning: string[],
    frets: number[],
    duration: number = 1 // Default duration of 1 second if not specified
) => {
    const frequencies = calculateFrequencies(tuning, frets);

    frequencies.forEach((frequency, _) => {
        if (frequency === -1) return; // Skip muted strings

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        oscillator.type = "sawtooth"; // Use sawtooth for richer harmonics
        oscillator.frequency.value = frequency;

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2000, audioContext.currentTime); // Cut off high frequencies

        const currentTime = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, currentTime + 0.01); // Quick attack
        gainNode.gain.linearRampToValueAtTime(0.001, currentTime + duration); // Decay

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(reverb);
        reverb.connect(audioContext.destination);

        // Create a random timer to simulate strumming
        setTimeout(() => {
            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration);
            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
                filter.disconnect();
            };
        }, Math.random() * 30);
    });
};

