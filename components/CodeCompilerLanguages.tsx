import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

const languages = [
  { label: "C", value: "c", id: 50 },
  { label: "C++", value: "cpp", id: 54 },
  { label: "Python", value: "python", id: 71 }
];

const defaultCode = {
  c: '#include <stdio.h>\nint main() { printf("Hello, C!\\n"); return 0; }',
  cpp: '#include <iostream>\nint main() { std::cout << "Hello, C++!" << std::endl; return 0; }',
  python: 'print("Hello, Python!")'
};

export default function CodeCompilerLanguages() {
  const [language, setLanguage] = useState("c");
  const [code, setCode] = useState(defaultCode[language]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(defaultCode[e.target.value]);
    setOutput("");
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    try {
      const langObj = languages.find(l => l.value === language);
      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
        body: JSON.stringify({
          source_code: code,
          language_id: langObj.id
        })
      });
      const result = await response.json();
      setOutput(
        (result.stdout ? "Output:\n" + result.stdout : "") +
        (result.stderr ? "\nError:\n" + result.stderr : "") +
        (result.compile_output ? "\nCompiler Output:\n" + result.compile_output : "") ||
        "No output"
      );
    } catch (err) {
      setOutput("Error running code");
    }
    setLoading(false);
  };

  return (
    <div style={{ margin: "2rem 0", padding: "2rem", background: "#f5f5f5", borderRadius: 8 }}>
      <h3 style={{ marginBottom: "1rem" }}>Online Code Compiler</h3>
      <select value={language} onChange={handleLanguageChange} style={{ fontSize: 16, marginBottom: 12 }}>
        {languages.map(lang => (
          <option key={lang.value} value={lang.value}>{lang.label}</option>
        ))}
      </select>
      <MonacoEditor
        height="300px"
        language={language === "python" ? "python" : language === "cpp" ? "cpp" : "c"}
        value={code}
        onChange={value => setCode(value)}
        theme="vs-dark"
        options={{ fontSize: 16, minimap: { enabled: false } }}
        wrapperProps={{ style: { marginBottom: 12, borderRadius: 4 } }}
      />
      <button onClick={handleRun} disabled={loading} style={{ fontSize: 16, padding: "8px 24px", borderRadius: 4, background: "#1976d2", color: "#fff", border: "none" }}>
        {loading ? "Running..." : "Run Code"}
      </button>
      <div style={{ marginTop: 16, background: "#fff", borderRadius: 4, minHeight: 40, padding: 12 }}>
        <strong>Output:</strong>
        <pre style={{ margin: 0 }}>{output}</pre>
      </div>
    </div>
  );
}
