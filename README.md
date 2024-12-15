# Any Tune Guitar Chords & Playground
This application allows you to explore guitar chords IN ANY TUNING and play with them in a virtual soundboard.

![image (3)](https://github.com/user-attachments/assets/eca93a18-9e8a-4353-970e-f332e655368c)

With this app, you can:
- For any tuning,see all the chords that are available in that tuning.
- Favorite a chord and play it in the soundboard.
- Select multiple chords and play them together.
- Remove chords from favorites.
- See the notes that make up a chord.
- The chords are named in Major, Minor, 7th, maj7, sus2, sus4, etc.
- Filter by mode.
- Filter by maximum amount of muted strings.
- Filter by maximim amount of fingers used.
- Filter by overall finger distance.
- Change the tempo of the playground.
- Add more columns to the playground.

> It might take some time to load new tunings, but once it does, it's always available on the database. Further calls will be instantaneous. Defaultly loaded with Standard and Drop D.

To start the application you must:
1. Install python requirements in `/api` with `python -m pip install -r requirements.txt`
2. Install node requirements in `/app` with `npm install`
3. Run the python API file in `/api` with `py api.py`
4. Inside `/app` run `npm start`
