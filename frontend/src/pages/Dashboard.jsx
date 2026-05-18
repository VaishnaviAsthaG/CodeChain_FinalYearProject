import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/profile");
      setUser(data);
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain</h2>
        <div>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/submissions")}>Submissions</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={() => navigate("/wallet")}>Wallet</button>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <section className="dashboard-content">
        <div className="welcome-box">
          <h1>Welcome back, {user.name}</h1>
          <p>Continue solving DSA problems and earn blockchain rewards.</p>
          <button onClick={() => navigate("/problems")}>Start Solving →</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Tokens</p>
            <h2>{user.tokens} CC</h2>
          </div>

          <div className="stat-card">
            <p>Problems Solved</p>
            <h2>{user.problemsSolved}</h2>
          </div>

          <div className="stat-card">
            <p>Wallet</p>
            <h2>{user.walletAddress ? "Connected" : "Not Connected"}</h2>
          </div>

          <div className="stat-card">
            <p>Network</p>
            <h2>Sepolia</h2>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;