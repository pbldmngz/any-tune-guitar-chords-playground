import React, { useState, useEffect, useContext } from 'react';
import { GuitarChordContext } from '../context/GuitarChordsProvider';

const Tuning: React.FC = () => {
    const { userSession, updateSessionForTuning } = useContext(GuitarChordContext);
    const [initialTuning, setInitialTuning] = useState<string[]>(userSession.selectedTuning.split(''));
    const [hasBeenModified, setHasBeenModified] = useState<boolean>(false);

    const handleNoteChange = (index: number, newNote: string) => {
        if (!hasBeenModified) {
            setHasBeenModified(true);
        }
        const updatedNotes = [...initialTuning];
        updatedNotes[index] = newNote;
        setInitialTuning(updatedNotes);
    };

    const onSave = () => {
        updateSessionForTuning(initialTuning.join(''));
        setHasBeenModified(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.headerContainer}>
                <h2 style={styles.title}>
                    Tuning
                </h2>
                {hasBeenModified && <button onClick={onSave} style={styles.button}>Save</button>}
            </div>
            <div style={styles.tuningContainer}>
                {initialTuning.map((note, index) => (
                    <input
                        key={index}
                        type="text"
                        value={note}
                        style={styles.input}
                        onChange={(e) => handleNoteChange(index, e.target.value)}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    button: {
        padding: '2px 5px',
        height: "26px",
        borderRadius: '4px',
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "100%",
    },
    container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'flex-start',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '14px',
        marginBottom: '10px',
        color: '#333',
    },
    tuningContainer: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between',
        width: "100%"
    },
    input: {
        width: '12px',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '16px',
    },
};

export default Tuning;
