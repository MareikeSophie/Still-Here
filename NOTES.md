# Still Here — Project Notes

## What this is
A fictional phone app prototype built in React + Vite. A street named "Elsewhere Lane" has its own app — it tracks who visits, how long they stay, and develops an emotional state (mood) in response. The app is a design project for a university studio (Bauhaus, urban design).

**Theme:** People have started to avoid certain streets without knowing why.
**Constraint:** You must design for contradictory user needs at the same time without resolving them.

## Links
- **Live app:** https://mareikesophie.github.io/Still-Here/
- **GitHub repo:** https://github.com/MareikeSophie/Still-Here
- **Miro frame:** https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764667736227548&cot=14

## Running locally
```
cd "C:/Users/marei/Documents/Universität/02 Master Bauhaus/SoSe 26/Prompt City Wolfsburg/Nonsense/Finalised"
npm run dev
```
Opens at http://localhost:5173

## App structure
Five screens. The main loop (Homescreen, Feed, Simulation) is navigated by swipe or arrow keys. Traces is a side screen with dedicated entry/exit — not part of the main loop.

Swipe directions and arrow key directions are intentionally different. Arrow keys match the written nav labels on screen.

| Screen | Swipe left | Swipe right | ← key | → key |
|---|---|---|---|---|
| Homescreen | Feed | Simulation | Simulation | Feed |
| Feed | Simulation | Homescreen | Homescreen | Simulation |
| Simulation | Homescreen | Feed | Feed | Homescreen |

**Traces entry points (three ways in):**
- "Last trace" pill on Homescreen
- Tap anywhere in the Feed profile header
- Swipe down on Feed when scrolled to the very top

**Traces exit:**
- Swipe up when scrolled to the very bottom, or press ↓ — always returns to Feed

## Mood system
On load, one of 6 moods is randomly chosen and held for the entire session:
Melancholic / Restless / Numb / Peaceful / Overwhelmed / Hopeful

The mood color (orb) flows through all screens — icon, homescreen orb, feed orbs, traces chart, simulation accents all use the same color.

Mood data lives in: `src/moods.js`

## Screens — current state

### Launcher
- Shows the app icon with the random mood color
- Click to open Homescreen

### Homescreen
- Animated gradient background in mood colors
- Centered orb with breathing animation
- Mood name + quote
- "Last trace" pill (clickable → Traces)
- Clean nav hints at bottom

### Feed
- Profile header orb matches mood color; entire header is clickable → opens Traces
- Two Elsewhere Lane posts: animated canvas images (drifting particles + glow in mood colors)
- One Instagram post (lea.urban): photo swaps based on global session mood → `src/assets/mood-[moodname].png`
- Reaction bar: ♡ first, then "I was there" / "I avoided you" (Elsewhere Lane posts only — lea.urban shows ♡ only)
- Comments: Enter key to post, newest comment appears at top; 60% chance of a reply, appears after 1.4s
- Street replies are hidden — only the orb is shown inline after the comment text; tap orb to hear the reply spoken aloud
- Voice is tuned to the session mood (rate + pitch vary per mood), language set to en-GB
- While speaking: orb pulses faster and glows; tap again to stop
- Input field glows in mood color when focused
- Nav label: ← home / simulation →

### Traces
- Day-by-day visitor stats, navigate with ‹ › buttons
- Movement pattern chart: area + line in mood color, "you" dots sit ON the line
- All accent colors use mood color
- Nav label: ↓ feed (centered)

### Simulation
- Interactive sliders: visit frequency, time spent, digital presence, time horizon
- Dragging a slider does not trigger screen navigation
- Orb + background change based on slider combination
- Mood logic defined in getMood() using MOOD_MATRIX lookup (see table below)
- All accent colors use mood color
- Nav label: ← feed / home →

## Simulation mood logic
getMood(freq, timeSpent, digital, horizon) uses a matrix lookup — no fallback default.

Each slider is bucketed first:
- freq: Low = 0–1, Mid = 2, High = 3–4
- timeSpent: Low = 0–1, Mid = 2, High = 3–4
- digital: Low = 0–1, High = 2–4
- horizon: Short = 0–2, Long = 3–5

| freq | timeSpent | digital | Short horizon | Long horizon |
|---|---|---|---|---|
| Low  | Low  | Low  | Melancholic | Numb      |
| Low  | Low  | High | Restless    | Numb      |
| Low  | Mid  | Low  | Melancholic | Numb      |
| Low  | Mid  | High | Restless    | Restless  |
| Low  | High | Low  | Peaceful    | Peaceful  |
| Low  | High | High | Overwhelmed | Peaceful  |
| Mid  | Low  | Low  | Restless    | Restless  |
| Mid  | Low  | High | Restless    | Restless  |
| Mid  | Mid  | Low  | Hopeful     | Peaceful  |
| Mid  | Mid  | High | Hopeful     | Peaceful  |
| Mid  | High | Low  | Hopeful     | Peaceful  |
| Mid  | High | High | Hopeful     | Peaceful  |
| High | Low  | Low  | Restless    | Restless  |
| High | Low  | High | Restless    | Restless  |
| High | Mid  | Low  | Hopeful     | Peaceful  |
| High | Mid  | High | Overwhelmed | Lively    |
| High | High | Low  | Hopeful     | Lively    |
| High | High | High | Hopeful     | Lively    |

Implemented as MOOD_MATRIX lookup object in Simulation.jsx — 36 cells, every combination explicit.

## Key files
```
src/
  App.jsx           — navigation state, mood pick, screen routing
  moods.js          — the 6 mood objects (colors, quotes, traces)
  hooks/useSwipe.js — swipe + mouse drag + keyboard navigation
  screens/
    Launcher.jsx
    Homescreen.jsx
    Feed.jsx
    Traces.jsx
    Simulation.jsx
  assets/
    mood-melancholic.png  — lea.urban Instagram photo, shown when session mood is Melancholic
    mood-restless.png
    mood-numb.png
    mood-peaceful.png
    mood-overwhelmed.png
    mood-hopeful.png
```

## Voice parameters (Feed replies)
| Mood | Rate | Pitch |
|---|---|---|
| Melancholic | 0.8  | 0.85 |
| Numb        | 0.75 | 0.7  |
| Restless    | 1.15 | 1.1  |
| Peaceful    | 0.9  | 1.0  |
| Overwhelmed | 1.2  | 1.25 |
| Hopeful     | 1.0  | 1.15 |

## Status
App complete and deployed. README complete except for personal edits to Concept, User story and Reflection sections (drafts already in place).

## If you come back to this
- Run `npm run dev` to start locally (see above)
- Push changes with `git add . && git commit -m "message" && git push` — GitHub Actions deploys automatically
- The mood logic matrix lives entirely in `Simulation.jsx` (MOOD_MATRIX object)
- Navigation wiring lives entirely in `App.jsx`
- Swipe logic (including scroll-position checks) lives in `useSwipe.js` and the individual screen files
