import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/auth/profile");
      setUser(data);
    } catch (error) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  

  if (!user) return <div className="page">Loading...</div>;

const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const badges = [];

if (user.problemsSolved >= 1) {
  badges.push("🟢 Beginner Solver");
}

if (user.problemsSolved >= 5) {
  badges.push("🔵 Consistent Coder");
}

if (user.tokens >= 100) {
  badges.push("🟣 Token Earner");
}

if (user.walletAddress) {
  badges.push("🟡 Web3 Learner");
}

if (user.tokens >= 500) {
  badges.push("🏆 CodeChain Champion");
}

if (user.level >= 2) {
  badges.push("⚡ Level 2 Coder");
}

if (user.level >= 5) {
  badges.push("👑 Elite Coder");
}

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain</h2>

        <div>
          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/problems")}>
            Problems
          </button>

          <button onClick={() => navigate("/leaderboard")}>
            Leaderboard
          </button>
        </div>
      </nav>

      <section className="profile-page">
        <div className="profile-card">

          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h1>{user.name}</h1>

          <p>{user.email}</p>

          <div className="profile-stats">

            <div className="profile-stat">
              <span>Total Tokens</span>
              <h2>{user.tokens} CCT</h2>
            </div>

            <div className="profile-stat">
              <span>Problems Solved</span>
              <h2>{user.problemsSolved}</h2>
            </div>

<div className="profile-stat">
  <span>Current Streak</span>
  <h2>🔥 {user.currentStreak || 0} Days</h2>
</div>

<div className="profile-stat">
  <span>Longest Streak</span>
  <h2>🏆 {user.longestStreak || 0} Days</h2>
</div>

<div className="profile-stat">
  <span>Level</span>
  <h2>Lv. {user.level || 1}</h2>
</div>

<div className="profile-stat">
  <span>XP</span>
  <h2>{user.xp || 0}</h2>
</div>


          </div>

          <div className="wallet-section">
            <h3>Wallet Address</h3>

            <p>
              {user.walletAddress
                ? user.walletAddress
                : "Wallet Not Connected"}
            </p>
          </div>

          <div className="badges-section">
  <h3>Achievements</h3>

  <div className="badges-grid">
    {badges.map((badge, index) => (
      <div className="badge-card" key={index}>
        {badge}
      </div>
    ))}
  </div>
</div>

          <button
            className="logout-profile-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </section>
    </div>
  );
}

export default Profile;