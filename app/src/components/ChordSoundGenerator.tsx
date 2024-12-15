import React from 'react';
import { playChord } from '../functions/PlaySound';

interface ChordPlayerProps {
    tuning: string[];
    frets: number[];
}

const ChordPlayer: React.FC<ChordPlayerProps> = ({ tuning, frets }) => {
    return (
        <button onClick={() => playChord(tuning, frets)} style={{ margin: 0, padding: 0, backgroundColor: "transparent" }}>
            🔊
        </button>
    );
};

export default ChordPlayer;
