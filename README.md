# DEEP SIGNAL — DJ Studio & AI Music Production

A fully browser-based, cloud-native DJ and deep house music production environment. No installs, no plugins — runs entirely in your browser using the Web Audio API.

## Features

### 🎛 DJ LIVE Mode
- Dual deck playback (load any MP3/WAV/FLAC from your machine)
- BPM auto-detection
- Live waveform display with playhead
- 3-band EQ (Hi/Mid/Lo) with drag knobs and kill switches
- 4 FX per deck: Reverb, Delay, Filter Sweep, Bitcrush
- Crossfader with A/MID/B presets
- Channel faders + Master gain + Master filter
- Loop controls: ½, 1, 2, 4, 8 bars
- 4 Hot Cues per deck
- Beat Sync between decks
- Live VU meters
- Set Recording → export as .webm audio

### 🎹 STUDIO Mode
- **Drum Sequencer**: 8 tracks, 16 or 32 steps, 4 patterns (A/B/C/D)
  - Tracks: Kick, Snare, Hi-Hat, Open Hat, Clap, Perc, Bass, Chord
  - Per-step velocity (drag up/down on steps)
  - Swing control 0–75%
  - Mute/Solo per track
  - Randomize + Clear
  - All drums synthesized via Web Audio API (no samples needed)
- **Piano Roll**: 5-octave chromatic keyboard, click-to-place notes, Bass & Chord tracks read live during playback
- **Channel Mixer**: Per-track fader, VU meter, Mute, Solo, Master strip
- **Arranger**: 32-bar timeline, click to place pattern blocks, visual arrangement view

### ⚡ AI AGENT Mode (requires Anthropic API key)
- **Prompt → Pattern**: Describe a vibe in plain English, get a full 8-track groove
- **Style Transfer**: Apply Larry Heard / Kerri Chandler / Moodymann / Burial / Basic Channel / Joaquin Joe aesthetics to your pattern
- **Variation Engine**: Generate 3 mutations of any pattern at adjustable intensity
- **Mix Analysis**: Real-time DJ coaching and transition advice
- **Arrangement Agent**: Build full 6–10 minute track arrangements from a text prompt
- **Free Chat**: Ask anything about deep house production, music theory, mixing

## Getting Started

### Option 1: Open directly in browser
Just open `index.html` in Chrome, Firefox, or Safari. No server needed.

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html   # Linux
```

### Option 2: Run with a local server (recommended for best performance)
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Then open: http://localhost:8080
```

## AI Features Setup

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Open the **⚡ AI AGENT** tab
3. Paste your key into the API key field
4. Click **TEST CONNECTION**
5. Start generating

> The app calls the Anthropic API directly from the browser. Your API key is never stored — it lives only in the page session.

## Keyboard Shortcuts

### DJ Mode
| Key | Action |
|-----|--------|
| `A` | Play/Stop Deck A |
| `B` | Play/Stop Deck B |
| `Q` | Cue Deck A |
| `W` | Cue Deck B |
| `Z` | 4-bar Loop Deck A |
| `X` | 4-bar Loop Deck B |
| `S` | Sync Decks |

### Studio Mode
| Key | Action |
|-----|--------|
| `Space` | Play / Pause sequencer |
| `Esc` | Stop sequencer |

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS (zero dependencies, zero build step)
- **Audio Engine**: Web Audio API (synthesis, EQ, FX, routing)
- **AI**: Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Fonts**: Google Fonts (Orbitron, Rajdhani, Share Tech Mono)

## File Structure

```
deep-signal-studio/
├── index.html       ← The entire app (single file)
├── README.md        ← This file
└── CHANGELOG.md     ← Version history
```

## Roadmap

- **Phase 4**: Cloud save/load (Supabase), collaborative sessions, WAV export
- MIDI controller support (Web MIDI API)
- Sample pack browser + drag-to-deck
- Key detection and harmonic mixing
- AI mastering chain

## License

MIT — build on it, ship it, remix it.
