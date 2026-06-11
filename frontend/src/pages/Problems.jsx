// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/api";
// import "../index.css";

// function Problems() {
//   const [problems, setProblems] = useState([]);
//   const navigate = useNavigate();

//   const fetchProblems = async () => {
//     try {
//       const { data } = await API.get("/problems");
//       setProblems(data);
//     } catch (error) {
//       console.log(error);
//       alert("Failed to load problems");
//     }
//   };

// const [solvedIds, setSolvedIds] = useState([]);

// const fetchSolvedProblems = async () => {
//   try {
//     const { data } = await API.get("/submissions/my");

//     const acceptedProblemIds = data
//       .filter((item) => item.verdict === "Accepted")
//       .map((item) => item.problem?._id);

//     setSolvedIds(acceptedProblemIds);
//   } catch (error) {
//     console.log(error);
//   }
// };
  

//  useEffect(() => {
//   fetchProblems();
//   fetchSolvedProblems();
// }, []);

//   return (
//     <div className="page">
//       <nav className="app-nav">
//         <h2>▣ CodeChain</h2>
//         <div>
//           <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//           <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
//         </div>
//       </nav>

//       <section className="content">
//         <h1>Problem Set</h1>
//         <p>Solve Data Structures and Algorithms challenges to earn CC tokens.</p>

//         <div className="problem-table">
//           <div className="table-head">
//             <span>STATUS</span>
//             <span>TITLE</span>
//             <span>DIFFICULTY</span>
//             <span>TOKENS REWARD</span>
//             <span>ACTION</span>
//           </div>

//           {problems.map((problem) => {
//   const isSolved = solvedIds.includes(problem._id);

//   return (
//     <div className="table-row" key={problem._id}>
//       <span className={isSolved ? "solved-status" : "unsolved-status"}>
//         {isSolved ? "✓" : "○"}
//       </span>

//       <span>
//         <b>{problem.title}</b>
//         <small>{problem.description.slice(0, 45)}...</small>
//       </span>

//       <span className={`badge ${problem.difficulty.toLowerCase()}`}>
//         {problem.difficulty}
//       </span>

//       <span>{problem.reward} CCT</span>

//       <button onClick={() => navigate(`/problems/${problem._id}`)}>
//         {isSolved ? "View / Retry" : "▷ Solve"}
//       </button>
//     </div>
//   );
// })}
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Problems;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  const categories = [
    "All",
    ...new Set(problems.map((problem) => problem.category || "Uncategorized")),
  ];

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase());

    const matchesDifficulty =
      difficultyFilter === "All" || problem.difficulty === difficultyFilter;

    const matchesCategory =
      categoryFilter === "All" ||
      (problem.category || "Uncategorized") === categoryFilter;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const groupedProblems = filteredProblems.reduce((groups, problem) => {
    const category = problem.category || "Uncategorized";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(problem);

    return groups;
  }, {});

  return (
    <div className="page">
      <nav className="app-nav">
        <h2>▣ CodeChain</h2>

        <div>
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
        </div>
      </nav>

      <section className="content problems-content">
        <div className="problems-header">
          <div>
            <h1>Problem Set</h1>
            <p>
              Practice by category, pass hidden test cases, and earn CCT rewards.
            </p>
          </div>

          <div className="problems-count-card">
            <span>Total Problems</span>
            <h2>{filteredProblems.length}</h2>
          </div>
        </div>

        <div className="problem-filters">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={categoryFilter === category ? "active-category" : ""}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
              <span>
                {category === "All"
                  ? problems.length
                  : problems.filter(
                      (problem) =>
                        (problem.category || "Uncategorized") === category
                    ).length}
              </span>
            </button>
          ))}
        </div>

        {Object.keys(groupedProblems).length === 0 ? (
          <div className="empty-problems">
            No problems found for selected filters.
          </div>
        ) : (
          Object.keys(groupedProblems).map((category) => (
            <div className="category-section" key={category}>
              <div className="category-title-row">
                <h2>{category}</h2>
                <span>{groupedProblems[category].length} Problems</span>
              </div>

              <div className="problem-table leetcode-table">
                {groupedProblems[category].map((problem, index) => {
                  const isSolved = solvedIds.includes(problem._id);

                  return (
                    <div className="table-row" key={problem._id}>
                      <span
                        className={isSolved ? "solved-status" : "unsolved-status"}
                      >
                        {isSolved ? "✓" : "○"}
                      </span>

                      <span>
                        <b>
                          {index + 1}. {problem.title}
                        </b>
                        <small>{problem.description.slice(0, 70)}...</small>
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
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Problems;