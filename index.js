const subApplicationName = "zoro-users"; // sub-application name
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var debug = require("debug")(subApplicationName); // flavoured console.log()

/**
 * -------------ZORO USERS EXPRESS SUB APP----------------
 */

/**
 * db connection middlewrare
 * @param {Error} err
 */

const onConnection = (err) => {
  // throw exception on database connection failed
  if (err) {
    let errorMessage = `Error on database connection from ${subApplicationName}`;
    debug(errorMessage);
    throw errorMessage;
  }

  // connected
  let successMessage = `Mongoose connected from ${subApplicationName}`;
  debug(successMessage);
};

// create mongoose connection if not exists
if (!mongoose.connection.readyState) {
  if (process.env.DB_HOST) mongoose.connect(process.env.DB_HOST, onConnection);
} else {
  // connection exists
  let successMessage = `Mongoose connection got from ${subApplicationName}`;
  debug(successMessage);
}

/**
 * init app
 * @param {Express} express
 * @returns {any} express app
 */
function _initApp(express) {
  const app = express();
  app.get("*", (req, res, next) => {
    res.end(`${subApplicationName} works`);
  });
  return app;
}

// export module
module.export = _initApp(express);
