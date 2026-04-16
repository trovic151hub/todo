# Todo App

A React + Firebase todo application with Google Authentication and Firestore for data persistence.

## Tech Stack

- **Frontend**: React 19 + Vite 7
- **Auth & Database**: Firebase 12 (Google Auth, Firestore)
- **Routing**: React Router DOM 7
- **Styling**: Plain CSS

## Project Structure

```
src/
  components/
    Auth.jsx       - Google sign-in UI
    Header.jsx     - Navigation header
    Footer.jsx     - Page footer
    TodoApp.jsx    - Main todo container
    TodoInput.jsx  - New task input
    TodoList.jsx   - Task list
    TodoItem.jsx   - Individual task
  firebase.js      - Firebase init (auth, db, provider)
  App.jsx          - Root component
  main.jsx         - Entry point
```

## Running the App

```
npm run dev
```

Runs on port 5000 at `0.0.0.0`.

## Firebase Config

Firebase credentials are hardcoded in `src/firebase.js`. The project uses:
- Firebase Auth (Google provider)
- Firestore database

## Notes

- `base` in `vite.config.js` is set to `/` for Replit (originally `todo` for GitHub Pages)
- `lucide-react` is installed as a dependency (used in Auth.jsx)
