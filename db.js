"use strict";
/** Database setup for movie maker journal. */
const { Client } = require('pg')
 
const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
})

// const client = new Client({
//   host: 'my.database-server.com',
//   port: 25060,
//   user: 'database-user',
//   database: process.env.PGDATABASE,
//   password: 'secretpassword!!',
// })
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.CACERT,
    }
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri()
  });
}

db.connect();

module.exports = db;