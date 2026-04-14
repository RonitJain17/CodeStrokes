import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";

function App() {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [consoleOutput, setConsoleOutput] = useState([]);
const [resultOutput, setResultOutput] = useState("");
  const [activeTab, setActiveTab] = useState("console");

  const ghostEditorRef = useRef(null);
  const userEditorRef = useRef(null);

  const ghostCode = `console.log("Hello Ronit");
console.log("Welcome to CodeStrokes");`;


  const checkProgress = () => {
  const userLines = code.split("\n");
  const ghostLines = ghostCode.split("\n");

  let correctCount = 0;

  for (let i = 0; i < userLines.length; i++) {
    if (userLines[i].trim() === ghostLines[i]?.trim()) {
      correctCount++;
    } else break;
  }

  if (correctCount === ghostLines.length) {
    setConsoleOutput([
      { type: "log", text: "🎉 Perfect! You completed it!" },
    ]);
  } else {
    setConsoleOutput([
      {
        type: "log",
        text: `✅ ${correctCount} line(s) correct. Keep going!`,
      },
    ]);
  }

  // optional: clear output tab
  setResultOutput("");
};

  const runCode = () => {
  try {
    if (language === "javascript") {
      let logs = [];
      const originalLog = console.log;
      const originalError = console.error;

      // Capture console.log
      console.log = (...args) => {
        logs.push({ type: "log", text: args.join(" ") });
      };

      // Capture console.error
      console.error = (...args) => {
        logs.push({ type: "error", text: args.join(" ") });
      };

      const result = eval(code);

      // Restore console
      console.log = originalLog;
      console.error = originalError;

      setConsoleOutput(
        logs.length > 0 ? logs : [{ type: "log", text: "No console output" }]
      );

      setResultOutput(
        result !== undefined ? String(result) : "No return value"
      );
    } else {
      setConsoleOutput([{ type: "error", text: "Only JS supported locally" }]);
      setResultOutput("");
    }
  } catch (err) {
    setConsoleOutput([{ type: "error", text: err.message }]);
    setResultOutput("");
  }
};

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#121212",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {/* 🔥 TOP BAR */}
      <div className="navbar">
  <div className="logo">
    Code<span>Strokes</span>
  </div>

  <div className="nav-actions">
    <div className="dropdown">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="dropdown-select"
      >
        <option value="javascript">JavaScript</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
      </select>
    </div>

    <button className="btn run-btn" onClick={runCode}>
      ▶ Run
    </button>

    <button className="btn check-btn" onClick={checkProgress}>
      ✔ Check
    </button>
  </div>
</div>

      {/* 🔥 MAIN */}
<div style={{ display: "flex", flex: 1 }}>
  
  {/* EDITOR */}
  <div style={{ flex: 2, position: "relative" }}>
    <div style={{ position: "relative", height: "100%" }}>
      
      {/* GHOST EDITOR */}
      <div
  className="ghost-editor"
  style={{
    position: "absolute",
    inset: 0,
    zIndex: 1,
  }}
>
        <Editor
          height="100%"
          language={language}
          value={ghostCode}
          onMount={(editor) => {
            ghostEditorRef.current = editor;
          }}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "monospace",
            lineHeight: 22,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "none",
            scrollbar: { vertical: "hidden", horizontal: "hidden" },
          }}
          theme="vs-dark"
        />
      </div>

      {/* USER EDITOR */}
      <div
  style={{
    position: "absolute",
    inset: 0,
    zIndex: 2,
  }}
