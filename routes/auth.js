"use strict";

/** Routes for authentication */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const e = require("express");

/** POST /auth/token: { username, password } => { token } 
 * 
 * Returns JWT token which will be used to authenticate further requests.
 * 
 * Authorization Required: None.
*/

router.post("/token", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, userAuthSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const { username, password } = req.body;
      const user = await User.authenticate(username, password);
      const token = createToken(user);
      return res.json({ token });
    } catch (err) {
      return next(err);
    }
  });

  router.post("/register", async function (req, res, next){
    console.log("registering a user in auth.js")
    try {
        const writeObj = {...req.body};
        delete writeObj.email;
        const validator = jsonschema.validate(writeObj, userRegisterSchema);
        if (!validator.valid){
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const newUser = await User.register(writeObj)
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err){
        return next(err);
    }
  });

  module.exports = router;