import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
  const [streamingText, setStreamingText] = useState("");
  const [invalidateText, setInvalidateText] = useState("");
  const [lastEventId, setLastEventId] = useState(30);

  const handleInvalidateEpgCache = (ev) => {
    const eventData = JSON.parse(ev.data);
    setLastEventId(eventData.eventId);
    setInvalidateText(
      (prev) => `${prev} id: ${eventData.eventId}, Message: ${eventData.msg}\n`
    );
  };

  const handleTextUpdate = (ev) => {
    const eventData = JSON.parse(ev.data);
    setLastEventId(eventData.eventId);
    setStreamingText(
      (prev) => `${prev} id: ${eventData.eventId}, Message: ${eventData.msg}\n`
    );
  };

  useEffect(() => {
    const stream = new EventSource(
      `http://localhost:3001/events?id=${lastEventId}`
    );

    stream.addEventListener("invalidate_epg_cahce", handleInvalidateEpgCache);
    stream.addEventListener("text_update", handleTextUpdate);

    return () => {
      stream.close();
      stream.removeEventListener(
        "invalidate_epg_cahce",
        handleInvalidateEpgCache
      );
      stream.removeEventListener("text_update", handleTextUpdate);
    };
  }, []);

  return (
    <div className="App">
      <h3>Events Data</h3>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <p style={{ whiteSpace: "pre-line", lineHeight: "36px" }}>
          {streamingText}
        </p>
        <p style={{ whiteSpace: "pre-line", lineHeight: "36px" }}>
          {invalidateText}
        </p>
      </div>
    </div>
  );
}

export default App;
