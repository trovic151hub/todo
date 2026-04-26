# Tendril

Tendril is a calmer, dashboard-style productivity app built on React + Firebase. It started as a basic todo app and was rebranded with a periwinkle palette, warm off-white background, and a sidebar / hero / cards layout inspired by modern productivity tools.

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **Auth & Database**: Firebase 12 (Google Auth, Firestore)
- **Routing**: React Router DOM 7
- **Styling**: Plain CSS (no Tailwind in main app)
- **Icons**: lucide-react

## Brand

- Accent (periwinkle): `#8B8FE8` · deep `#5A5FCF` · soft `#E8E9FB`
- Background: warm off-white `#F7F5F0`
- Type: Plus Jakarta Sans (display) + Inter (UI), loaded via CSS `@import` in `src/styles.css`
- Logomark: `Leaf` icon from lucide

## Project Structure

```
src/
  components/
    Auth.jsx       - Tendril sign-in / register card
    Sidebar.jsx    - Brand, Quick add, Workspace nav, Categories, Settings, User
    TopBar.jsx     - Search, date, notifications, avatar
    HeroBand.jsx   - "Today's focus" headline + week strip
    TodoApp.jsx    - Main shell wiring (Firestore, filters, stats, density)
    TodoInput.jsx  - New task input
    TodoList.jsx   - Task list (drag/swipe/select preserved)
    TodoItem.jsx   - Individual task row
    Confetti.jsx   - Celebration animation on full clear
    Header.jsx     - (legacy, no longer imported)
    Footer.jsx     - (legacy, no longer imported)
    StatsPanel.jsx - (legacy, no longer imported)
  context/
    ToastContext.jsx
  firebase.js      - Firebase init (auth, db, provider)
  taskColors.js    - Shared task color swatches
  styles.css       - Rebranded base + appended `tendril-*` shell styles
  App.jsx          - Root component
  main.jsx         - Entry point
```

## Layout

The signed-in app renders inside `.tendril-app > .tendril-shell` with two columns:

- **Left**: `.tendril-sidebar` — brand, Quick add button, Workspace nav (Today/Active/Completed/Due today), Categories list, Settings (theme/density/notifications), User card.
- **Right**: `.tendril-main` containing `TopBar`, `HeroBand`, a `.tendril-stats` row of 4 cards (Due today / Overdue / High priority / Completed), and a `.tendril-cards-grid` (2/3 Tasks card with TodoInput + filters + TodoList + 1/3 Categories breakdown card).

All existing functionality is preserved: Firebase auth, Firestore CRUD with realtime sync, dark mode, density (compact/comfortable/spacious), due-date browser notifications, recurring tasks, subtasks, swipe gestures, manual drag reordering, color tags, priorities, bulk select, confetti.

## Running the App

```
npm run dev
```

Runs on port 5000 at `0.0.0.0`.

## Firebase Config

Firebase credentials are hardcoded in `src/firebase.js`. The project uses:
- Firebase Auth (Google + Email/Password)
- Firestore database (collection `todos`, scoped by `uid`)

## Canvas Mockups

Reference mockups live in the canvas:
- **Organizo Dashboard** at (180, -540) — original inspiration reference
- **Tendril Dashboard** at (1560, -540) — design target the main app now matches

## Notes

- `base` in `vite.config.js` is set to `/` for Replit (originally `todo` for GitHub Pages)
- Browser fonts are loaded via CSS `@import` in `src/styles.css`; no `<link>` tags in `index.html`
- Vercel deployment config exists in `vercel.json` (not used on Replit)
