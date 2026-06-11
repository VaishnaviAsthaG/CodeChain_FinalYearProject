// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/api";
// import "../index.css";

// function Dashboard() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const fetchProfile = async () => {
//     try {
//       const { data } = await API.get("/auth/profile");
//       setUser(data);
//     } catch (error) {
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   if (!user) return <div className="page">Loading...</div>;

//   return (
//     <div className="page">
//       <nav className="app-nav">
//         <h2>▣ CodeChain</h2>
//         <div>
//           <button onClick={() => navigate("/problems")}>Problems</button>
//           <button onClick={() => navigate("/submissions")}>Submissions</button>
//           <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
//           <button onClick={() => navigate("/wallet")}>Wallet</button>
//           <button onClick={logout}>Logout</button>
//         </div>
//       </nav>

//       <section className="dashboard-content">
//         <div className="welcome-box">
//           <h1>Welcome back, {user.name}</h1>
//           <p>Continue solving DSA problems and earn blockchain rewards.</p>
//           <button onClick={() => navigate("/problems")}>Start Solving →</button>
//         </div>

//         <div className="stats-grid">
//           <div className="stat-card">
//             <p>Total Tokens</p>
//             <h2>{user.tokens} CCT</h2>
//           </div>

//           <div className="stat-card">
//             <p>Problems Solved</p>
//             <h2>{user.problemsSolved}</h2>
//           </div>

//           <div className="stat-card">
//             <p>Wallet</p>
//             <h2>{user.walletAddress ? "Connected" : "Not Connected"}</h2>
//           </div>

//           <div className="stat-card">
//             <p>Network</p>
//             <h2>Sepolia</h2>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [rank, setRank] = useState("-");
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const profileRes = await API.get("/auth/profile");
      const submissionsRes = await API.get("/submissions/my");
      const leaderboardRes = await API.get("/submissions/leaderboard");

      const currentUser = profileRes.data;
      setUser(currentUser);
      setSubmissions(submissionsRes.data.slice(0, 5));

      const userRankIndex = leaderboardRes.data.findIndex(
        (item) => item._id === currentUser._id
      );

      setRank(userRankIndex >= 0 ? `#${userRankIndex + 1}` : "-");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div className="page">Loading...</div>;

  const acceptedCount = submissions.filter(
    (item) => item.verdict === "Accepted"
  ).length;

  const acceptanceRate =
    submissions.length > 0
      ? Math.round((acceptedCount / submissions.length) * 100)
      : 0;

  const shortWallet = user.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : "Not Connected";

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>✦ CodeChain</h2>

        <div>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/submissions")}>Submissions</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={() => navigate("/wallet")}>Wallet</button>
          <button onClick={() => navigate("/profile")}>
  Profile
</button>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <section className="dashboard-content">
        <div className="dashboard-hero">
          <div>
            <p className="dashboard-tag">WEB3 CODING DASHBOARD</p>
            <h1>Welcome back, {user.name}</h1>
            <p>
              Continue solving DSA challenges, pass hidden test cases, and earn
              CCT rewards on Polygon Amoy.
            </p>

            <div className="dashboard-actions">
              <button onClick={() => navigate("/problems")}>
                Start Solving →
              </button>

              <button className="secondary-action" onClick={() => navigate("/wallet")}>
                Manage Wallet
              </button>
            </div>
          </div>

          <div className="wallet-mini-card">
            <span>CONNECTED WALLET</span>
            <h3>{shortWallet}</h3>
            <p>{user.walletAddress ? "Polygon Amoy Active" : "Connect wallet to claim rewards"}</p>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          <div className="dashboard-stat-card">
            <span>Total Tokens</span>
            <h2>{user.tokens} CCT</h2>
            <p>Lifetime blockchain rewards</p>
          </div>

          <div className="dashboard-stat-card">
            <span>Problems Solved</span>
            <h2>{user.problemsSolved}</h2>
            <p>Accepted with reward claim</p>
          </div>

          <div className="dashboard-stat-card">
            <span>Current Rank</span>
            <h2>{rank}</h2>
            <p>Based on total CCT earned</p>
          </div>

          <div className="dashboard-stat-card">
            <span>Acceptance Rate</span>
            <h2>{acceptanceRate}%</h2>
            <p>From recent submissions</p>
          </div>

          <div className="dashboard-stat-card">
  <span>Current Streak</span>
  <h2>🔥 {user.currentStreak || 0}</h2>
  <p>Days in a row</p>
</div>

<div className="dashboard-stat-card">
  <span>Level</span>
  <h2>Lv. {user.level || 1}</h2>
  <p>{user.xp || 0} XP earned</p>
</div>

        </div>

        <div className="dashboard-main-grid">
          <div className="recent-card">
            <div className="section-title-row">
              <h2>Recent Activity</h2>
              <button onClick={() => navigate("/submissions")}>View All</button>
            </div>

            {submissions.length === 0 ? (
              <p className="empty-text">No submissions yet. Start solving your first problem.</p>
            ) : (
              submissions.map((item) => (
                <div className="recent-row" key={item._id}>
                  <div>
                    <h3>{item.problem?.title || "Problem"}</h3>
                    <p>{new Date(item.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="recent-right">
                    <span className={item.verdict === "Accepted" ? "pass" : "fail"}>
                      {item.verdict}
                    </span>
                    <strong>{item.rewardGiven} CCT</strong>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="progress-card">
            <h2>Learning Progress</h2>

            <div className="progress-circle">
              <span>{acceptanceRate}%</span>
            </div>

            <p>
              Your recent accepted submission rate. Keep solving problems to improve
              consistency and earn more CCT rewards.
            </p>

            <button onClick={() => navigate("/problems")}>
              Continue Practice
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;