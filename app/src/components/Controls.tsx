import React, { useContext } from 'react';
import { GuitarChordContext } from '../context/GuitarChordsProvider';

const Controls: React.FC = () => {
    const { userSession, setUserSession } = useContext(GuitarChordContext);

    const handleChange = (field: keyof UserSession, value: any) => {
        setUserSession((prevSession) => ({
            ...prevSession,
            [field]: value,
        }));
    };

    return (
        <div style={styles.container}>
            <div style={styles.controlGroupPair}>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Max Muted Strings:</label>
                    <input
                        type="number"
                        value={userSession.selectedMutedStrings}
                        min={0}
                        max={3}
                        style={styles.input}
                        onChange={(e) => handleChange('selectedMutedStrings', Number(e.target.value))}
                    />
                </div>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Max Fingers:</label>
                    <input
                        type="number"
                        value={userSession.selectedFingers}
                        min={0}
                        max={4}
                        style={styles.input}
                        onChange={(e) => handleChange('selectedFingers', Number(e.target.value))}
                    />
                </div>
            </div>
            <div style={styles.controlGroupPair}>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Max Horizontal Finger Distance:</label>
                    <input
                        type="number"
                        value={userSession.selectedFretSpan}
                        min={0}
                        max={10}
                        style={styles.input}
                        onChange={(e) => handleChange('selectedFretSpan', Number(e.target.value))}
                    />
                </div>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Max Vertical Finger Distance:</label>
                    <input
                        type="number"
                        value={userSession.selectedFingerStringSpan}
                        min={0}
                        max={1}
                        style={styles.input}
                        onChange={(e) => handleChange('selectedFingerStringSpan', Number(e.target.value))}
                    />
                </div>
            </div>
            <div style={styles.controlGroupPair}>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Tempo:</label>
                    <input
                        type="number"
                        value={userSession.tempo}
                        min={1}
                        style={styles.input}
                        onChange={(e) => handleChange('tempo', Number(e.target.value))}
                    />
                </div>
                <div style={styles.controlGroup}>
                    <label style={styles.label}>Mode:</label>
                    <select
                        value={userSession.selectedMode}
                        style={styles.select}
                        onChange={(e) => handleChange('selectedMode', e.target.value)}
                    >
                        <option value="Any">Any</option>
                        <option value="Ionian">Ionian</option>
                        <option value="Dorian">Dorian</option>
                        <option value="Phrygian">Phrygian</option>
                        <option value="Lydian">Lydian</option>
                        <option value="Mixolydian">Mixolydian</option>
                        <option value="Aeolian">Aeolian</option>
                        <option value="Locrian">Locrian</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-around',
        padding: '20px',
        gap: "1rem",
        fontSize: "10px"
    },
    controlGroupPair: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column' as 'column',
        color: "black"
    },
    controlGroup: {
        color: "black",
    },
    label: {
        display: 'block',
        fontWeight: 'bold',
    },
    input: {
        width: '7rem',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: "10px"
    },
    select: {
        width: '7.7rem',
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: "10px"
    },
};

export default Controls;