import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Wallet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [connecting, setConnecting] = useState(false);

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

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed. Please install MetaMask extension.");
        return;
      }

      setConnecting(true);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];

      const { data } = await API.put("/auth/connect-wallet", {
        walletAddress,
      });

      setUser(data.user);
      alert("Wallet connected successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Wallet connection failed");
    } finally {
      setConnecting(false);
    }
  };

  if (!user) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>✦ CodeChain</h2>
        <div>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/submissions")}>Submissions</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
        </div>
      </nav>

      <section className="wallet-content">
        <h1>Wallet Management</h1>
        <p>Manage your CC tokens, track learning rewards, and view blockchain history.</p>

        <div className="wallet-grid">
          <div className="wallet-card">
            <div className="wallet-icon">▣</div>

            <div>
              <p className="active-wallet">ACTIVE WALLET</p>

              <h2>
                {user.walletAddress
                  ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
                  : "Not Connected"}
              </h2>

              <p className="muted-text">
                {user.walletAddress
                  ? "Connected to MetaMask wallet"
                  : "Connect your MetaMask wallet to receive rewards"}
              </p>

              <div className="wallet-stats">
                <div>
                  <span>CC BALANCE</span>
                  <h3>{user.tokens} CC</h3>
                </div>

                <div>
                  <span>NETWORK</span>
                  <h3>Sepolia</h3>
                </div>
              </div>

              <button className="connect-wallet-btn" onClick={connectWallet}>
                {connecting
                  ? "Connecting..."
                  : user.walletAddress
                  ? "Change Wallet"
                  : "Connect Wallet"}
              </button>
            </div>
          </div>

          <div className="earning-card">
            <h2>Earnings Stat</h2>
            <p>Minted this session</p>
            <h1>{user.tokens} CC</h1>
            <div className="progress-bar">
              <span style={{ width: `${Math.min(user.tokens, 100)}%` }}></span>
            </div>
          </div>
        </div>

        <h2 className="transaction-title">Transaction Log</h2>

        <div className="problem-table">
          <div className="table-head wallet-head">
            <span>ACTION</span>
            <span>STATUS</span>
            <span>AMOUNT</span>
            <span>NETWORK</span>
          </div>

          <div className="table-row wallet-row">
            <span>Mint CC</span>
            <span className="pass">Verified</span>
            <span>{user.tokens} CC</span>
            <span>Sepolia Testnet</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wallet;