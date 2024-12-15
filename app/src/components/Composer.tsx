import React, { useState, useEffect, useContext } from 'react';
import { playChord, calculateSoundDurationByTempo } from 'src/functions/PlaySound';
import { GuitarChordContext } from '../context/GuitarChordsProvider';

const NOTE_COLORS = {
    "c": { major: "#FF9B9B", minor: "#CC7878", diminished: "#994B4B", augmented: "#FFBEBE", "7th": "#FFD4D4", maj7: "#FFE8E8", sus2: "#FFA8A8", sus4: "#FFC1C1" },
    "c#": { major: "#FFB876", minor: "#CC935E", diminished: "#995C3B", augmented: "#FFD4A8", "7th": "#FFE3C4", maj7: "#FFF1E0", sus2: "#FFC38A", sus4: "#FFD1A3" },
    "d": { major: "#FFE066", minor: "#CCB352", diminished: "#997F33", augmented: "#FFEB99", "7th": "#FFF1B8", maj7: "#FFF7D6", sus2: "#FFE77A", sus4: "#FFEC99" },
    "d#": { major: "#BEFF66", minor: "#98CC52", diminished: "#669933", augmented: "#D6FF99", "7th": "#E3FFB8", maj7: "#F1FFD6", sus2: "#C9FF7A", sus4: "#D9FF99" },
    "e": { major: "#66FF66", minor: "#52CC52", diminished: "#339933", augmented: "#99FF99", "7th": "#B8FFB8", maj7: "#D6FFD6", sus2: "#7AFF7A", sus4: "#99FF99" },
    "f": { major: "#66FFB8", minor: "#52CC93", diminished: "#33995C", augmented: "#99FFD4", "7th": "#B8FFE3", maj7: "#D6FFF1", sus2: "#7AFFC3", sus4: "#99FFD1" },
    "f#": { major: "#66FFFF", minor: "#52CCCC", diminished: "#339999", augmented: "#99FFFF", "7th": "#B8FFFF", maj7: "#D6FFFF", sus2: "#7AFFFF", sus4: "#99FFFF" },
    "g": { major: "#66B8FF", minor: "#5293CC", diminished: "#335C99", augmented: "#99D4FF", "7th": "#B8E3FF", maj7: "#D6F1FF", sus2: "#7AC3FF", sus4: "#99D1FF" },
    "g#": { major: "#6666FF", minor: "#5252CC", diminished: "#333399", augmented: "#9999FF", "7th": "#B8B8FF", maj7: "#D6D6FF", sus2: "#7A7AFF", sus4: "#9999FF" },
    "a": { major: "#B866FF", minor: "#9352CC", diminished: "#5C3399", augmented: "#D499FF", "7th": "#E3B8FF", maj7: "#F1D6FF", sus2: "#C37AFF", sus4: "#D199FF" },
    "a#": { major: "#FF66FF", minor: "#CC52CC", diminished: "#993399", augmented: "#FF99FF", "7th": "#FFB8FF", maj7: "#FFD6FF", sus2: "#FF7AFF", sus4: "#FF99FF" },
    "b": { major: "#FF66B8", minor: "#CC5293", diminished: "#99335C", augmented: "#FF99D4", "7th": "#FFB8E3", maj7: "#FFD6F1", sus2: "#FF7AC3", sus4: "#FF99D1" },
} as const;

