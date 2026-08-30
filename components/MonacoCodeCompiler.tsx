import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

export default function MonacoCodeCompiler() {
  const [code, setCode] = useState("console.log('Hello, Monaco!')");
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(code);
      setOutput(result === undefined ? "(Check console output)" : String(result));
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  return (
    <div style={{ margin: "2rem 0", padding: "2rem", background: "#f5f5f5", borderRadius: 8 }}>
      <h3 style={{ marginBottom: "1rem" }}>JavaScript Code Compiler</h3>
      <MonacoEditor
        height="300px"
        language="javascript"
        value={code}
        onChange={value => setCode(value)}
        theme="vs-dark"
        options={{ fontSize: 16, minimap: { enabled: false } }}
        wrapperProps={{ style: { marginBottom: 12, borderRadius: 4 } }}
      />
      <button onClick={runCode} style={{ fontSize: 16, padding: "8px 24px", borderRadius: 4, background: "#1976d2", color: "#fff", border: "none" }}>
        Run Code
      </button>
      <div style={{ marginTop: 16, background: "#fff", borderRadius: 4, minHeight: 40, padding: 12 }}>
        <strong>Output:</strong>
        <pre style={{ margin: 0 }}>{output}</pre>
      </div>
    </div>
  );
}
