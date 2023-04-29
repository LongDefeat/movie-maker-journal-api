"use strict";
/** Database setup for movie maker journal. */
const { Client } = require("pg");

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    host: "http://localhost",
    port: "5432",
    user: "mason",
    database: "mmj",
    password: "",
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

db.connect();

db.query("SELECT * FROM public.user", async (err, res) => {
  if (err) throw err;
  console.log(await res);
  client.end();
});

module.exports = client;
