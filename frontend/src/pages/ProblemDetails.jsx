import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function ProblemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);

const starterCodes = {
  javascript: `console.log("[0,1]");`,
  python: `print("[0,1]")`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "[0,1]";
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("[0,1]");
    }
}`
};

const [code, setCode] = useState(starterCodes.javascript);
const [language, setLanguage] = useState("javascript");
const [output, setOutput] = useState("");
const [running, setRunning] = useState(false);
const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
const [processingStep, setProcessingStep] = useState(1);

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

//   useEffect(() => {
//   const timer = setInterval(() => {
//     setSeconds((prev) => prev + 1);
//   }, 1000);

//   return () => clearInterval(timer);
// }, []);

useEffect(() => {
  let timer;

  if (timerActive) {
    timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  }

  return () => clearInterval(timer);
}, [timerActive]);

// const handleRun = async () => {
//   try {
//     setRunning(true);

//     // temporary fake output
//     setTimeout(() => {
//       setOutput("Code executed successfully");
//       setRunning(false);
//     }, 1200);

//   } catch (error) {
//     setOutput("Execution failed");
//     setRunning(false);
//   }
// };

const handleRun = async () => {
  try {
    setRunning(true);
    setOutput("");
    setSeconds(0);
    setTimerActive(true);

    const { data } = await API.post("/submissions/run", {
      code,
      language,
      stdin: "",
    });

    if (data.error) {
      setOutput(data.error);
    } else {
      setOutput(data.output || "No output");
    }
  } catch (error) {
    setOutput(error.response?.data?.message || "Execution failed");
  } finally {
    setRunning(false);
    setTimerActive(false);
  }
};

const handleLanguageChange = (e) => {
  const selectedLanguage = e.target.value;

  setLanguage(selectedLanguage);
  setCode(starterCodes[selectedLanguage]);
};

//   const handleSubmit = async () => {
//     setShowProcessing(true);
// setProcessingStep(1);
//     try {
//       setLoading(true);

//     //   const { data } = await API.post("/submissions", {
//     //     problemId: id,
//     //     code,
//     //   });
//     setTimeout(() => {
//   setProcessingStep(2);
// }, 1200);

// setTimeout(() => {
//   setProcessingStep(3);
// }, 2500);
//     const { data } = await API.post("/submissions/submit", {
//   problemId: id,
//   code,
//   language,
// });

//       setResult(data);
//     } catch (error) {
//       alert(error.response?.data?.message || "Submission failed");
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSubmit = async () => {
  try {
    setLoading(true);
    setResult(null);

    setShowProcessing(true);
    setProcessingStep(1);

    setSeconds(0);
    setTimerActive(true);

    setTimeout(() => {
      setProcessingStep(2);
    }, 1200);

    setTimeout(() => {
      setProcessingStep(3);
    }, 2500);

    const { data } = await API.post("/submissions/submit", {
      problemId: id,
      code,
      language,
    });

    setResult(data);

    setTimeout(() => {
      setShowProcessing(false);
    }, 1200);
  } catch (error) {
    setShowProcessing(false);
    alert(error.response?.data?.message || "Submission failed");
  } finally {
    setLoading(false);
    setTimerActive(false);
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
          {/* <div className="editor-header">
            <span>Python</span>
          </div> */}

          <div className="editor-header">
  <div className="editor-left">
    <select
      value={language}
      onChange={handleLanguageChange}
    >
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="cpp">C++</option>
      <option value="java">Java</option>
    </select>

    <span className="timer-box">
      ⏱ {seconds}s
    </span>
  </div>

  <div className="editor-right">
    <button className="run-btn" onClick={handleRun}>
      {running ? "Running..." : "Run Code"}
    </button>
  </div>
</div>

{/* <div className="language-bar">

  <label>Language</label>

  <select
    value={language}
    onChange={handleLanguageChange}
  >
    <option value="javascript">JavaScript</option>
    <option value="python">Python</option>
    <option value="cpp">C++</option>
    <option value="java">Java</option>
  </select>

</div> */}

          <textarea
            placeholder="Write your solution here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="output-box">
  <h3>Output Console</h3>

  <pre>
    {output || "Run your code to see output"}
  </pre>
</div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Solution"}
          </button>

          {/* {result && (
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
            {showProcessing && (
  <div className="processing-overlay">

    <div className="processing-card">

      <div className="rocket-circle">
        🚀
      </div>

      <h1>Processing Submission</h1>

      <p>
        Deploying your solution to the decentralized judge...
      </p>

      <div className="process-list">

        <div className={`process-item ${processingStep >= 1 ? "active" : ""}`}>
          <span>✓</span>

          <div>
            <h4>Compiling Code...</h4>
            <small>Target: LLVM WebAssembly VM</small>
          </div>
        </div>

        <div className={`process-item ${processingStep >= 2 ? "active" : ""}`}>
          <span>{"</>"}</span>

          <div>
            <h4>Running Test Cases...</h4>

            {processingStep >= 2 && (
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            )}
          </div>
        </div>

        <div className={`process-item ${processingStep >= 3 ? "active" : ""}`}>
          <span>⬢</span>

          <div>
            <h4>Minting Reward Token...</h4>
            <small>Waiting for blockchain confirmation...</small>
          </div>
        </div>

      </div>

      <div className="pro-tip">
        💡 PRO TIP
      </div>

      <p className="tip-text">
        Use optimal time complexity solutions for faster execution.
      </p>

    </div>

  </div>
)} */}
{result && result.verdict === "Accepted" && (
  <div className="success-result-card">
    <div className="success-top">
      <div className="success-icon">✓</div>
      <h1>All Test Cases Passed</h1>
      <p>Submission successfully verified on-chain</p>
    </div>

    <div className="success-bottom">
      <p className="reward-label">REWARD CLAIMED</p>
      <h2>
  {result.rewardGiven > 0
    ? `${result.rewardGiven} CCT Minted`
    : "Reward Already Claimed"}
</h2>
<p>{result.message}</p>

      {result.txHash && (
        <div className="tx-box">
          <span>TRANSACTION HASH</span>
          <p>
            {result.txHash.slice(0, 12)}...
            {result.txHash.slice(-8)}
          </p>
        </div>
      )}

      <div className="success-actions">
        {result.txHash && (
          <a
            href={`https://amoy.polygonscan.com/tx/${result.txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            View on PolygonScan
          </a>
        )}

        <button onClick={() => navigate("/problems")}>
          Next Problem →
        </button>
      </div>
    </div>
  </div>
)}

