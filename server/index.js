const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const dummyText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

app.get("/events", (req, res) => {
  console.log("req.query", req.query);
  const lastEventId = parseInt(req.query.id);
  // const lastEventId = req.headers["last-event-id"]
  //   ? parseInt(req.headers["last-event-id"])
  //   : -1;

  console.log("/events");
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const dummyTextArr = dummyText.split(" ");
  let index = lastEventId + 1;

  const sendEvents = (res, arr) => {
    // const invalidateEpgCache = false;
    const invalidateEpgCache = Math.random() < 0.5;
    if (invalidateEpgCache) {
      const eventData = { eventId: index, msg: "Invaidate Epg Cache" };
      res.write(`id: ${index}\n`);
      res.write(`event: invalidate_epg_cahce\n`);
      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    } else {
      const eventData = { eventId: index, msg: arr[index] };
      res.write(`id: ${index}\n`);
      res.write(`event: text_update\n`);
      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      index++;
    }
    if (index < arr.length) setTimeout(() => sendEvents(res, arr), 2000);
  };

  sendEvents(res, dummyTextArr);
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
