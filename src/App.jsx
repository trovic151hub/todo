// src/App.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Auth from "./components/Auth";
import TodoApp from "./components/TodoApp";

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  if (!authChecked) return <div className="loading">Loading...</div>;

  return user ? <TodoApp user={user} /> : <Auth />;
}

export default App;
