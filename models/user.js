"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users.
 * 
 * Returns { username, first_name, last_name, email, is_admin }
 * 
 * Throws UnauthorizedError if user is not found or entered a wrong password.
 */

class User {

    static async authenticate(username, password){
        // attempt search for user first; try adding leftJoin after public.user here to the favorites table to collect favorites
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    password,
                    created_at AS "createdAt"
             FROM public.user
             WHERE username = $1`,
             [username],
        );
        const user = result.rows[0];

        if (user){
            // compare hashed password to new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true){
                // delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data
     * 
     * Returns { username, firstName, lastName, email, isAdmin}
     * 
     * Throws BadRequestError on duplicates
     */

     static async register({ username, password, firstName, lastName, email }) {
            const duplicateCheck = await db.query(
                `SELECT username
                FROM public.user
                WHERE username = $1`,
                [username],
            );        
      
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate username: ${username}`);
      }
  
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  
      const result = await db.query(
            `INSERT INTO public.user
             (username, first_name,last_name, password)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
          [
            username,
            firstName,
            lastName,
            hashedPassword,
          ],
      );
  
      const user = result.rows[0];
  
      return user;
    }

      /** Get a username, return data about user
       * 
       * Throws NotFoundError if user is not found.
       */

    static async get(username){
        console.log("getting user...");
        const userRes = await db.query(
            `SELECT id,
                    username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    password,
                    created_at AS "createdAt"
             FROM public.user
             WHERE username = $1`,
             [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username} found.`)
        
        const userWatchedMovies = await db.query(
            `SELECT w.user_id
            FROM user_watched_movies AS w
            WHERE w.user_id = $1`, [username.user_id]
        );

        user.user_watched_movies = userWatchedMovies.rows.map(w => w.user_id);
        return user;
    }

    /** Update user data with 'data'.
     * 
     * This is a "partial update" -- it's fine if data does not contain each field
     * so only changes are for provided fields.
     * 
     * Data can include: { firstName, lastName, password, isAdmin }
     * 
     * Returns { username, firstName, lastName, email, isAdmin }
     * 
     * Throws NotFoundError if not found.
     * 
     * Warning - this function can set a new password or make a user an admin.
     *  Callers of this function must be absolutely certain they have validated inputs to this
     * or a serious security risk can happen.
     */

    static async update(username, data){
        if (data.password){
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }
        let result = await db.query(`UPDATE public.user
                                     SET username = $1,
                                         password = $2
                                     WHERE username = $3
                                     RETURNING username, password, first_name, last_name, created_at
                                     `,
                                     [data.username, data.password, username]);

        const user = result.rows[0];

        return user;  
    }   

    /** Delete given user from database; returns undefined. */
    static async remove(username) {
        let result = await db.query(
           `DELETE
            FROM user
            WHERE username = $1
            RETURNING username`,
            [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

}

module.exports = User;
       