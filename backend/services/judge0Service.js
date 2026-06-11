const languageMap = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

const runCode = async ({ code, language, stdin = "", expectedOutput = "" }) => {
  const languageId = languageMap[language];

  if (!languageId) {
    throw new Error("Unsupported language selected");
  }

  const response = await fetch(
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin,
        expected_output: expectedOutput,
      }),
    }
  );

  const result = await response.json();

  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    compile_output: result.compile_output || "",
    status: result.status?.description || "Unknown",
    time: result.time || "",
    memory: result.memory || "",
  };
};

module.exports = runCode;