{result && result.verdict !== "Accepted" && (
  <div className="wrong-result-card">
    <h1>Wrong Answer</h1>
    <p>{result.message}</p>

    <div className="diff-grid">
      <div>
        <span>EXPECTED OUTPUT</span>
        <h3>{result.expectedOutput || problem.expectedOutput}</h3>
      </div>

      <div>
        <span>YOUR OUTPUT</span>
        <h3>{result.output || output || "Incorrect Output"}</h3>
      </div>
    </div>

    <button onClick={() => setResult(null)}>Try Again</button>
  </div>
)}

{showProcessing && (
  <div className="processing-overlay">
    <div className="processing-card">
      <div className="rocket-circle">🚀</div>

      <h1>Processing Submission</h1>

      <p>Deploying your solution to the decentralized judge...</p>

      <div className="process-list">
        <div className={`process-item ${processingStep >= 1 ? "active" : ""}`}>
          <span>✓</span>

          <div>
            <h4>Compiling Code...</h4>
            <small>Target: LLVM WebAssembly VM</small>
          </div>
        </div>

        <div className={`process-item ${processingStep >= 2 ? "active" : ""}`}>
          <span>{"</>"}</span>

          <div>
            <h4>Running Test Cases...</h4>

            {processingStep >= 2 && (
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            )}
          </div>
        </div>

        <div className={`process-item ${processingStep >= 3 ? "active" : ""}`}>
          <span>⬢</span>

          <div>
            <h4>Minting Reward Token...</h4>
            <small>Waiting for blockchain confirmation...</small>
          </div>
        </div>
      </div>

      <div className="pro-tip">💡 PRO TIP</div>

      <p className="tip-text">
        Use optimal time complexity solutions for faster execution.
      </p>
    </div>
  </div>
)}
          
        </div>
      </div>
    </div>
  );
}


export default ProblemDetails;