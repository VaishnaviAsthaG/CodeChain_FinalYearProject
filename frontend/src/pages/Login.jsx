import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";

      const { data } = await API.post(endpoint, form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(isSignup ? "Signup successful" : "Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
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

        <button className="wallet-btn">SIGN UP WITH GOOGLE</button>

        <div className="divider">
          <span></span>
          <p>OR EMAIL</p>
          <span></span>
        </div>

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
            <a>Forgot?</a>
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