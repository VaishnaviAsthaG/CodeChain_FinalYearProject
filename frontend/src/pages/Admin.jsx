// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/api";
// import "../index.css";

// function Admin() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     difficulty: "Easy",
//     inputExample: "",
//     outputExample: "",
//     expectedOutput: "",
//     reward: 50,
//     testCases: [
//   {
//     input: "",
//     expectedOutput: "",
//     isHidden: false,
//   },
// ],
//   });

//   const [problems, setProblems] = useState([]);
// const [editingId, setEditingId] = useState(null);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

// const handleTestCaseChange = (index, field, value) => {
//   const updatedTestCases = [...form.testCases];

//   updatedTestCases[index][field] = value;

//   setForm({
//     ...form,
//     testCases: updatedTestCases,
//   });
// };

// const addTestCase = () => {
//   setForm({
//     ...form,
//     testCases: [
//       ...form.testCases,
//       {
//         input: "",
//         expectedOutput: "",
//         isHidden: true,
//       },
//     ],
//   });
// };

// const removeTestCase = (index) => {
//   const updatedTestCases = form.testCases.filter((_, i) => i !== index);

//   setForm({
//     ...form,
//     testCases: updatedTestCases,
//   });
// };

// const fetchProblems = async () => {
//   try {
//     const { data } = await API.get("/problems");
//     setProblems(data);
//   } catch (error) {
//     console.log(error);
//   }
// };
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//   ...form,
//   testCases: form.testCases.map((tc, index) => ({
//     input: tc.input,
//     expectedOutput: tc.expectedOutput || form.expectedOutput,
//     isHidden: index === 0 ? false : tc.isHidden,
//   })),
// };

// const handleDelete = async (id) => {
//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this problem?"
//   );

//   if (!confirmDelete) return;

//   try {
//     await API.delete(`/problems/${id}`);

//     fetchProblems();

//     alert("Problem deleted successfully");
//   } catch (error) {
//     alert("Delete failed");
//   }
// };

// const handleEdit = (problem) => {
//   setEditingId(problem._id);

//   setForm({
//     title: problem.title,
//     description: problem.description,
//     difficulty: problem.difficulty,
//     inputExample: problem.inputExample,
//     outputExample: problem.outputExample,
//     expectedOutput: problem.expectedOutput,
//     reward: problem.reward,

//     testCases:
//       problem.testCases?.length > 0
//         ? problem.testCases
//         : [
//             {
//               input: "",
//               expectedOutput: "",
//               isHidden: false,
//             },
//           ],
//   });

//   window.scrollTo({
//     top: 0,
//     behavior: "smooth",
//   });
// };

// if (editingId) {
//   await API.put(`/problems/${editingId}`, payload);

//   alert("Problem updated successfully");
// } else {
//   await API.post("/problems/add", payload);

//   alert("Problem added successfully");
// }

//       alert("Problem added successfully");
// setForm({
//   title: "",
//   description: "",
//   difficulty: "Easy",
//   inputExample: "",
//   outputExample: "",
//   expectedOutput: "",
//   reward: 50,
//   testCases: [
//     {
//       input: "",
//       expectedOutput: "",
//       isHidden: false,
//     },
//   ],
// });
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add problem");
//     }
//   };

//   useEffect(() => {
//   fetchProblems();
// }, []);

//   return (
//     <div className="page">
//       <nav className="app-nav">
//         <h2>▣ CodeChain Admin</h2>
//         <div>
//           <button onClick={() => navigate("/dashboard")}>Dashboard</button>
//           <button onClick={() => navigate("/problems")}>Problems</button>
//           <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
//         </div>
//       </nav>

//       <section className="admin-content">
//         <h1>Admin Control Panel</h1>
//         <p>Add new DSA problems for CodeChain users.</p>

//         <form className="admin-form" onSubmit={handleSubmit}>
//           <label>Problem Title</label>
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Example: Binary Search"
//             required
//           />

//           <label>Description</label>
//           <textarea
//             name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Write problem statement..."
//             required
//           />

