import json
from itertools import product

# Map notes to semitones
NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Chord formulas
CHORD_FORMULAS = {
    "Major": [0, 4, 7],
    "Minor": [0, 3, 7],
    "Diminished": [0, 3, 6],
    "Augmented": [0, 4, 8],
    "7th": [0, 4, 7, 10],
    "maj7": [0, 4, 7, 11],
    "sus2": [0, 2, 7],
    "sus4": [0, 5, 7],
}

# Modes definition
MODES = {
    "Ionian": [0, 2, 4, 5, 7, 9, 11],  # Major scale
    "Dorian": [0, 2, 3, 5, 7, 9, 10],
    "Phrygian": [0, 1, 3, 5, 7, 8, 10],
    "Lydian": [0, 2, 4, 6, 7, 9, 11],
    "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
    "Aeolian": [0, 2, 3, 5, 7, 8, 10],  # Natural minor scale
    "Locrian": [0, 1, 3, 5, 6, 8, 10],
    "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
    "Melodic Minor": [0, 2, 3, 5, 7, 9, 11],
}

def generate_notes(tuning, max_fret):
    """Generate the notes for each string based on the tuning and fret range."""
    string_notes = []
    for note in tuning:
        start_index = NOTES.index(note)
        string_notes.append([NOTES[(start_index + i) % 12] for i in range(max_fret + 1)] + ["X"])  # Add "X" for muted string
    return string_notes

def validate_chord(chord, root_note, formula):
    """Ensure all strings contribute valid notes for the chord."""
    chord_notes = {note for note in chord if note != "X"}
    if not chord_notes:
        return False

    root_index = NOTES.index(root_note)
    valid_notes = {NOTES[(root_index + interval) % 12] for interval in formula}

    return chord_notes.issubset(valid_notes)

def check_muted_string_placement(notes):
    """Ensure muted strings are only at the extremes or connected to them."""
    if not notes:
        return True

    x_positions = [i for i, note in enumerate(notes) if note == 'X']

    if not x_positions:
        return True

    # Check if all 'X's are at the edges or connected to edge 'X's
    if 0 in x_positions or len(notes) - 1 in x_positions:
        connected = set()
        to_check = [pos for pos in x_positions if pos == 0 or pos == len(notes) - 1]

        while to_check:
            current = to_check.pop()
            connected.add(current)
            for adj in [current - 1, current + 1]:
                if adj in x_positions and adj not in connected:
                    connected.add(adj)
                    to_check.append(adj)

        return len(connected) == len(x_positions)

    return False

def generate_chords(tuning, max_fret, min_strings=4, max_finger_string_span=5, min_fingers=1, max_fingers=5):
    """Generate all possible chords for a given tuning."""
    string_notes = generate_notes(tuning, max_fret)
    chords = []
    skipped_chords = []

    for frets in product(*(range(max_fret + 2) for _ in tuning)):
        notes = [string_notes[i][fret] if fret != (max_fret + 1) else "X" for i, fret in enumerate(frets)]
        frets = [fret if fret != (max_fret + 1) else 0 for fret in frets]

        muted_strings = notes.count("X")
        if muted_strings > (len(tuning) - min_strings):
            skipped_chords.append({"reason": "Too many muted strings", "frets": frets, "notes": notes})
            continue

        if not check_muted_string_placement(notes):
            skipped_chords.append({"reason": "Invalid muted string placement", "frets": frets, "notes": notes})
            continue

        active_strings = [fret > 0 for fret in frets]
        fingers = len([active_string for active_string in active_strings if active_string])

        if fingers < min_fingers or fingers > max_fingers:
            skipped_chords.append({
                "reason": f"{'Not enough' if fingers < min_fingers else 'Too many'} active strings",
                "frets": frets,
                "notes": notes,
                "fingers": fingers
            })
            continue

        for root_note in NOTES:
            for name, formula in CHORD_FORMULAS.items():
                if validate_chord(notes, root_note, formula):
                    chord_modes = [
                        mode for mode, intervals in MODES.items()
                        if all(NOTES.index(note) % 12 in intervals for note in notes if note != "X")
                    ]
                    # Calculate fret span safely
                    active_frets = [fret for fret in frets if fret > 0]
                    fret_span = max(active_frets) - min(active_frets) if active_frets else 0
                    _id = f"{root_note}_{name}_{'_'.join(tuning)}_{','.join(map(str, frets))}"
                    chords.append({
                        "_id": _id,
                        "tuning": tuning,
                        "name": f"{root_note} {name}",
                        "root": root_note,
                        "type": name,
                        "notes": notes,
                        "frets": frets,
                        "fingers": fingers,
                        "fret_span": fret_span,
                        "finger_string_span": max_finger_string_span,
                        "muted_strings": muted_strings,
                        "modes": chord_modes,
                        "inverted": False,  # Simplified inversion logic
                    })
                    break

    print(f"Generated {len(chords)} valid chords.")
    print(f"Skipped {len(skipped_chords)} invalid chord configurations.")
    return chords, skipped_chords

def save_chords_to_json(chords, filename):
    """Save the chords to a JSON file."""
    with open(filename, 'w') as f:
        json.dump(chords, f, indent=4)

# Example usage
if __name__ == "__main__":
    tuning = ["E", "A", "D", "G", "B", "E"]
    max_fret = 11

    chords, skipped_chords = generate_chords(
        tuning,
        max_fret,
        min_strings=3,
        max_finger_string_span=1,
        min_fingers=0,
        max_fingers=4,
    )

    save_chords_to_json(chords, "valid_chords.json")

    with open("skipped_chords.json", "w") as f:
        json.dump(skipped_chords, f, indent=2)

    print(f"Generated {len(chords)} valid chords saved to 'valid_chords.json'")
    print(f"Skipped chord details saved to 'skipped_chords.json'")