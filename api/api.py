from flask import Flask, jsonify
import sqlite3
from guitar_chords import generate_chords
import json

app = Flask(__name__)

# Database setup
DATABASE = 'chords.db'

def init_db():
    """Initialize the database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chords (
            tuning TEXT PRIMARY KEY,
            data TEXT
        )
    ''')
    conn.commit()
    conn.close()

def get_chords_from_db(tuning):
    """Retrieve chords from the database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT data FROM chords WHERE tuning = ?', (tuning,))
    row = cursor.fetchone()
    conn.close()
    return row[0] if row else None

def save_chords_to_db(tuning, data):
    """Save chords to the database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('REPLACE INTO chords (tuning, data) VALUES (?, ?)', (tuning, data))
    conn.commit()
    conn.close()

@app.route('/chords/<tuning>', methods=['GET'])
def get_chords(tuning):
    """Generate or retrieve chords for the given tuning."""
    # Check if chords are already in the database
    cached_data = get_chords_from_db(tuning)
    if cached_data:
        return cached_data

    # Generate chords if not cached
    tuning_list = list(tuning)
    chords, _ = generate_chords(
        tuning=tuning_list,
        max_fret=11,
        min_strings=3,
        max_finger_string_span=1,
        min_fingers=0,
        max_fingers=4,
    )

    # Sort chords by name
    chords.sort(key=lambda chord: chord['name'])

    # Save to database
    chords_json = json.dumps(chords)
    save_chords_to_db(tuning, chords_json)

    return chords_json

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