const Composer: React.FC = () => {
    const { userSession } = useContext(GuitarChordContext);
    const [playing, setPlaying] = useState(false);
    const [currentColumn, setCurrentColumn] = useState(0);
    const [columns, setColumns] = useState(16);
    const [selectedNotes, setSelectedNotes] = useState<boolean[][]>(
        Array(userSession.activeChords.length).fill(null).map(() => Array(16).fill(false))
    );
    const [isStopped, setIsStopped] = useState(true);

    useEffect(() => {
        setSelectedNotes((prev) =>
            userSession.activeChords.map((_, rowIndex) =>
                [...(prev[rowIndex] || []), ...Array(columns - (prev[rowIndex]?.length || 0)).fill(false)]
            )
        );
    }, [userSession.activeChords, columns]);

    const resetPlayback = () => {
        setCurrentColumn(0);
    };

    const toggleNote = (row: number, col: number) => {
        setSelectedNotes((prev) => {
            const updated = prev.map((rowArr, rowIndex) =>
                rowIndex === row ? rowArr.map((val, colIndex) => (colIndex === col ? !val : val)) : rowArr
            );
            return updated;
        });
    };

    const togglePlay = () => {
        setPlaying((prev) => !prev);
        setIsStopped(false);
    };

    const addColumns = () => {
        setColumns((prev) => prev + 8); // Add 8 columns at a time
    };

    const cleanSelectedNotes = () => {
        setSelectedNotes(Array(userSession.activeChords.length).fill(null).map(() => Array(columns).fill(false)));
    };

    useEffect(() => {
        if (!playing) return;

        let interval: NodeJS.Timeout;
        const playLoop = () => {
            userSession.activeChords.forEach((chord, rowIndex) => {
                if (selectedNotes[rowIndex]?.[currentColumn]) {
                    let durationMultiplier = 1;
                    let colIndex = currentColumn + 1;

                    // Calculate the duration multiplier for consecutive active cells
                    while (colIndex < columns && selectedNotes[rowIndex]?.[colIndex]) {
                        durationMultiplier++;
                        colIndex++;
                    }

                    const duration = calculateSoundDurationByTempo(userSession.tempo) * durationMultiplier;
                    playChord(chord.tuning, chord.frets, duration);
                }
            });

            // Move the current column forward by one, respecting the tempo
            setCurrentColumn((prev) => (prev + 1) % columns);
        };

        interval = setInterval(playLoop, (60 / userSession.tempo) * 1000);

        return () => clearInterval(interval); // Cleanup on stop
    }, [playing, currentColumn, columns, userSession.activeChords, selectedNotes, userSession.tempo]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", gap: "1rem", marginBottom: "1rem" }}>
                <button
                    onClick={() => {
                        if (playing) {
                            togglePlay();
                            resetPlayback();
                        } else {
                            togglePlay();
                            resetPlayback();
                        }
                    }}
                    style={{ padding: '2px', width: "100px", cursor: 'pointer' }}>
                    {playing ? 'Reset' : 'Play'}
                </button>
                <button onClick={togglePlay} style={{ padding: '2px', width: "100px", cursor: 'pointer' }}>
                    {playing ? 'Stop' : 'Continue'}
                </button>
                <button onClick={addColumns} style={{ padding: '2px', width: "100px", cursor: 'pointer' }}>
                    + Columns
                </button>
                <button onClick={cleanSelectedNotes} style={{ padding: '2px', width: "100px", cursor: 'pointer', backgroundColor: 'white', color: 'black', border: '1px solid black' }}>
                    Clean
                </button>
            </div>
            <div style={{ display: 'grid', gap: '0px' }}>
                {userSession.activeChords.map((chord, rowIndex) => {
                    const chordType = chord.type.toLowerCase() as 'major' | 'minor' | 'diminished' | 'augmented' | '7th' | 'maj7' | 'sus2' | 'sus4';
                    const chordColor = NOTE_COLORS[chord.root.toLowerCase() as keyof typeof NOTE_COLORS]?.[chordType] || '#FFFFFF';
                    return (
                        <div
                            key={chord._id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${columns + 1}, 1fr)`,
                                backgroundColor: chordColor.concat('33'),
                                gap: '0',
                            }}
                        >
                            <div
                                key={`${rowIndex}-label`}
                                style={{
                                    width: '100%',
                                    height: '20px',
                                    backgroundColor: chordColor,
                                    cursor: 'default',
                                    textAlign: 'center',
                                    fontSize: '8px',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {chord.root}
                            </div>
                            {Array.from({ length: columns }).map((_, colIndex) => {
                                const isActive = selectedNotes[rowIndex]?.[colIndex] ?? false;
                                const isCurrentColumn = (colIndex + 1) === currentColumn;

                                return (
                                    <div
                                        key={`${rowIndex}-${colIndex}`}
                                        onClick={() => toggleNote(rowIndex, colIndex)}
                                        style={{
                                            width: '100%',
                                            height: '20px',
                                            backgroundColor: isActive
                                                ? chordColor + 'CC'
                                                : 'transparent',
                                            borderLeft: isCurrentColumn && !isStopped
                                                ? 'none'
                                                : '1px solid rgba(0,0,0,0.1)',
                                            borderRight: 'none',  // Remove right border always to avoid double borders
                                            borderTop: 'none',    // Remove top border always
                                            borderBottom: 'none', // Remove bottom border always
                                            margin: 0,
                                            padding: 0,
                                            cursor: 'pointer',
                                            transition: 'background-color 0.1s ease',
                                            position: 'relative',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        {isCurrentColumn && !isStopped && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: isActive
                                                    ? 'rgba(100, 149, 237, 0.4)'
                                                    : 'rgba(100, 149, 237, 0.3)',
                                                pointerEvents: 'none',
                                                zIndex: 1,
                                            }} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Composer;
