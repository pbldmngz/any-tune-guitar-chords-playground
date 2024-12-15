interface ChordDiagramProps {
    frets: number[]; // Array representing fret positions for each string (0 for open, X for muted)
    notes: (string | "X")[]; // Array representing notes (e.g., ["E", "X", "G#", "B", "D", "E"])
    tuning: string[]; // Array representing tuning of each string (e.g., ["E", "A", "D", "G", "B", "E"])
};

interface Chord {
    _id: string;
    tuning: string[];
    name: string;
    root: string;
    type: string;
    notes: string[];
    frets: number[];
    fingers: number;
    fret_span: number;
    finger_string_span: number;
    muted_strings: number;
    modes: string[];
}

interface TuningChords {
    [tuning: string]: Chord[];
}

interface UserSession {
    selectedTuning: string;
    selectedMode: string;
    selectedKey: string;
    selectedType: string;
    selectedFingers: number;
    selectedFretSpan: number;
    selectedFingerStringSpan: number;
    selectedMutedStrings: number;
    tempo: number;

    selectedChords: Chord[];
    discoveredTuningChords: TuningChords;
    filteredChords: Chord[];
    activeChords: Chord[];
}

interface UserSessionContext {
    userSession: UserSession;
    setUserSession: (userSession: UserSession) => void;
    addFavorite: (chord: Chord) => void;
    removeFavorite: (chordName: string) => void;
    updateSessionForTuning: (tuning: string) => void;
}