"use strict";

const app = require("./app");
const cors = require("cors");

app.use(cors({ origin: "*" }));

const PORT = process.env.PORT;
app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
