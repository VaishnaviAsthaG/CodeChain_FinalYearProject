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

const [solvedIds, setSolvedIds] = useState([]);

const fetchSolvedProblems = async () => {
  try {
    const { data } = await API.get("/submissions/my");

    const acceptedProblemIds = data
      .filter((item) => item.verdict === "Accepted")
      .map((item) => item.problem?._id);

    setSolvedIds(acceptedProblemIds);
  } catch (error) {
    console.log(error);
  }
};
  

 useEffect(() => {
  fetchProblems();
  fetchSolvedProblems();
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

          {problems.map((problem) => {
  const isSolved = solvedIds.includes(problem._id);

  return (
    <div className="table-row" key={problem._id}>
      <span className={isSolved ? "solved-status" : "unsolved-status"}>
        {isSolved ? "✓" : "○"}
      </span>

      <span>
        <b>{problem.title}</b>
        <small>{problem.description.slice(0, 45)}...</small>
      </span>

      <span className={`badge ${problem.difficulty.toLowerCase()}`}>
        {problem.difficulty}
      </span>

      <span>{problem.reward} CCT</span>

      <button onClick={() => navigate(`/problems/${problem._id}`)}>
        {isSolved ? "View / Retry" : "▷ Solve"}
      </button>
    </div>
  );
})}
        </div>
      </section>
    </div>
  );
}

export default Problems;