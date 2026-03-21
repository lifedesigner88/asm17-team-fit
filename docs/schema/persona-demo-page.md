# Schema — `/persona/demo` Page

**Route:** `/persona/:personId` (demo shortcut: `/persona/demo`)
**Loader:** `personaLoader` — returns hardcoded `DEMO_PROFILE` when `personId === "demo"`, otherwise fetches `GET /persona/:id` from backend.
**Source file:** `apps/frontend/src/features/persona/pages/persona-page.tsx`

---

## Data Shape (`PersonaProfile`)

```ts
type PersonaProfile = {
  person_id: string;           // e.g. "demo"
  archetype: string;           // e.g. "reflective educator-builder"
  headline: string;            // short role description
  one_liner: string;           // single sentence bio
  email?: string;              // optional contact email
  github_address?: string;     // optional GitHub URL
  mbti: MbtiProfile;           // type + identity + 5 axis scores (0–100)
  top3_values: string[];       // e.g. ["Life Design", "Growth & Learning", ...]
  strengths: string[];
  watchouts: string[];
  goals_vision: GoalsVision;   // lifetime_mission, current_decade_mission, long_term_vision, long_term_directions[]
  fit_vectors: FitVectors;     // Record<string, number> scored 1–5, any number of axes
  sdg_alignment: SdgAlignment[]; // { sdg: number, label: string, resonance: "high"|"medium"|"low" }[]
  identity_shifts: IdentityShift[]; // { period, label, note }[] — displayed newest first
};
```

---

## Page Sections (top → bottom)

### 1. Hero Card
- Badges: `Public persona` + `person_id`
- Title: `archetype` (large)
- Body: `one_liner`, `headline`
- Contact pills: `email` (mailto link) + `github_address` (external link) — rendered only if present
- Top values: teal pill tags
- **Copy CTA** (full-width): copies full profile as Markdown to clipboard

### 2. MBTI Card
- Badge: `{TYPE}-{identity}` — 96×96px gradient button (5 dominant trait colors), links to 16personalities type page
- Title: persona name (e.g. "The Advocate"), links to 16personalities type page
- Description + AI prediction disclaimer
- **5-bar gradient chart** — one bar per axis:
  - I ↔ E (indigo → amber)
  - N ↔ S (cyan → emerald)
  - F ↔ T (rose → blue)
  - J ↔ P (amber → green)
  - T ↔ A (red → violet)
  - Each bar: left label + % (linked to 16personalities article), gradient track, thumb circle, right label + %
- "View on 16personalities →" links to all-types page

### 3. Goals & Vision Card
- Long-term vision (title)
- Lifetime mission
- Current decade mission
- Long-term directions (bullet list)

### 4. Drive Vectors Card
- Description sentence
- **Radar polygon chart** — dynamic axes from `fit_vectors` keys
  - Colors: `axisColor(i, total)` = HSL evenly spaced around hue wheel
  - Radial gradient fill (white center → rainbow edges)
  - Colored spokes, colored edge segments, colored dots, colored labels
- AI prediction disclaimer

### 5. SDG Alignment Card
- Grid of `SdgBadge` tiles — official UN SDG icon + label + link to `sdgs.un.org/goals/goal{N}`
- High resonance: teal ring; medium: zinc ring
- AI prediction disclaimer
- Background: light MBTI color tint (colors 2+3)

### 6. Identity Timeline Card
- Items displayed **newest first** (`[...identity_shifts].reverse()`)
- Each item: colored dot + gradient connector line + bold period label + shift label + note
- Colors cycle through 5 dominant MBTI colors
- Background: light MBTI color tint (colors 0+4)

### 7. Strengths + Watch Outs (2-column grid)
- Strengths: teal dots, MBTI tint (colors 0+1)
- Watch Outs: amber dots, MBTI tint (colors 3+4)

### 8. Q&A Panel (auth-gated)
- Logged-in: chat UI — user asks, persona answers via `POST /persona/:id/ask` (AI, backend TODO)
- Logged-out: "Log in to ask this persona a question" prompt

---

## Color System

### MBTI Badge Gradient
Computed from 5 dominant trait colors in axis order:
```ts
getMbtiDominantColors(mbti) → string[]  // leftColor if score ≥ 50, else rightColor
getMbtiDominantGradient(mbti) → "linear-gradient(135deg, c0, c1, c2, c3, c4)"
```

### Drive Vector Colors
```ts
axisColor(i, total) → `hsl(${i/total * 360}, 58%, 62%)`
```
Evenly distributed around the hue wheel — works for any number of axes.

### Section Background Tints
```ts
mbtiCardBg(idxA, idxB, deg?) → "linear-gradient(deg, colorA + '0f', colorB + '0a', white)"
// hex 0f ≈ 6% opacity, 0a ≈ 4% opacity
```
