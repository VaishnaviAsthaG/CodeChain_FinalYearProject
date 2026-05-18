import { useNavigate } from "react-router-dom";
import "../index.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <h2>✦ CodeChain</h2>

        <div>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
          <button onClick={() => navigate("/login")} className="login-nav-btn">
            Sign In
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-left">
          <span className="hero-badge">WEB3 DSA LEARNING PLATFORM</span>

          <h1>
            Master DSA. <br />
            Solve Problems. <br />
            Earn CCT Tokens.
          </h1>

          <p>
            CodeChain is a blockchain-powered coding platform where students solve
            Data Structures and Algorithms problems and earn token rewards for
            correct submissions.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/login")} className="primary-btn">
              Start Solving →
            </button>

            <button onClick={() => navigate("/problems")} className="secondary-btn">
              Explore Problems
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <h3>50+</h3>
              <span>DSA Problems</span>
            </div>

            <div>
              <h3>CCT</h3>
              <span>Reward Token</span>
            </div>

            <div>
              <h3>Web3</h3>
              <span>MetaMask Wallet</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="code-preview-card">
            <div className="code-card-header">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <pre>{`function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    let diff = target - nums[i];

    if (map.has(diff)) {
      return [map.get(diff), i];
    }

    map.set(nums[i], i);
  }
}

console.log("[0,1]");`}</pre>
          </div>

          <div className="reward-floating-card">
            <h3>✅ Accepted</h3>
            <p>Reward Minted</p>
            <h2>+50 CCT</h2>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Practice DSA</h3>
          <p>Solve problems based on arrays, strings, trees, graphs and more.</p>
        </div>

        <div className="feature-card">
          <h3>Earn Rewards</h3>
          <p>Get CCT tokens after successful problem submissions.</p>
        </div>

        <div className="feature-card">
          <h3>Track Progress</h3>
          <p>View dashboard, leaderboard, wallet balance and submissions.</p>
        </div>
      </section>
    </div>
  );
}

export default Landing;