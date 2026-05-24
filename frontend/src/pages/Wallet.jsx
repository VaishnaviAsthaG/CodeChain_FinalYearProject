// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/api";
// import "../index.css";

// function Wallet() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [connecting, setConnecting] = useState(false);

//   const fetchProfile = async () => {
//     try {
//       const { data } = await API.get("/auth/profile");
//       setUser(data);
//     } catch (error) {
//       navigate("/login");
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const connectWallet = async () => {
//     try {
//       if (!window.ethereum) {
//         alert("MetaMask not installed. Please install MetaMask extension.");
//         return;
//       }

//       setConnecting(true);

//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       const walletAddress = accounts[0];

//       const { data } = await API.put("/auth/connect-wallet", {
//         walletAddress,
//       });

//       setUser(data.user);
//       alert("Wallet connected successfully");
//     } catch (error) {
//       alert(error.response?.data?.message || "Wallet connection failed");
//     } finally {
//       setConnecting(false);
//     }
//   };

//   if (!user) return <div className="page">Loading...</div>;

//   return (
//     <div className="page">
//       <nav className="app-nav">
//         <h2>✦ CodeChain</h2>
//         <div>
//           <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//           <button onClick={() => navigate("/problems")}>Problems</button>
//           <button onClick={() => navigate("/submissions")}>Submissions</button>
//           <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
//         </div>
//       </nav>

//       <section className="wallet-content">
//         <h1>Wallet Management</h1>
//         <p>Manage your CCT tokens, track learning rewards, and view blockchain history.</p>

//         <div className="wallet-grid">
//           <div className="wallet-card">
//             <div className="wallet-icon">▣</div>

//             <div>
//               <p className="active-wallet">ACTIVE WALLET</p>

//               <h2>
//                 {user.walletAddress
//                   ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
//                   : "Not Connected"}
//               </h2>

//               <p className="muted-text">
//                 {user.walletAddress
//                   ? "Connected to MetaMask wallet"
//                   : "Connect your MetaMask wallet to receive rewards"}
//               </p>

//               <div className="wallet-stats">
//                 <div>
//                   <span>CCT BALANCE</span>
//                   <h3>{user.tokens} CCT</h3>
//                 </div>

//                 <div>
//                   <span>NETWORK</span>
//                   <h3>Sepolia</h3>
//                 </div>
//               </div>

//               <button className="connect-wallet-btn" onClick={connectWallet}>
//                 {connecting
//                   ? "Connecting..."
//                   : user.walletAddress
//                   ? "Change Wallet"
//                   : "Connect Wallet"}
//               </button>
//             </div>
//           </div>

//           <div className="earning-card">
//             <h2>Earnings Stat</h2>
//             <p>Minted this session</p>
//             <h1>{user.tokens} CCT</h1>
//             <div className="progress-bar">
//               <span style={{ width: `${Math.min(user.tokens, 100)}%` }}></span>
//             </div>
//           </div>
//         </div>

//         <h2 className="transaction-title">Transaction Log</h2>

//         <div className="problem-table">
//           <div className="table-head wallet-head">
//             <span>ACTION</span>
//             <span>STATUS</span>
//             <span>AMOUNT</span>
//             <span>NETWORK</span>
//           </div>

//           <div className="table-row wallet-row">
//             <span>Mint CCT</span>
//             <span className="pass">Verified</span>
//             <span>{user.tokens} CCT</span>
//             <span>Sepolia Testnet</span>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Wallet;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Wallet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [network, setNetwork] = useState("");

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
    getNetwork();
  }, []);

  const getNetwork = async () => {
    if (!window.ethereum) return;

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId === "0x13882") {
      setNetwork("Polygon Amoy");
    } else {
      setNetwork("Wrong Network");
    }
  };

  const switchToAmoy = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }],
      });

      setNetwork("Polygon Amoy");
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13882",
              chainName: "Polygon Amoy",
              nativeCurrency: {
                name: "POL",
                symbol: "POL",
                decimals: 18,
              },
              rpcUrls: ["https://rpc-amoy.polygon.technology"],
              blockExplorerUrls: ["https://amoy.polygonscan.com/"],
            },
          ],
        });

        setNetwork("Polygon Amoy");
      } else {
        alert("Failed to switch network");
      }
    }
  };

  // const connectWallet = async () => {
  //   try {
  //     if (!window.ethereum) {
  //       alert("MetaMask extension install karo pehle");
  //       return;
  //     }

  //     setConnecting(true);

  //     await switchToAmoy();

  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });

  //     const walletAddress = accounts[0];

  //     const { data } = await API.put("/auth/connect-wallet", {
  //       walletAddress,
  //     });

  //     setUser(data.user);
  //     setNetwork("Polygon Amoy");

  //     alert("MetaMask wallet connected successfully");
  //   } catch (error) {
  //     alert(error.response?.data?.message || "Wallet connection failed");
  //   } finally {
  //     setConnecting(false);
  //   }
  // };

  const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask extension install karo pehle");
      return;
    }

    setConnecting(true);

    await switchToAmoy();

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const walletAddress = accounts[0];

    const { data } = await API.put("/auth/connect-wallet", {
      walletAddress,
    });

    setUser(data.user);
    setNetwork("Polygon Amoy");

    // AUTO IMPORT CCT TOKEN
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0x9F57DE181D0eB74f89932E0D8d5A6BdACaeC6A05",
          symbol: "CCT",
          decimals: 18,
        },
      },
    });

    alert("MetaMask wallet connected successfully");
  } catch (error) {
    alert(error.response?.data?.message || "Wallet connection failed");
  } finally {
    setConnecting(false);
  }
};

  const disconnectWallet = async () => {
    try {
      const { data } = await API.put("/auth/connect-wallet", {
        walletAddress: "",
      });

      setUser(data.user);
      alert("Wallet disconnected");
    } catch (error) {
      alert("Failed to disconnect wallet");
    }
  };

  if (!user) return <div className="page">Loading...</div>;

  const shortAddress = user.walletAddress
    ? `${user.walletAddress.slice(0, 8)}...${user.walletAddress.slice(-6)}`
    : "Not Connected";

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
        <div className="wallet-header">
          <div>
            <h1>Wallet Management</h1>
            <p>Connect MetaMask wallet to receive CCT rewards.</p>
          </div>

          <span className={network === "Polygon Amoy" ? "network-ok" : "network-bad"}>
            {network || "Network Not Connected"}
          </span>
        </div>

        <div className="wallet-main-card">
          <div className="wallet-visual">
            <div className="wallet-circle">🦊</div>
            <h2>MetaMask Wallet</h2>
            <p>Polygon Amoy Testnet</p>
          </div>

          <div className="wallet-info">
            <p className="label-text">CONNECTED ADDRESS</p>
            <h2>{shortAddress}</h2>

            <div className="wallet-info-grid">
              <div>
                <span>CCT BALANCE</span>
                <h3>{user.tokens} CCT</h3>
              </div>

              <div>
                <span>PROBLEMS SOLVED</span>
                <h3>{user.problemsSolved}</h3>
              </div>

              <div>
                <span>NETWORK</span>
                <h3>{network || "Not Connected"}</h3>
              </div>
            </div>

            {!user.walletAddress ? (
              <button className="connect-wallet-btn" onClick={connectWallet}>
                {connecting ? "Connecting..." : "Connect MetaMask"}
              </button>
            ) : (
              <div className="wallet-btn-row">
                <button className="connect-wallet-btn" onClick={connectWallet}>
                  Change Wallet
                </button>
                <button className="disconnect-btn" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="wallet-note">
          <h3>How reward will work?</h3>
          <p>
            After wallet connection, whenever your solution is accepted, CodeChain will transfer
            CCT tokens to this MetaMask wallet on Polygon Amoy network.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Wallet;