import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";
import SubmissionHistory from "./pages/SubmissionHistory";
import Leaderboard from "./pages/Leaderboard";
import Wallet from "./pages/Wallet";
import Admin from "./pages/Admin";
import Landing from "./pages/LandingPage";

function App() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/submissions" element={<SubmissionHistory />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;