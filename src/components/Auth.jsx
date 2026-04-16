import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, CheckSquare } from "lucide-react";
import { useToast } from "../context/ToastContext";

const parseError = (code) => {
  const map = {
    "auth/user-not-found":         "No account found with this email.",
    "auth/wrong-password":         "Incorrect password.",
    "auth/invalid-credential":     "Incorrect email or password.",
    "auth/email-already-in-use":   "This email is already registered.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/too-many-requests":      "Too many attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/popup-closed-by-user":   "Sign-in was cancelled.",
    "auth/unauthorized-domain":    "This domain isn't authorised. Add it in the Firebase Console.",
  };
  return map[code] || "Something went wrong. Please try again.";
};

export default function Auth() {
  const { addToast } = useToast();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    if (!isLoginMode && password.length < 6)
      return setError("Password must be at least 6 characters.");

    setLoading(true);
    setError("");
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
        addToast("Welcome back!", "success");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        addToast("Account created! Welcome.", "success");
      }
    } catch (err) {
      setError(parseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
      addToast("Signed in with Google!", "success");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(parseError(err.code));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <CheckSquare size={32} strokeWidth={2} />
        </div>
        <h2>{isLoginMode ? "Welcome back" : "Create account"}</h2>
        <p className="auth-subtitle">
          {isLoginMode ? "Sign in to your tasks" : "Get organised today"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-wrapper password-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLoginMode ? "current-password" : "new-password"}
              required
            />
            <button
              type="button"
              className="eye-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary auth-submit" disabled={loading}>
            {loading ? (
              <span className="spinner-sm" />
            ) : isLoginMode ? (
              <><LogIn size={16} /> Sign in</>
            ) : (
              <><UserPlus size={16} /> Create account</>
            )}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          type="button"
          className="btn google"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width="18"
            height="18"
          />
          Continue with Google
        </button>

        <p className="switch-text">
          {isLoginMode ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => { setIsLoginMode(!isLoginMode); setError(""); }}
          >
            {isLoginMode ? "Register" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
