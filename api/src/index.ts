import http = require("http");
import https = require("https");

import mongoose from "mongoose";
import express from "express";

import cors from "cors";

import passport = require("passport");
import passportHTTP = require("passport-http");

import log from "./libraries/Logger";
import { config } from "./config/config";

import UserRoutes from './routes/User'
import MenuRoutes from './routes/Menu'
import TableRoutes from './routes/Table'
import verifyJWT from "./middleware/verifyJWT";
import AuthController from "./controllers/AuthController";

const jwt = require("jsonwebtoken");

const router = express();

router.use(
    cors({
        credentials: true,
    })
);

mongoose.connect(config.mongo.url)
    .then(() => {
        console.log("--------------------------------------");
        log.success("Connected to mongoDB");
        startServer();
    })
    .catch(error => {
        log.error('Unable to connect to mongoDB');
        log.error(error);
    });

const startServer = () => {
    
    router.use((req, res, next) => {
        console.log("");
        log.info(`Incoming --- Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            log.info(`Incoming --- Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if (req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });
    
    /** PING */
    router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));
    /** ---- */

    /** ROUTES */
    router.post('/login', AuthController.login);
    router.post('/register', AuthController.register);

    router.use(verifyJWT);
    router.use('/users', UserRoutes);
    router.use('/menu', MenuRoutes);
    router.use('/tables', TableRoutes);
    /** ------ */


    router.use((req, res, next) => {
        const error = new Error('not found');
        log.error(error);
        return res.status(404).json({message: error.message});
    })

    // const server = http.createServer(router);
    http.createServer(router).listen(config.server.port, () => {
        log.success(`Server running on http://localhost:${config.server.port}/`);
    });
}