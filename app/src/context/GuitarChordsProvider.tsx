import { ReactNode, createContext, useState, useEffect } from "react";

const defaultUserSession: UserSession = {
    selectedTuning: "EADGBE",
    selectedMode: "Any",
    selectedKey: "C",
    selectedType: "Major",
    selectedFingers: 4,
    selectedFretSpan: 10,
    selectedFingerStringSpan: 1,
    selectedMutedStrings: 3,
    tempo: 120,

    selectedChords: [],
    discoveredTuningChords: {},
    filteredChords: [],
    activeChords: [],
};

export const GuitarChordContext = createContext<UserSessionContext>({
    userSession: defaultUserSession,
    setUserSession: () => { },
    addFavorite: () => { },
    removeFavorite: () => { },
    updateSessionForTuning: () => { },
});

export function GuitarChordProvider({ children }: { children: ReactNode }) {
    const [userSession, setUserSession] = useState<UserSession>(defaultUserSession);
    const [loading, setLoading] = useState(false);

    const filterChords = () => {
        const {
            selectedFingers,
            selectedFretSpan,
            selectedFingerStringSpan,
            selectedMutedStrings,
            selectedMode,
            discoveredTuningChords,
            selectedTuning
        } = userSession;
        const chords = discoveredTuningChords[selectedTuning] || [];

        const filtered = chords.filter(chord =>
            chord.fingers <= selectedFingers &&
            chord.fret_span <= selectedFretSpan &&
            chord.finger_string_span <= selectedFingerStringSpan &&
            chord.muted_strings <= selectedMutedStrings &&
            (selectedMode === "Any" || chord.modes.includes(selectedMode))
        );

        setUserSession(prevSession => ({
            ...prevSession,
            filteredChords: filtered,
        }));
    };

    const addFavorite = (chord: Chord) => {
        setUserSession((prevSession: UserSession) => {
            const chordExists = prevSession.selectedChords.some(c => c._id === chord._id);
            if (chordExists) {
                return prevSession;
            }

            const updatedSelectedChords = [...prevSession.selectedChords, chord];
            return {
                ...prevSession,
                selectedChords: updatedSelectedChords,
                activeChords: updatedSelectedChords,
            };
        });
    };

    const removeFavorite = (chordName: string) => {
        setUserSession((prevSession: UserSession) => {
            const updatedSelectedChords = prevSession.selectedChords.filter(chord => chord.name !== chordName);
            return {
                ...prevSession,
                selectedChords: updatedSelectedChords,
                activeChords: updatedSelectedChords,
            };
        });
    };

    const updateSessionForTuning = async (tuning: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/chords/${tuning}`);
            const chords = await response.json();

            setUserSession((prevSession: UserSession) => ({
                ...prevSession,
                selectedTuning: tuning,
                discoveredTuningChords: {
                    ...prevSession.discoveredTuningChords,
                    [tuning]: chords,
                },
                selectedChords: [],
                filteredChords: chords,
                activeChords: [],
            }));
        } catch (error) {
            console.error('Error fetching chords:', error);
            setUserSession((prevSession: UserSession) => ({
                ...prevSession,
                discoveredTuningChords: {
                    ...prevSession.discoveredTuningChords,
                    [tuning]: [],
                },
                selectedChords: [],
                filteredChords: [],
                activeChords: [],
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        filterChords();
    }, [
        userSession.selectedFingers,
        userSession.selectedFretSpan,
        userSession.selectedFingerStringSpan,
        userSession.selectedMutedStrings,
        userSession.selectedMode
    ]);

    return (
        <GuitarChordContext.Provider
            value={{
                userSession,
                setUserSession,
                addFavorite,
                removeFavorite,
                updateSessionForTuning,
                loading,
            }}
        >
            {children}
        </GuitarChordContext.Provider>
    );
}