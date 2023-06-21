import fs = require("fs");
import http = require('http');
import https = require('https');

import mongoose from "mongoose";
import express from "express";

import passport = require('passport');
import passportHTTP = require('passport-http');

import jsonwebtoken = require('jsonwebtoken');

declare global{
    namespace express{
        interface User{
            first_name: string,
            last_name: string
            roles: string[],
            id: string
        }
        interface Request{
            auth:{
                mail: string;
            }
        }
    }
}

const app = express();

app.get("/test", function (req, res) {
  res.send("SEZIONE SUPER SEGRETA");
});

app.get("/", function (req, res) {
  res.send("Home page");
});

mongoose.connect('mongodb://mean_mongo:27017')
.then(
    () => {
        console.log('connected to mongoDB');
    }
)

app.listen(3080, () => console.log('\nHTTP server UP & RUNNING\n'));
