"use strict";
/** Database setup for movie maker journal. */
// const { Client } = require("pg");
const { Pool } = require("pg");

// let client = new Client({
//   host: process.env.PGHOST,
//   port: process.env.PGPORT,
//   user: process.env.PGUSER,
//   database: process.env.PGDATABASE,
//   password: process.env.PGPASSWORD,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// const client = new Client({
//   host: 'my.database-server.com',
//   port: 25060,
//   user: 'database-user',
//   database: process.env.PGDATABASE,
//   password: 'secretpassword!!',
// })
const { getDatabaseUri } = require("./config");

let client;

if (process.env.NODE_ENV === "production") {
  client = new Pool({
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
  client = new Pool({
    host: "localhost",
    port: 5432,
    user: "mason",
    database: "mmj",
    password: "secretpassword!!",
    ssl: false,
  });
}
// (async () => {})();

try {
  client.connect();
} catch (err) {
  console.log(err);
}

client.query("SELECT * FROM public.user", async (err, res) => {
  console.log("connnnnnt");
  if (err) throw err;
  console.log("nat");
  console.log(await res);
  // client.end();
});

module.exports = client;
