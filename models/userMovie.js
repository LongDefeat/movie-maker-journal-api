"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");
  
class Movie {
  
  /** Get all favorite movie_ids */
  static async getFavorites(user_id){
    let result = await db.query(
        `SELECT movie_id
        FROM user_favorite_movies
        WHERE user_id = $1`,
        [user_id],
    );
    const favoriteMoviesList = result.rows;
    return favoriteMoviesList;
  }

  /** Add favorite movie to table */
  static async addFavorite(user_id, movie_id){
    let result = await db.query(
      `INSERT INTO user_favorite_movies
              (user_id, movie_id)
              VALUES($1, $2)
      RETURNING *`,
      [user_id, movie_id]
  );
  return result.rows;
  }

  /** Add seen movie to user */
  static async addSeen(user_id, movie_id){
    console.log(movie_id, user_id);
    let result = await db.query(
      `INSERT INTO user_watched_movies
              (user_id, movie_id)
              VALUES($1, $2)
        RETURNING *`,
        [user_id, movie_id]
    );
    return result.rows;
  }

  /** Get all seen movies  */
  static async getSeen(user_id){
    let result = await db.query(
        `SELECT movie_id
        FROM user_watched_movies
        WHERE user_id = $1`,
        [user_id],
    );
    const seenMovieList = result.rows;
    return seenMovieList;
  }
}

module.exports = Movie;