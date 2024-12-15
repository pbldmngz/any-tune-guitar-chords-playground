import React, { useState, useEffect, useContext } from 'react';
import ChordReel from './ChordReel';
import { GuitarChordContext } from '../context/GuitarChordsProvider';

type ChordClassfier = { [key: string]: Chord[] };
type sortedChordsProps = {
    availableChords: Chord[];
};

const SortedChords: React.FC<sortedChordsProps> = ({ availableChords }) => {
    const { addFavorite, loading } = useContext(GuitarChordContext);
    const [chords, setChords] = useState<ChordClassfier>({});

    const separateChordsByNotes = (chords: Chord[]) => {
        const chordsByNotes: any = {};

        chords.forEach((chord: any) => {
            const note = chord.root;
            if (!chordsByNotes[note]) {
                chordsByNotes[note] = [];
            }
            chordsByNotes[note].push(chord);
        });

        return chordsByNotes as ChordClassfier;
    };

    useEffect(() => {
        const sortedChords = separateChordsByNotes(availableChords);
        setChords(sortedChords);
    }, [availableChords]);

    // Sort the keys of the chords object alphabetically
    const sortedChordKeys = Object.keys(chords).sort();

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(3, auto)',
                gap: '20px',
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: loading ? '#f0f0f0' : 'transparent',
                textAlign: 'center',
                height: '100%',
            }}
        >
            {sortedChordKeys.length > 0 ? (
                sortedChordKeys.map((notes) => (
                    <ChordReel key={notes} chords={chords[notes]} addFavorite={addFavorite} />
                ))
            ) : (
                <div style={{ gridColumn: 'span 4', color: 'gray' }}>
                    No chords match the current filters.
                </div>
            )}
        </div>
    );
};

export default SortedChords;