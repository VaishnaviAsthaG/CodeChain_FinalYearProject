import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
  setMessage("Email and password are required");
setMessageType("error");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(form.email)) {
  setMessage("Please enter a valid email address");
setMessageType("error");
  return;
}

if (isSignup && !form.name.trim()) {
  setMessage("Name is required");
setMessageType("error");
  return;
}

if (form.password.length < 6) {
  setMessage("Password must be at least 6 characters long");
setMessageType("error");
  return;
}

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";

      const { data } = await API.post(endpoint, form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage(isSignup ? "Signup successful" : "Login successful");
setMessageType("success");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
  try {
    setMessage("");
    setMessageType("");

    const result = await signInWithPopup(auth, googleProvider);

    const googleUser = result.user;

    const { data } = await API.post("/auth/google-login", {
      name: googleUser.displayName,
      email: googleUser.email,
      photoURL: googleUser.photoURL,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setMessage("Google login successful");
    setMessageType("success");

    navigate("/dashboard");
  } catch (error) {
    console.log(error);
    setMessage("Google login failed");
    setMessageType("error");
  }
};

  return (
    <div className="login-page">
      <nav className="top-nav">
        <div className="brand">✦ CodeChain</div>
        <div className="nav-links">
          <span>Algorithms</span>
          <span>Data Structures</span>
          <span>Community</span>
          <span>Docs</span>
        </div>
      </nav>

      <div className="login-card">
        <div className="login-icon">▣</div>

        <h1>{isSignup ? "Create Account" : "Welcome back"}</h1>
        <p>Master DSA on the decentralized web</p>

        <button
  type="button"
  className="wallet-btn"
  onClick={handleGoogleLogin}
>
  SIGN IN WITH GOOGLE
</button>

        <div className="divider">
          <span></span>
          <p>OR EMAIL</p>
          <span></span>
        </div>

      {message && (
  <div className={`auth-message ${messageType}`}>
    {message}
  </div>
)}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </>
          )}

          <label>EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>PASSWORD</label>
          <input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="remember">
            <span>
              <input type="checkbox" /> Keep me logged in
            </span>
            <a onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
          </div>

          <button type="submit" className="signin-btn">
            {isSignup ? "Sign Up" : "Sign In"} →
          </button>
        </form>

        <p className="switch-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Sign in" : "Sign up for free"}
          </button>
        </p>
      </div>

      <footer>© 2024 CodeChain. Secured by Decentralized Identity protocols.</footer>
    </div>
  );
}

export default Login;