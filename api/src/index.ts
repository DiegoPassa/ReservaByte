import fs = require("fs");
import http = require("http");
import https = require("https");

import mongoose from "mongoose";
import express from "express";

import cors from "cors";

import passport = require("passport");
import passportHTTP = require("passport-http");

import jsonwebtoken = require("jsonwebtoken");
import chalk from "chalk";

// require('dotenv').config();
import 'dotenv/config' // ES6

const PORT = process.env.PORT || 5000;

declare global {
  namespace express {
    interface User {
      first_name: string;
      last_name: string;
      roles: string[];
      id: string;
    }
    interface Request {
      auth: {
        mail: string;
      };
    }
  }
}

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.get("/test", function (req, res) {
  res.send("SEZIONE SUPER SEGRETA");
  // const token = await jsonwebtoken.sign({
  //   test: "test"
  // }, "password", {
  //   expiresIn: 36000
  // });

  // res.json({
  //   token
  // });
});

app.get("/", function (req, res) {
  res.send("Home page");
});

mongoose.connect("mongodb://mean_mongo:27017").then(() => {
  console.log(`Connected to ${chalk.green('mongoDB')}`);
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log(`Server running on ${chalk.blue('http://localhost:' + PORT + '/')}`);
});
