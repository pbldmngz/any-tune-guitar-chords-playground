import React, { useContext, useEffect } from 'react';
import SortedChords from './SortedChords';
import Controls from './Controls';
import Tuning from './Tuning';
import Composer from './Composer';
import Favorites from './Favorites';
import { GuitarChordContext } from '../context/GuitarChordsProvider';

const MainLayout: React.FC = () => {
    const { userSession, updateSessionForTuning, loading } = useContext(GuitarChordContext);

    useEffect(() => {
        updateSessionForTuning(userSession.selectedTuning);
    }, [userSession.selectedTuning]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: "lightgrey", width: "100vw", height: "100vh", boxSizing: "border-box", display: "flex", gap: "1rem" }}>
            <div style={{ border: "2px solid black", overflowY: "auto", backgroundColor: "white", width: "50%" }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div className="spinner" style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite' }}></div>
                    </div>
                ) : (
                    <SortedChords availableChords={userSession.filteredChords} />
                )}
            </div>
            <div style={{ width: "50%", gap: "1rem", display: "flex", flexDirection: "column" }}>
                <div style={{ height: "120px", gap: "1rem", display: "flex" }}>
                    <div style={{ border: "2px solid black", backgroundColor: "white", width: "30%" }}>
                        <Tuning />
                    </div>
                    <div style={{ border: "2px solid black", backgroundColor: "white", width: "70%" }}>
                        <Controls />
                    </div>
                </div>
                <div style={{ height: "45%", overflowY: "auto", border: "2px solid black", backgroundColor: "white" }}>
                    <Composer />
                </div>
                <div style={{ height: "35%", border: "2px solid black", backgroundColor: "white" }}>
                    <Favorites />
                </div>
            </div>
        </div>
    );
};

export default MainLayout;