//           <div className="form-grid">
//             <div>
//               <label>Difficulty</label>
//               <select
//                 name="difficulty"
//                 value={form.difficulty}
//                 onChange={handleChange}
//               >
//                 <option>Easy</option>
//                 <option>Medium</option>
//                 <option>Hard</option>
//               </select>
//             </div>

//             <div>
//               <label>Reward</label>
//               <input
//                 type="number"
//                 name="reward"
//                 value={form.reward}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <label>Input Example</label>
//           <input
//             name="inputExample"
//             value={form.inputExample}
//             onChange={handleChange}
//             placeholder="Example: nums = [2,7,11,15], target = 9"
//             required
//           />

//           <label>Output Example</label>
//           <input
//             name="outputExample"
//             value={form.outputExample}
//             onChange={handleChange}
//             placeholder="Example: [0,1]"
//             required
//           />

//           <label>Expected Output</label>
//           <input
//             name="expectedOutput"
//             value={form.expectedOutput}
//             onChange={handleChange}
//             placeholder="Example: [0,1]"
//             required
//           />

//           <div className="testcase-section">
//   <h2>Test Cases</h2>

//   {form.testCases.map((testCase, index) => (
//     <div className="testcase-card" key={index}>
//       <div className="testcase-header">
//         <h3>Test Case {index + 1}</h3>

//         {index > 0 && (
//           <button
//             type="button"
//             className="remove-testcase-btn"
//             onClick={() => removeTestCase(index)}
//           >
//             Remove
//           </button>
//         )}
//       </div>

//       <label>Input</label>
//       <input
//         value={testCase.input}
//         onChange={(e) =>
//           handleTestCaseChange(index, "input", e.target.value)
//         }
//         placeholder="Example: nums = [2,7,11,15]"
//       />

//       <label>Expected Output</label>
//       <input
//         value={testCase.expectedOutput}
//         onChange={(e) =>
//           handleTestCaseChange(index, "expectedOutput", e.target.value)
//         }
//         placeholder="Example: [0,1]"
//         required
//       />

//       <label className="checkbox-label">
//         <input
//           type="checkbox"
//           checked={testCase.isHidden}
//           onChange={(e) =>
//             handleTestCaseChange(index, "isHidden", e.target.checked)
//           }
//         />
//         Hidden Test Case
//       </label>
//     </div>
//   ))}

//   <button
//     type="button"
//     className="add-testcase-btn"
//     onClick={addTestCase}
//   >
//     + Add Hidden Test Case
//   </button>
// </div>

//          <button type="submit" className="admin-submit-btn">
//   {editingId ? "Update Problem" : "Add Problem"}
// </button>
//         </form>

// <div className="admin-problems-list">
//   <h2>Existing Problems</h2>

//   {problems.map((problem) => (
//     <div className="admin-problem-card" key={problem._id}>
//       <div>
//         <h3>{problem.title}</h3>

//         <p>{problem.difficulty}</p>

//         <small>{problem.reward} CCT</small>
//       </div>

//       <div className="admin-actions">
//         <button
//           className="edit-btn"
//           onClick={() => handleEdit(problem)}
//         >
//           Edit
//         </button>

//         <button
//           className="delete-btn"
//           onClick={() => handleDelete(problem._id)}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   ))}
// </div>

//       </section>
//     </div>
//   );
// }

// export default Admin;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../index.css";

