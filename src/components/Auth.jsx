// src/components/Auth.jsx
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { auth, provider } from "../firebase";
import { Eye, EyeOff } from "lucide-react";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Fill all fields!");
    setLoading(true);
    setError("");

    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLoginMode ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper" style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Please wait..." : isLoginMode ? "Login" : "Sign Up"}
          </button>

          <div className={`divider ${isLoginMode ? "active" : ""}`}>OR</div>

          <button
            type="button"
            className="btn google"
            onClick={handleGoogleLogin}
            style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
          >
            <img
              src="https://s3-alpha.figma.com/hub/file/6055265191/97a0b7ac-13bb-4f59-986e-8c3e960435fd-cover.png"
              alt="Google"
              style={{ width: "30px", height: "18px" }}
            />
            Continue with Google
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <p className="switch-text">
          {isLoginMode ? "No account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
