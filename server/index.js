const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});
