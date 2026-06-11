import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    try {
      const { data } = await API.get("/submissions/my");
      setSubmissions(data);
    } catch (error) {
      alert("Failed to load submissions");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain</h2>
        <div>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        </div>
      </nav>

      <section className="content">
        <h1>Submission History</h1>
        <p>Track your decentralized DSA progress and verified rewards.</p>

        <div className="problem-table">
          <div className="table-head submission-head">
  <span>PROBLEM</span>
  <span>STATUS</span>
  <span>TOKENS</span>
  <span>LANGUAGE</span>
  <span>TX HASH</span>
  <span>DATE</span>
</div>

          {submissions.map((item) => (
            <div className="table-row submission-row" key={item._id}>
              <span>
                <b>{item.problem?.title}</b>
                <small>{item.problem?.difficulty}</small>
              </span>

              <span className={item.verdict === "Accepted" ? "pass" : "fail"}>
                {item.verdict === "Accepted" ? "● PASS" : "● FAIL"}
              </span>

              <span>{item.rewardGiven} CCT</span>

<span>{item.language}</span>

<span>
  {item.txHash ? (
    <a
      href={`https://amoy.polygonscan.com/tx/${item.txHash}`}
      target="_blank"
      rel="noreferrer"
      className="tx-link"
    >
      View Tx
    </a>
  ) : (
    "—"
  )}
</span>

<span>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SubmissionHistory;