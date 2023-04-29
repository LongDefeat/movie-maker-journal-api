"use strict";

/** Express app for Movie Maker Journal */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const movieDbRoutes = require("./routes/movieDb");
const journalRoutes = require("./routes/journals");
const movieRoutes = require("./routes/userMovies");
const general = require("./routes/general");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/moviedb", movieDbRoutes);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/journals", journalRoutes);
app.use("/movies", movieRoutes);
app.use("/", general);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
