"use strict";

const app = require("./app");
const cors = require("cors");

app.use(cors({ origin: "*" }));
const serverPort = 3001;
app.listen(serverPort, function () {
  console.log(`Started on http://localhost:${serverPort}`);
});
