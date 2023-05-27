"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Journal {
  /** Add journal entry  */
  static async create(body, user_id) {
    console.log("create journal method in backend: ", body, user_id);
    let result = await db.query(
      `INSERT INTO user_journal
        (user_id, movie_id, comment, movie_title)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [user_id, body.movie_id, body.comment, body.movie_title]
    );
    const journalEntry = result.rows[0];

    return journalEntry;
  }

  /** Get all journal entries for a given user*/
  static async getEntries(user_id) {
    let result = await db.query(
      `SELECT id,
                  user_id,
                  movie_id,
                  comment,
                  created_at,
                  movie_title
          FROM user_journal
          WHERE user_id = $1`,
      [user_id]
    );
    const journalEntries = result.rows;
    return journalEntries;
  }

  /** Delete Journal entry */
  static async delete(id) {
    let result = await db.query(
      `DELETE FROM user_journal
          where id = $1
          RETURNING id`,
      [id]
    );
    const entry = result.rows[0];
    if (!entry) throw new NotFoundError(`No journal entry ${id} found...`);

    return entry;
  }
}

module.exports = Journal;
