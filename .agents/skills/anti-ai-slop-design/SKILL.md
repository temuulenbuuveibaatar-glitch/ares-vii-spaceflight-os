---
name: anti-ai-slop-design
description: Eliminates and prevents all visual, structural, typographic, and copy fingerprints of AI-generated web designs (purple gradients, pill buttons, floating eyebrow labels, emoji-stuffed headings, em dashes, empty metaphors, and decorative numbering). Auto-activates on all web design and frontend tasks.
---

# Anti-AI Slop Design Guide & Strict Enforcement

This skill establishes mandatory rules to prevent websites, applications, and copy from looking like generic AI-generated templates (v0, Lovable, Bolt.new, Framer defaults, or typical LLM outputs).

## 1. Visual & Color Rules

- **NO Purple-to-Blue Gradients**: Never use indigo, violet, purple-to-blue, or neon cyan glow gradients as backgrounds, borders, or accents. AI builders default to this heavily.
- **NO Generic Slate/Indigo Palettes**: Avoid `#0f172b` slate backgrounds with bright violet/indigo CTA buttons. Use intentional, domain-authentic palettes (e.g., Tactical Olive `#84a96c` with Amber Gold `#fbbf24` on Obsidian Gunmetal `#0b0e0a`).
- **NO Pill Buttons (`rounded-full`)**: Do not use pill-shaped capsule buttons for primary actions. Use authentic geometric radii (`rounded-xl` or `rounded-2xl` matching container ratios).
- **NO Glowing Left-Border Cards**: Never use feature cards with a bright 2px left border accent line. Style cards with clean, subtle outer-inner borders and genuine structural depth.
- **NO Random Decorative Numbering**: Never slap `01`, `02`, `03` in tiny tracked uppercase on cards or steps just to fill space. Only number items when there is an actual sequential procedure.
- **NO Emojis in Headings or Buttons**: Never prefix headings, badges, or buttons with emojis (`🚀 Launch`, `✨ Features`, `💡 Idea`, `🌻 Sunflower`). Use clean Lucide SVG icons or pure typography.

## 2. Copy & Writing Rules

- **NO Em Dashes (`—`) or En Dashes**: Do not use em dashes to link thoughts. Write direct, clear sentences. Use commas, colons, or periods instead.
- **NO Empty AI Metaphors**: Ban phrases like:
  - "a rich tapestry of"
  - "at the intersection of"
  - "a multifaceted approach"
  - "testament to"
  - "delve into"
  - "beacon of"
  - "game-changer"
- **NO "Not Only X, But Also Y" Formula**: Never use this generic LLM hedge structure. State facts directly.
- **NO Eyebrow Tags Above Headlines**: Remove small uppercase tracking tags floating directly above section titles (e.g., `// OPERATIONAL SPECIFICATION`, `TAG // ARCHITECTURE`). Let titles be bold, self-explanatory, and editorial.
- **NO Fake Testimonials**: No generic stock quotes from placeholder names ("Sarah J., Flight Director"). Use documented historical flight facts or mission telemetry.
- **Bigger, Readable Typography**: Never hide critical content in `text-[10px]` or `text-xs`. Core body text must be `text-base` (16px) or `text-sm font-semibold` minimum.

## 3. Imagery & Media Rules

- **NO AI-Generated Airbrushed Faces**: Never use artificial portraits with glossy skin or uncanny lighting.
- **NO Generic Smiling Stock Photos**: Use authentic aerospace schematics, live waveform visualizers, real mission telemetry, or verified engineering charts.

## 4. Code & Technical Rules

- **NO Builder Fingerprints**: Strip any generator meta tags or builder-specific prefixes.
- **Deterministic State Machines**: Medical and flight decisions must run through deterministic, auditable logic, never unverified raw LLM streams.

## Enforcement Checklist

| AI Slop Fingerprint | Human-Engineered Replacement |
| :--- | :--- |
| `🚀 Launch System ↗` | `<Rocket /> Launch System` (Clean SVG icon, no emoji) |
| `// SPECIFICATION` floating tag | Clear, strong section headline without eyebrow tag |
| `01`, `02`, `03` decorative badges | Natural card title or meaningful functional label |
| Sentences broken by em dashes (`—`) | Direct, crisp sentences separated by periods or colons |
| Glowing left-border cards | Solid concentric borders (`border border-[#2e3b23] bg-[#13190e]`) |
| Pill buttons (`rounded-full`) | Geometric rounded rectangles (`rounded-xl` / `rounded-2xl`) |
