import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Admin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    inputExample: "",
    outputExample: "",
    expectedOutput: "",
    reward: 50,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/problems/add", form);

      alert("Problem added successfully");

      setForm({
        title: "",
        description: "",
        difficulty: "Easy",
        inputExample: "",
        outputExample: "",
        expectedOutput: "",
        reward: 50,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add problem");
    }
  };

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain Admin</h2>
        <div>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/problems")}>Problems</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
        </div>
      </nav>

      <section className="admin-content">
        <h1>Admin Control Panel</h1>
        <p>Add new DSA problems for CodeChain users.</p>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>Problem Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Example: Binary Search"
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write problem statement..."
            required
          />

          <div className="form-grid">
            <div>
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label>Reward</label>
              <input
                type="number"
                name="reward"
                value={form.reward}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Input Example</label>
          <input
            name="inputExample"
            value={form.inputExample}
            onChange={handleChange}
            placeholder="Example: nums = [2,7,11,15], target = 9"
            required
          />

          <label>Output Example</label>
          <input
            name="outputExample"
            value={form.outputExample}
            onChange={handleChange}
            placeholder="Example: [0,1]"
            required
          />

          <label>Expected Output</label>
          <input
            name="expectedOutput"
            value={form.expectedOutput}
            onChange={handleChange}
            placeholder="Example: [0,1]"
            required
          />

          <button type="submit" className="admin-submit-btn">
            Add Problem
          </button>
        </form>
      </section>
    </div>
  );
}

export default Admin;