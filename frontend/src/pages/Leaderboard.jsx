import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchLeaderboard = async () => {
    try {
      const { data } = await API.get("/submissions/leaderboard");
      setUsers(data);
    } catch (error) {
      alert("Failed to load leaderboard");
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain</h2>
        <div>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/submissions")}>Submissions</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
      </nav>

      <section className="content">
        <h1>Global Leaderboard</h1>
        <p>Ranking the top developers solving algorithmic challenges.</p>

        <div className="problem-table">
          <div className="table-head leaderboard-head">
            <span>RANK</span>
            <span>USER</span>
            <span>PROBLEMS</span>
            <span>TOKENS EARNED</span>
            <span>BADGE</span>
          </div>

          {users.map((user, index) => (
            <div className="table-row leaderboard-row" key={user._id}>
              <span className="rank">#{index + 1}</span>

              <span>
                <b>{user.name}</b>
                <small>{user.walletAddress || "Wallet not connected"}</small>
              </span>

              <span>{user.problemsSolved}</span>
              <span>{user.tokens} CC</span>

              <span className="badge easy">
                {index === 0 ? "GOLD" : index === 1 ? "SILVER" : "BRONZE"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Leaderboard;