import "./index.css";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import {
  execHttpSequential,
  execHttpConcurrent,
  execWsSequential,
  execWsConcurrent,
} from "./benchmark";

const App = () => {
  const [output, setOutput] = useState("");

  const handleRunClick = useCallback(async () => {
    const iter = [
      { name: "HTTP sequential", fn: execHttpSequential },
      { name: "HTTP concurrent", fn: execHttpConcurrent },
      { name: "WebSocket sequential", fn: execWsSequential },
      { name: "WebSocket concurrent", fn: execWsConcurrent },
    ];

    setOutput("");

    for (const i of iter) {
      const name = `${i.name}...`.padEnd(30, " ");
      setOutput((o) => `${o}${name}`);
      const result = await i.fn();
      setOutput((o) => `${o}${result.average}ms (avg)\n`);
    }
    setOutput((o) => `${o}Done 👍`);
  }, []);

  return (
    <main>
      <code>{output && <pre>{output}</pre>}</code>
      <button onClick={handleRunClick}>Run benchmark</button>
    </main>
  );
};

export default App;