function Admin() {
  const navigate = useNavigate();

  const initialForm = {
    title: "",
    description: "",
    difficulty: "Easy",
    inputExample: "",
    outputExample: "",
    expectedOutput: "",
    reward: 50,
    testCases: [
      {
        input: "",
        expectedOutput: "",
        isHidden: false,
      },
    ],
  };

  const [form, setForm] = useState(initialForm);
  const [problems, setProblems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchProblems = async () => {
    try {
      const { data } = await API.get("/problems");
      setProblems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...form.testCases];
    updatedTestCases[index][field] = value;

    setForm({
      ...form,
      testCases: updatedTestCases,
    });
  };

  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [
        ...form.testCases,
        {
          input: "",
          expectedOutput: "",
          isHidden: true,
        },
      ],
    });
  };

  const removeTestCase = (index) => {
    const updatedTestCases = form.testCases.filter((_, i) => i !== index);

    setForm({
      ...form,
      testCases: updatedTestCases,
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        reward: Number(form.reward),
        testCases: form.testCases.map((tc, index) => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput || form.expectedOutput,
          isHidden: index === 0 ? false : tc.isHidden,
        })),
      };

      if (editingId) {
        await API.put(`/problems/${editingId}`, payload);
        alert("Problem updated successfully");
      } else {
        await API.post("/problems/add", payload);
        alert("Problem added successfully");
      }

      resetForm();
      fetchProblems();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (problem) => {
    setEditingId(problem._id);

    setForm({
      title: problem.title || "",
      description: problem.description || "",
      difficulty: problem.difficulty || "Easy",
      inputExample: problem.inputExample || "",
      outputExample: problem.outputExample || "",
      expectedOutput: problem.expectedOutput || "",
      reward: problem.reward || 50,
      testCases:
        problem.testCases?.length > 0
          ? problem.testCases
          : [
              {
                input: "",
                expectedOutput: problem.expectedOutput || "",
                isHidden: false,
              },
            ],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/problems/${id}`);
      fetchProblems();
      alert("Problem deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

const totalProblems = problems.length;
const easyProblems = problems.filter((p) => p.difficulty === "Easy").length;
const mediumProblems = problems.filter((p) => p.difficulty === "Medium").length;
const hardProblems = problems.filter((p) => p.difficulty === "Hard").length;

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
        <p>Add, update, and manage DSA problems for CodeChain users.</p>

        <div className="admin-stats-grid">
  <div className="admin-stat-card">
    <span>Total Problems</span>
    <h2>{totalProblems}</h2>
  </div>

  <div className="admin-stat-card">
    <span>Easy</span>
    <h2>{easyProblems}</h2>
  </div>

  <div className="admin-stat-card">
    <span>Medium</span>
    <h2>{mediumProblems}</h2>
  </div>

  <div className="admin-stat-card">
    <span>Hard</span>
    <h2>{hardProblems}</h2>
  </div>
</div>

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
            placeholder="Example: 1 2 3 4 5"
            required
          />

          <label>Output Example</label>
          <input
            name="outputExample"
            value={form.outputExample}
            onChange={handleChange}
            placeholder="Example: 15"
            required
          />

          <label>Expected Output</label>
          <input
            name="expectedOutput"
            value={form.expectedOutput}
            onChange={handleChange}
            placeholder="Example: 15"
            required
          />

          <div className="testcase-section">
            <h2>Test Cases</h2>

            {form.testCases.map((testCase, index) => (
              <div className="testcase-card" key={index}>
                <div className="testcase-header">
                  <h3>Test Case {index + 1}</h3>

                  {index > 0 && (
                    <button
                      type="button"
                      className="remove-testcase-btn"
                      onClick={() => removeTestCase(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label>Input</label>
                <input
                  value={testCase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                  placeholder="Example: 1 2 3 4 5"
                />

                <label>Expected Output</label>
                <input
                  value={testCase.expectedOutput}
                  onChange={(e) =>
                    handleTestCaseChange(
                      index,
                      "expectedOutput",
                      e.target.value
                    )
                  }
                  placeholder="Example: 15"
                  required
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={testCase.isHidden}
                    onChange={(e) =>
                      handleTestCaseChange(
                        index,
                        "isHidden",
                        e.target.checked
                      )
                    }
                  />
                  Hidden Test Case
                </label>
              </div>
            ))}

            <button
              type="button"
              className="add-testcase-btn"
              onClick={addTestCase}
            >
              + Add Hidden Test Case
            </button>
          </div>

          <button type="submit" className="admin-submit-btn">
            {editingId ? "Update Problem" : "Add Problem"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-edit-btn"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="admin-problems-list">
          <h2>Existing Problems</h2>

          {problems.map((problem) => (
            <div className="admin-problem-card" key={problem._id}>
              <div>
                <h3>{problem.title}</h3>
                <p>{problem.difficulty}</p>
                <small>{problem.reward} CCT</small>
              </div>

              <div className="admin-actions">
                <button className="edit-btn" onClick={() => handleEdit(problem)}>
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(problem._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Admin;