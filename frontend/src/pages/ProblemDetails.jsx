import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fetchProblem = async () => {
    try {
      const { data } = await API.get(`/problems/${id}`);
      setProblem(data);
    } catch (error) {
      alert("Problem not found");
    }
  };

  useEffect(() => {
    fetchProblem();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);

    //   const { data } = await API.post("/submissions", {
    //     problemId: id,
    //     code,
    //   });
    const { data } = await API.post("/submissions/submit", {
  problemId: id,
  code,
  language: "javascript",
});

      setResult(data);
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div className="page">Loading...</div>;

  return (
    <div className="problem-page">
      <nav className="app-nav">
        <h2>✦ CodeChain</h2>

        <div>
          <button onClick={() => navigate("/problems")}>
            Back
          </button>
        </div>
      </nav>

      <div className="problem-layout">
        {/* LEFT */}
        <div className="problem-left">
          <h1>{problem.title}</h1>

          <span
            className={`badge ${problem.difficulty.toLowerCase()}`}
          >
            {problem.difficulty}
          </span>

          <p className="problem-description">
            {problem.description}
          </p>

          <div className="example-box">
            <h3>Input Example</h3>
            <code>{problem.inputExample}</code>
          </div>

          <div className="example-box">
            <h3>Output Example</h3>
            <code>{problem.outputExample}</code>
          </div>

          <div className="example-box">
            <h3>Expected Output</h3>
            <code>{problem.expectedOutput}</code>
          </div>
        </div>

        {/* RIGHT */}
        <div className="problem-right">
          <div className="editor-header">
            <span>Python</span>
          </div>

          <textarea
            placeholder="Write your solution here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Solution"}
          </button>

          {result && (
            <div
              className={
                result.verdict === "Accepted"
                  ? "success-box"
                  : "fail-box"
              }
            >
             <h2>{result.verdict}</h2>
<p>{result.message}</p>
<h3>{result.rewardGiven} CCT Earned</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetails;