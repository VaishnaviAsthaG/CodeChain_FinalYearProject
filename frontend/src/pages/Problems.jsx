import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Problems() {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      const { data } = await API.get("/problems");
      setProblems(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load problems");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain</h2>
        <div>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
        </div>
      </nav>

      <section className="content">
        <h1>Problem Set</h1>
        <p>Solve Data Structures and Algorithms challenges to earn CC tokens.</p>

        <div className="problem-table">
          <div className="table-head">
            <span>STATUS</span>
            <span>TITLE</span>
            <span>DIFFICULTY</span>
            <span>TOKENS REWARD</span>
            <span>ACTION</span>
          </div>

          {problems.map((problem) => (
            <div className="table-row" key={problem._id}>
              <span>○</span>

              <span>
                <b>{problem.title}</b>
                <small>{problem.description.slice(0, 45)}...</small>
              </span>

              <span className={`badge ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>

              <span>{problem.reward} CC</span>

              <button onClick={() => navigate(`/problems/${problem._id}`)}>
                ▷ Solve
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Problems;