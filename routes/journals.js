"use strict";

/** Journal routes for a given user. */

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Journal = require("../models/userJournal");
const axios = require("axios");

const router = express.Router();

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = `9a114ae809d1fc32f0105fcd87afe983`;

/** GET all Journal Entries and Movie Data*/

router.get("/:user_id/journal-entries", async function (req, res, next) {
  try {
    const { user_id } = req.params;
    const journalEntries = await Journal.getEntries(user_id);
    const journalMovieIds = journalEntries.map((e) => e.movie_id);
    const unresolved = journalMovieIds.map(async (id) => {
      return await axios.get(`${BASE_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
        },
      });
    });
    const resolved = await Promise.all(unresolved);
    const movieData = resolved.map((prom) => {
      return prom.data;
    });
    console.log("movieData from journals.js in backend: ", movieData);
    return res.json({ journalEntries });
  } catch (err) {
    return next(err);
  }
});

/** POST Journal Entry/  */

router.post("/:user_id", async function (req, res, next) {
  try {
    const journalEntry = await Journal.create(req.body, req.params.user_id);
    return res.status(201).json({ journalEntry });
  } catch (err) {
    return next(err);
  }
});

/** Delete journal entry */

router.delete("/:id", async function (req, res, next) {
  try {
    await Journal.delete(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
