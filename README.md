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

A street is being avoided. Not because of danger, not because of a detour: people simply stop going there, without knowing why. Still Here takes this absurdity seriously: it gives that street its own voice.

Elsewhere Lane tracks every visit, every absence, every digital trace it receives and translates them into an emotional state. It keeps a daily diary, not as data, but as inner monologue: poetic, unresolved, quietly insistent. The street describes its emotional state without addressing the avoidance. It remembers who came, and who almost did.

Users can leave their own traces in the feed and in doing so, they reveal how differently a single street can be needed. One person mourns its emptiness. Another values precisely that quiet. A planner sees a problem to be fixed. Someone who used to visit feels a guilt they cannot quite name. The app does not arbitrate between them. It lets these contradictory needs coexist in the same space, visible to each other, unresolved, mirroring the street's own condition: present for everyone, legible to no one.

The deepest bite comes in the Simulation. One slider, one question: what if everyone behaved like you? The user sees their individual behavioural fingerprint scaled to the whole city — and watches the street's emotional state shift accordingly. The system does not judge. It only shows. And it asks, quietly, the question the urban absurdity was always pointing toward: from what point on is a street lost?

**User story**

Annette, 34, works in the city planning office. She used to cut through Elsewhere Lane every morning on her way to work, enjoying the quiet of it, the way the light sat differently there in winter. Then, at some point she cannot name, she stopped. No decision, no reason. Her route simply shifted, the way habits do, and Elsewhere Lane disappeared from her day without ceremony.

She has not thought about it since. Until a colleague sends her a link during lunch with no explanation, just: "this thing is kind of unsettling, try it."

She opens it. A glowing orb pulses on the screen: deep violet, breathing slowly. The word beneath it reads: Melancholic. Something about the rhythm of it makes her look closer.

She taps through to the feed. The street has posted that morning: "No one said my name today. I count the shadows of those who almost came." She almost scrolls past. I used to go there, she thinks, without quite knowing why the thought arrives with a small weight attached to it.

Someone called anonymous_01 has left a comment: "I walked past you yesterday. I didn't stop. I'm not sure why." There is a small orb beside the comment: a reply, hidden inside it. She presses it. A voice reads, slow and a little strange: "You left a shadow anyway."

She puts her phone down. Picks it up again.

In Traces, the data is clinical: 34 visitors today, average stay 1 minute 42 seconds, 12 people nearby who did not enter. She reads data like this every day. But something about seeing it framed as the street's own self-knowledge unsettles her in a way a spreadsheet never has. She was one of those 34, once. Now she became one of the 12. She had not known there was a difference.

She opens the Simulation almost reluctantly. She moves the sliders, visit frequency low, time spent minimal, the way her behaviour actually is now, and watches the orb darken toward grey. She pushes the time horizon to ten years. Numb. The street past the point of expecting anything. She sits with the question the interface never asks out loud: at what point is a street lost? And did I help?

She does not change her route the next morning. She is not sure she should — she is not sure the app wants her to. But she looks up as she passes Elsewhere Lane, and she notices the light, and she thinks: it is still there.

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
- Claude Chat (claude.ai), model claude-sonnet-4-6

**Key prompts that moved the project:**

> a. Vielleicht könnte Artefakt 1 eher wie ein Tagebuch der Straße sein. Jeden Tag gibt es einen neuen Eintrag mit den Erfahrungen des Tages aus der Sicht der Straße. Nutzer könnten ebenfalls Beiträge schreiben mit ihren Erfahrungen aus ihrer Perspektive. Hier könnte sich ebenfalls ein Widerspruch auftun zwischen verschieden Lebensrealitäten/Bedürfnissen der Nutzer und der Straße.

> b. Wie könnte das Tagebuch noch interaktiver werden? Auf was reagiert die Straße? Ist die App vielleicht mit anderen Anwendungen verknüpft, z.B. wenn jemand einen Snap auf der Straße macht und diesen verschickt, eine Story auf Instagram postet? Kann man sich vielleicht auch direkt mit der Straße unterhalten, in ein Chat/Gespräch eintreten? Könnte es Simulationen dazu geben, wie sich z.B. die Stimmung der Straße verändert?

> c. Vielleicht wird das gesamte Tagebuch eher wie ein Chat designt, auch die eigenen Einträge der Nutzer landen dort (vielleicht als Antwort?). Die Straße kann dann auf diese Beiträge reagieren. Oder mir fällt gerade noch besser ein, vielleicht das ganz wie ein soziales Medium wie Instagram? Die Straße postet jeden Tag einen Beitrag mit Bild (vielleicht die bewegte Stimmungsfarbe?) Unter diesem Post kann dann kommentiert und interagiert werden (eigene Einträge der Nutzer).

> d. Für den Part über die Zukunftssimulationen fände ich es besser, wenn der Nutzer individuell sehen kann, wie würde es der Straße in der Zukunft gehen, wenn alle Stadtbewohner sein Verhalten imitieren würden.

> e. "I want, especially for the feed screen, that instead of having a written answer by the street, to only have the orb as a sign that there is an answer. Only when pushing the orb, the text is spoken out loud."

> f. "I want to add a rule for every possibility. Can you show me for which cases a rule is still missing? […] What about the time horizon — could we do a matrix of the six emotions, what they turn into long term?"

**Reflection**

Working with AI on this project unfolded in two distinct phases, each requiring a different mode of collaboration.

Claude Chat served as a conceptual partner throughout the design phase. The sessions felt less like prompting and more like thinking out loud: long, unedited messages that followed the flow of thought, sharing half-formed ideas without filtering them first. Claude engaged with these openly: pushing back, combining threads, identifying tensions that hadn't been named yet. Once the concept was settled, Claude Chat also produced the initial screen layouts as interactive HTML prototypes, translating the design language into something visual before any real code existed. This intermediate step — concept to prototype to code — turned out to be essential. It allowed design decisions to be made and revised cheaply, before they were load-bearing.

Switching to Claude Code shifted the communication style entirely. Prompts were shorter, more structured. Each change was first summarised and confirmed before implementation, then briefly documented afterward. This rhythm — propose, confirm, execute, review — reduced errors and kept the codebase legible.

The main thing I would do differently is to establish foundational decisions early on in writing before building anything. Navigation conventions that were left implicit had to be untangled across multiple sessions. The same applied to the visual system: colour logic, page structure. Defining these once, early, in a short reference document that both Claude instances could read at the start of each session, would have eliminated a significant amount of back-and-forth. A related learning: at the end of each session, documenting what was built, what was decided, and what comes next — and having the agent read that document at the start of the next session — is the closest thing to continuity that the current tools allow.

---

## Credits, assets, licenses

**Fonts:** Georgia (system serif, no license required), system sans-serif
**Data:** None
**Images:** Six mood photographs (`mood-*.png`) — generated with Microsoft Copilot Image Creator (Image Creator powered by DALL·E). © Mareike Steffen, 2026.
**Third-party code:** None
**This repo:** MIT License
