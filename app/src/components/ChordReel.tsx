import React, { useState } from 'react';
import ChordDiagram from './ChordDiagram';

type ChordReelProps = {
    chords: Chord[];
    addFavorite: (chord: Chord) => void;
};

const styles: { [key: string]: React.CSSProperties } = {
    chordReel: {
        textAlign: 'center',
        width: "150px",
        color: 'black',
    },
    chordReelContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '5px',
    },
    chordReelButton: {
        backgroundColor: 'transparent',
        fontSize: '1rem',
        cursor: 'pointer',
        border: '2px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
    },
    chordReelIndicator: {
        fontSize: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        letterSpacing: '2px',
    },
};

const ChordReel: React.FC<ChordReelProps> = ({ chords, addFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? chords.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === chords.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div style={styles.chordReel}>
            <ChordDiagram {...chords[currentIndex]} />

            <div style={styles.chordReelContainer}>
                <button style={styles.chordReelButton} onClick={handlePrev}>
                    &lt;
                </button>
                <div style={{ ...styles.chordReelIndicator, flexDirection: 'column' }}>
                    <div style={{ marginBottom: "-5px" }}>{currentIndex + 1}/{chords.length}</div>
                    <div
                        onClick={() => addFavorite(chords[currentIndex])}
                        style={{
                            cursor: 'pointer',
                            fontSize: '16px',
                            position: 'relative'
                        }}
                        title="Add to favorites"
                    >
                        ⭐
                    </div>
                </div>
                <button style={styles.chordReelButton} onClick={handleNext}>
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default ChordReel;