import React from 'react';
import ChordSoundGenerator from './ChordSoundGenerator';
import { playChord } from 'src/functions/PlaySound';

const ChordDiagram: React.FC<Chord> = ({ frets = [], notes = [], tuning, name }) => {
    const strings = 6; // Number of strings
    const fretsCount = 5; // Number of visible frets (can adjust for larger chords)

    // Helper function to determine the marker for a string
    const getFretMarker = (stringIndex: number) => {
        if (frets[stringIndex] === 0) return 'O'; // Open string
        return frets[stringIndex]; // Default (no specific marker)
    };

    return (
        <div style={styles.wrapper}>
            {/* Notes Label Row */}
            <div style={styles.notes}>
                {tuning?.map((note, index) => {
                    const displayNote = (notes[index] === 'X') ? 'X' :
                        (note === notes[index]) ? 'O' : tuning[index];
                    const noteStyle = (notes[index] === 'X') ? { color: 'red' } :
                        (note === notes[index]) ? { color: '#2196f3' } : {};

                    return (
                        <div key={index} style={{ ...styles.noteLabel, ...noteStyle }}>
                            {displayNote}
                        </div>
                    )
                })}
            </div>

            {/* Fretboard Grid */}
            <div style={styles.grid}>
                {[...Array(fretsCount)].map((_, fretIndex) => (
                    <div key={fretIndex} style={styles.fretRow}>
                        {[...Array(strings)].map((_, stringIndex) => {
                            const isFingerHere = frets[stringIndex] === fretIndex + 1;
                            const marker = getFretMarker(stringIndex);

                            return (
                                <div
                                    key={stringIndex}
                                    style={{
                                        ...styles.stringCell,
                                        backgroundColor: isFingerHere ? '#2196f3' : 'transparent',
                                        borderColor: notes[stringIndex] === 'X' ? "transparent" : "black",
                                        color: isFingerHere ? 'azure' : 'green',
                                        fontWeight: isFingerHere ? "bolder" : "lighter",
                                        cursor: isFingerHere ? "pointer" : "default",
                                    }}
                                    onClick={() => {
                                        if (isFingerHere) {
                                            playChord(tuning, frets.map((f, i) => i === stringIndex ? f : -1));
                                        }
                                    }}
                                >
                                    {marker && <span style={styles.markerText}>{isFingerHere ? marker : ""}</span>}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div style={styles.noteHeader}>
                <ChordSoundGenerator tuning={tuning} frets={frets} />
                {name}
            </div>
        </div>
    );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
    noteHeader: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        padding: '5px',
        borderTop: '2px solid black',
        fontWeight: 'bold',
        fontSize: '9px',
        gap: "0.5rem"
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        paddingBottom: '0',
        fontFamily: 'Arial, sans-serif',
        //width: '180px',
        border: '2px solid black',
        borderRadius: '8px',
    },
    notes: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '10px',
        color: 'black',
    },
    noteLabel: {
        fontSize: '10px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    fretRow: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
        borderTop: '1px solid black',
    },
    stringCell: {
        width: '16px',
        height: '16px',
        border: '2px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        position: 'relative',
    },
    markerText: {
        fontSize: '12px',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
};

export default ChordDiagram;
