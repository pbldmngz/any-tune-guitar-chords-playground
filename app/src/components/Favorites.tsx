import React, { useContext } from 'react';
import ChordDiagram from './ChordDiagram';
import { GuitarChordContext } from '../context/GuitarChordsProvider';

const Favorites: React.FC = () => {
    const { userSession, removeFavorite } = useContext(GuitarChordContext);

    return (
        <div style={{ display: 'flex', overflowX: 'auto', height: "100%", alignItems: "center", color: "black" }}>
            {userSession.selectedChords.map((chord) => (
                <div key={chord._id} style={{ margin: '0 5px', position: 'relative' }}>
                    <ChordDiagram {...chord} />
                    <div
                        onClick={() => removeFavorite(chord.name)}
                        style={{
                            position: 'absolute',
                            top: -5,
                            right: -5,
                            width: '20px',
                            height: '20px',
                            background: 'red',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '12px',
                        }}
                    >
                        X
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Favorites;