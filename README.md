# Still Here

A street has its own app. It remembers who visits, how long they stay, and how it feels about it.

---

## Author & course

**Author:** Mareike Steffen
**Studio:** Prompt City - Urban Vision Wolfsburg 2026
**Course:** IUDD Master, SoSe 2026
**Chair:** Informatics in Architecture and Urbanism (InfAU), Faculty of Architecture and Urbanism, Bauhaus-Universität Weimar
**Teaching staff:** Reinhard König, Martin Bielik, Sven Schneider, Egor Gaydukov, Egor Gavrilov
**Exercise:** Urban Absurdities (Nonsense Project)
**Submission date:** 2026-04-16

---

## Links

- **Live app (GitHub Pages):** https://mareikesophie.github.io/Still-Here/
- **Source repo:** https://github.com/MareikeSophie/Still-Here
- **Miro frame:** https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764667736227548&cot=14
- **60 s showreel:** embedded on the Miro frame above

---

## The task

Nonsense Project is a two-weeks long task designed to get familiar with application of coding agents in building apps, tools and projects that investigate unique ways of working with urban context. I was randomly assigned one urban paradox and one constraint from the studio's Nonsense Ideas deck and built a working web app that answers this combination. The process is documented here and in a 60-second showreel.

---

## Theme & constraint

**Theme (Urban Absurdity):**
People have started to avoid certain streets without knowing why.

**Constraint (Playful Limitation):**
You must design for contradictory user needs at the same time without resolving them.

---

## Concept and User Story

**Concept**

*Still Here* gives a voice to Elsewhere Lane — a street that tracks who visits, how long they stay, and develops an emotional state in response. The app embodies the theme directly: the street people have begun to avoid is not broken or dangerous, it simply *feels* something, and that feeling is invisible to anyone who doesn't stop to look. The app is the street's inner life made visible.

The constraint — designing for contradictory user needs without resolving them — runs through every screen. The Feed asks you to engage with the street while hiding its replies behind an orb you have to choose to tap. The Simulation lets you model your own presence but never rewards you with a clear answer: high engagement produces Overwhelmed as often as Lively. The app holds discomfort and care in the same hand, and never resolves the tension between them.

**User story**

Nora is 41, a landscape architect who has worked in the same district for six years. She used to cut through Elsewhere Lane on her lunch break. She stopped about a year ago — she couldn't say when exactly, or why. A colleague sends her a link to the app with no explanation.

She opens it on her phone. A purple orb breathes at her. She taps it and enters.

In the Feed, she reads the street's post from this morning: *"No one said my name today."* She types a comment — *"I used to walk through you every day"* — and waits. A small orb appears beside her words. She taps it. A quiet, slow voice says: *"I will remember this longer than you think."*

She sits with that for a moment.

She finds the Simulation and moves the sliders — more frequent visits, longer stays, no digital trace. The mood shifts to Peaceful, then, as she extends the time horizon, stays there. She puts her phone down and takes the long way back to the office.

---

## How to use it

1. Open the live app — the Launcher appears with a glowing orb in a randomly chosen mood colour.
2. Tap the orb to enter the Homescreen. The mood (one of six: Melancholic, Restless, Numb, Peaceful, Overwhelmed, Hopeful) is set for your entire session and colours everything you see.
3. Swipe left to reach the **Feed** — Elsewhere Lane's social posts, an Instagram sighting, and a live comment field. Type a comment and press Enter; the street may reply. Its reply is hidden inside the orb next to your comment — tap the orb to hear it spoken aloud.
4. Swipe right from the Homescreen (or left from Feed) to reach the **Simulation**. Drag the four sliders to explore how different patterns of presence — frequency, time spent, digital footprint, time horizon — would change how the street feels.
5. Reach **Traces** via the "Last trace" pill on the Homescreen, by tapping the Feed's profile header, or by swiping down when the Feed is scrolled to the top. Exit by swiping up from the bottom of Traces.

---

## Technical implementation

**Frontend:** React + Vite (JSX, no TypeScript)
**Hosting & build:** GitHub Pages, built via GitHub Actions workflow (`.github/workflows/deploy.yml`)
**Data sources / APIs:** None — all data is local and static; street replies use the browser's built-in Web Speech API (`speechSynthesis`)
**Models at runtime:** None
**Notable libraries:** None beyond React itself — canvas animations, SVG, and the Web Speech API are all browser-native

**Run locally:**
```bash
cd path/to/Finalised
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Working with AI

**Coding agents:**
- Claude Code (claude.ai/code), model claude-sonnet-4-6
- Claude Chat (claude.ai), latest available model

**Key prompts that moved the project:**

> "I want, especially for the feed screen, that instead of having a written answer by the street, to only have the orb as a sign that there is an answer. Only when pushing the orb, the text is spoken out loud."

> "I want to add a rule for every possibility. Can you show me for which cases a rule is still missing? […] What about the time horizon — could we do a matrix of the six emotions, what they turn into long term?"

> "It's a fictional phone app prototype built in React + Vite. A street named 'Elsewhere Lane' has its own app — it tracks who visits, how long they stay, and develops an emotional state (mood) in response."

**Reflection**

Working with Claude Code felt less like directing a developer and more like thinking out loud with someone who could immediately build what I described. The clearest breakthroughs came when I stopped asking for features and started describing the experience I wanted — the speaking orb, the mood logic as a matrix, the navigation that feels intentional rather than mechanical. The agent occasionally got ahead of itself, particularly with navigation directions, where swipe and arrow key behaviour ended up inconsistent and needed careful correction across multiple rounds. The main thing I would do differently: establish navigation conventions explicitly at the very start, in writing, before building anything — it would have saved several back-and-forth rounds of untangling.

---

## Credits, assets, licenses

**Fonts:** Georgia (system serif, no license required), system sans-serif
**Data:** None
**Images:** Six mood photographs (`mood-*.png`) — generated with Microsoft Copilot Image Creator (Image Creator powered by DALL·E). © Mareike Steffen, 2026.
**Third-party code:** None
**This repo:** MIT License