>
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => {
  setCode(value || "");
}}
          onMount={(editor, monaco) => {
            userEditorRef.current = editor;

            monaco.editor.defineTheme("transparentTheme", {
  base: "vs-dark",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#00000000",
    "editorGutter.background": "#00000000",
  },
});

            monaco.editor.setTheme("transparentTheme");

            editor.onDidScrollChange((e) => {
              if (ghostEditorRef.current) {
                ghostEditorRef.current.setScrollTop(e.scrollTop);
                ghostEditorRef.current.setScrollLeft(e.scrollLeft);
              }
            });

            window.monaco = monaco;
          }}
          options={{
            fontSize: 14,
            fontFamily: "monospace",
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
          }}
        />
      </div>

    </div>
  </div>

  {/* OUTPUT PANEL */}
  <div
    style={{
      flex: 1,
      background: "#0f0f0f",
      borderLeft: "1px solid #333",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div className="tabs">
  <div
    className="tab-indicator"
    style={{
      transform:
        activeTab === "console" ? "translateX(0%)" : "translateX(100%)",
    }}
  />

  <button
    className={`tab-btn ${activeTab === "console" ? "active" : ""}`}
    onClick={() => setActiveTab("console")}
  >
    🖥 Console
  </button>

  <button
    className={`tab-btn ${activeTab === "output" ? "active" : ""}`}
    onClick={() => setActiveTab("output")}
  >
    📤 Output
  </button>
</div>

    <div style={{ padding: "10px", flex: 1 }}>
      <div style={{ padding: "10px", flex: 1 }}>
  {activeTab === "console" ? (
    <div style={{ fontFamily: "monospace", fontSize: "14px" }}>
      {consoleOutput.length > 0 ? (
        consoleOutput.map((item, index) => (
          <div
            key={index}
            style={{
              color: item.type === "error" ? "#ff4d4f" : "#00ff88",
              marginBottom: "4px",
            }}
          >
            {item.text}
          </div>
        ))
      ) : (
        <div style={{ color: "#888" }}>
          Run code to see console logs...
        </div>
      )}
    </div>
  ) : (
    <pre style={{ color: "#00ffcc" }}>
      {resultOutput || "Run code to see output..."}
    </pre>
  )}
</div>
    </div>
  </div>

</div>

      {/* 🔥 STYLE */}
      <style>
        {`
        /* 🔥 Glass Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;

  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  position: sticky;
  top: 0;
  z-index: 100;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

/* Right side actions */
.nav-actions {
  display: flex;
  align-items: center;
}

/* Slight hover glow */
.navbar:hover {
  box-shadow: 0 6px 25px rgba(0, 255, 204, 0.15);
}
        /* 🔥 Logo Styling */
.logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* Code part */
.logo {
  background: linear-gradient(90deg, #00c6ff, #007bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Strokes part */
.logo span {
  background: linear-gradient(90deg, #00ffcc, #5cff8d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Subtle glow */
.logo:hover {
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
}
        .dropdown {
  position: relative;
  display: inline-block;
  margin-right: 10px;
}

/* Select styling */
.dropdown-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background: #1e1e1e;
  color: white;
  padding: 8px 36px 8px 12px;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}

/* Hover */
.dropdown-select:hover {
  border-color: #00c6ff;
  box-shadow: 0 0 8px rgba(0, 198, 255, 0.3);
}

/* Focus */
.dropdown-select:focus {
  outline: none;
  border-color: #00ffcc;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
}

/* Custom arrow */
.dropdown::after {
  content: "▾";
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  pointer-events: none;
  font-size: 12px;
}

/* Dropdown options (limited styling support) */
.dropdown-select option {
  background: #1e1e1e;
  color: white;
}
        .tabs {
  position: relative;
  display: flex;
  background: #0f0f0f;
  border-bottom: 1px solid #222;
  overflow: hidden;
}

/* 🔥 Sliding indicator */
.tab-indicator {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 3px;
  background: linear-gradient(90deg, #00ffcc, #00c6ff);
  transition: transform 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.6);
}

/* Tab buttons */
.tab-btn {
  flex: 1;
  padding: 12px;
  background: transparent;
  color: #888;
  border: none;
  cursor: pointer;
  font-weight: 500;
  z-index: 1;
  transition: all 0.25s ease;
}

/* Hover */
.tab-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

/* Active */
.tab-btn.active {
  color: #00ffcc;
}

/* Click */
.tab-btn:active {
  transform: scale(0.95);
}


/* 🔥 Buttons (Run / Check) */
.btn {
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  color: white;
}

/* ▶ Run Button */
.run-btn {
  background: linear-gradient(135deg, #007bff, #00c6ff);
}

.run-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 18px rgba(0, 123, 255, 0.5);
}

.run-btn:active {
  transform: scale(0.95);
}

/* ✔ Check Button */
.check-btn {
  background: linear-gradient(135deg, #28a745, #5cff8d);
}

.check-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 18px rgba(40, 167, 69, 0.5);
}

.check-btn:active {
  transform: scale(0.95);
}


/* 👻 Ghost editor styling */
.ghost-editor .view-lines {
  opacity: 0.35;
}

.ghost-editor .margin {
  opacity: 0.2;
}
        `}
      </style>
    </div>
  );
}

export default App;