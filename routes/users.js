"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const axios = require("axios");

const router = express.Router();

/** POST / { user } => { user, token }
 *
 * Adds a new user. This is not the registration endpoint.
 * only for admin users to add new users. THe new user being added
 * can be an admin.
 *
 * This returns the newly created user an authentication token for them
 *  ---> {user: { username, firstName, lastName, isAdmin}}
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userName);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/** GET / => { users: [ {username, firstName, lastName }, ...] }
 *
 * Returns list of all users
 * NEED ALL USERS FUNCTION
 */

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *  { firstName, lastName, password }
 *
 * Returns { username, firstName, lastName, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 */

router.patch("/:username", async function (req, res, next) {
  try {
    // const validator = jsonschema.validate(req.body, userUpdateSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map(e => e.stack);
    //   throw new BadRequestError(errs);
    // }

    const updateProfile = await User.update(req.params.username, req.body);
    console.log(updateProfile);
    return res.json({ updateProfile });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
