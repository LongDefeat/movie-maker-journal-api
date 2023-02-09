"use strict";

/** Routes for favorites and seen movies for a given user. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Movie = require("../models/userMovie");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const axios = require("axios");

const router = express.Router();

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = `9a114ae809d1fc32f0105fcd87afe983`;

/** POST Favorite Movie to backend => { user: [ {user_id, movie_id} ] } 
 * 
*/
router.post("/:user_id/favorites/:movie_id", async function (req, res, next){
    try{
      console.log("backend: ", req.params.movie_id)
      const favorites = await Movie.addFavorite(req.params.user_id, req.params.movie_id);
      return res.status(201).json({favorites});
    } catch (err){
      return next(err)
    }
});

/** POST Seen Movie to backend => { user: [user_id, movie_id ] } 
 * 
*/
router.post("/:user_id/seen/:movie_id", async function (req, res, next){
    try {
      const seenMovies = await Movie.addSeen(req.params.user_id, req.params.movie_id);
      return res.status(201).json({seenMovies});
    } catch(err){
      return next(err);
    }
});

/** GET all seen movies history 
 * 
*/
router.get("/:user_id/seen", async function(req, res, next){
    try{
      const {user_id} = req.params;
      const seenMovies = await Movie.getSeen(user_id);
      const seenMovieIds = seenMovies.map(m => m.movie_id);
      const unresolved = seenMovieIds.map(async(id) => {
        return await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
          }
        });
      })
      const resolved = await Promise.all(unresolved);
      const seen = resolved.map(prom => {
        return prom.data;
      });
      return res.json({seen});
    } catch(err){
      return next(err)
    }
});

/** GET all favorite movies */

router.get("/:user_id/favorites", async function(req, res, next){
    try {
      const {user_id} = req.params;
      const favoriteMovies = await Movie.getFavorites(user_id);
      const favMovieIds = favoriteMovies.map(m => m.movie_id);
      const unresolved = favMovieIds.map(async(id) => {
        return await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
              api_key: API_KEY,
          }
        });
      }) 
      const resolved = await Promise.all(unresolved);
      const favorites = resolved.map(prom => {
        return prom.data;
      });
      return res.json({favorites});
    } catch (err){
      return next(err)
    }
});



module.exports = router;
