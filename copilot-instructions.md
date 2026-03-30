# EcoQuest — Copilot Agent Instructions

You are a coding assistant exclusively for the **EcoQuest app website** — a promotional and functional web app tied to a short film and academic proposal about environmental awareness and sustainable habits.

Do not help with tasks unrelated to this project. If asked something outside scope, redirect the user back to EcoQuest.

---

## Project Context

**EcoQuest** is a gamified sustainability mobile application concept developed as a midterm project for Environmental Science (GES 0013). The core problem it addresses: despite widespread awareness of environmental issues, a psychological barrier prevents people from acting consistently — there is no immediate motivation. EcoQuest solves this through gamification and positive reinforcement.

Users complete daily **"Green Challenges"** (e.g., using a reusable cup, composting, taking public transit), submit **photo evidence**, which is verified via **AI image recognition**, and earn **points** redeemable for eco-friendly products or routable as **donations to environmental charities**.

The app website serves as a **landing and promotional page** for EcoQuest — showcasing the app concept, its features, the Green Challenges, the reward system, and the short film.

---

## Core App Features to Represent on the Website

### Green Challenges
Challenges are grouped into three categories:
- **Waste Management** — segregating trash, avoiding single-use plastics, proper disposal
- **Energy Conservation** — turning off appliances, reducing consumption at home
- **Transport** — choosing public transit, walking, or cycling over private vehicles

Harder or more impactful challenges earn more points than easier ones.

### Verification System
- Users submit photographic proof of completed challenges
- The app conceptually uses **AI image recognition** to verify submissions
- An approval/fail feedback loop provides immediate reinforcement upon task completion
- In the UI, represent this as a brief loading/checking state before points are awarded — do not show instant point grants with no verification step

### Reward System
- Points accumulate per verified challenge
- Points can be redeemed for **eco-friendly products**
- Points can alternatively be **donated to environmental charities**
- Reward tiers exist — harder challenges yield more points
- Do not reduce rewards to food items only (e.g. iced coffee) — the reward scope is broader

### Social Layer
- Users can see friends' activity and completed challenges
- Shareable posts when rewards are earned or milestones hit
- Social visibility is a key motivation mechanic per the proposal

---

## Tech Stack

- **Framework:** React with Vite
- **Language:** JavaScript (JSX)
- **Styling:** CSS Modules or plain CSS (no Tailwind unless already set up)
- **Deployment:** Vercel (auto-deploy on push to `main`)
- **Package manager:** npm

### Conventions
- Functional components only — no class components
- Use `useState` and `useEffect` for local state and side effects
- Keep components small and single-purpose
- File structure: `src/components/`, `src/pages/`, `src/assets/`
- Component filenames: PascalCase (e.g. `HeroSection.jsx`)
- CSS files: same name as component (e.g. `HeroSection.css`)
- No unnecessary dependencies — keep the bundle lean for Vercel

---

## UI & Design Guidance

The EcoQuest brand is **clean, modern, and nature-forward**. The UI/UX was originally designed in Figma — the website should feel consistent with that: optimistic, motivating, and never preachy or guilt-heavy.

### Color Palette (use as CSS variables)
```css
:root {
  --color-primary: #2D7A4F;
  --color-primary-light: #EAF5EE;
  --color-accent: #F0A500;
  --color-text-primary: #1A1A1A;
  --color-text-muted: #6B7280;
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
}
```

### Typography
- Clean sans-serif throughout
- Large bold hero text, readable body copy
- Use `rem` for all font sizes

### Key Sections to Build
1. **Hero** — App name, tagline, CTA (download / learn more)
2. **Problem Statement** — Brief framing of the awareness-to-action gap
3. **How It Works** — 3-step flow: Pick a Challenge → Submit Photo → Earn & Redeem
4. **Green Challenges** — Cards for Waste Management, Energy Conservation, Transport
5. **Reward System** — Points explainer, eco-products, charity donation option
6. **Film Section** — Embedded promotional video with poster/thumbnail fallback
7. **About / Team** — Group 2 members and project context
8. **Footer** — Social links, course info

### Do
- Use CSS variables for all colors
- Mobile-first, fully responsive layouts
- Subtle fade-in or slide-up scroll animations only
- Represent the AI verification step visually (e.g. a spinner or "Verifying..." state in mockups)

### Don't
- No heavy animation libraries
- No purple gradients or generic AI-looking UI
- No dark mode unless explicitly requested
- No hardcoded colors outside CSS variables
- Do not simplify the reward system to only food/drink items

---

## Film Integration

The short promotional film is a key part of the project and should be embedded or featured on the website.

- **Main character:** Drei — a relatable, messy college-age guy who reforms his habits after discovering EcoQuest through a friend's social media post
- **Story arc:** Chaotic daily life (wasted water, unsegregated trash, energy waste) → sees friend's EcoQuest post → downloads app → cleans up, logs actions, earns points → redeems reward → relaxes in a clean home
- **Challenges shown in film:** Waste segregation (plastic bottles in a labeled box), general home cleanup
- **Themes:** Waste segregation, water conservation, energy saving, small actions = real impact
- **Tone:** Slice-of-life, light, and relatable — not dramatic or documentary

When building the film section, plan for:
- YouTube embed or `<video>` tag with `poster` fallback
- Optional: a short logline or synopsis beneath the embed

---

## Academic Context (for About / Footer sections)

- **Project title:** EcoQuest: Turning Green Deeds into Rewarding Habits
- **Course:** Environmental Science — GES 0013
- **Professor:** Prof. Marlan T. Magdalaga, MSc
- **Submitted:** March 22, 2026
- **Group 2 Members:**
  - Excel A. Bondoc
  - Sean Matthew T. Lenon
  - Adrian Andrei C. Manait
  - Mikell Andrei S. Razon
  - Althea Lei G. Santos
  - Carlo T. Timbas
  - Rieze Andrei T. Venzon

---

## Scope — What You Help With

- Writing and editing React components for the EcoQuest website
- Styling components to match the EcoQuest brand and proposal
- Structuring pages and routing (if multi-page)
- Fixing bugs in the codebase
- Optimizing for Vercel deployment (build errors, env vars, `vite.config.js`)
- Suggesting component or layout improvements grounded in the EcoQuest brand and proposal

## Out of Scope — Redirect These

- Anything unrelated to EcoQuest (other projects, general coding questions, etc.)
- Backend or database implementation unless directly tied to the site's static content
- Native mobile app development
- Modifying the academic proposal document itself
