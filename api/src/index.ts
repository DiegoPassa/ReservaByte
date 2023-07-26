import http = require("http");
import https = require("https");

import mongoose from "mongoose";
import express from "express";

import cors from "cors";
import cookieParser from 'cookie-parser';

import log from "./libraries/Logger";
import { config } from "./config/config";

import UserRoutes from './routes/User'
import MenuRoutes from './routes/Menu'
import TableRoutes from './routes/Table'
import OrderRoutes from './routes/Order'
import ReceiptRoutes from './routes/Receipt'
import verifyAccessToken from "./middleware/verifyJWT";
import AuthRoutes from "./routes/Auth";

mongoose.connect(config.mongo.url)
    .then(() => {
        console.log("");
        console.log(
        "ooooooooo.                                                               oooooooooo.                  .             \n",
        "`888   `Y88.                                                             `888'   `Y8b               .o8             \n",
        " 888   .d88'  .ooooo.   .oooo.o  .ooooo.  oooo d8b oooo    ooo  .oooo.    888     888 oooo    ooo .o888oo  .ooooo.  \n",
        " 888ooo88P'  d88' `88b d88(  \"8 d88' `88b `888\"\"8P  `88.  .8'  `P  )88b   888oooo888'  `88.  .8'    888   d88' `88b \n",
        " 888`88b.    888ooo888 `\"Y88b.  888ooo888  888       `88..8'    .oP\"888   888    `88b   `88..8'     888   888ooo888 \n",
        " 888  `88b.  888    .o o.  )88b 888    .o  888        `888'    d8(  888   888    .88P    `888'      888 . 888    .o \n",
        "o888o  o888o `Y8bod8P' 8\"\"888P' `Y8bod8P' d888b        `8'     `Y888\"\"8o o888bood8P'      .8'       \"888\" `Y8bod8P' \n",
        "                                                                                    .o..P'                        \n",
        "                                                                                    `Y8P'                         \n");
        log.success("Connected to mongoDB");
        startServer();
    })
    .catch(error => {
        log.error('Unable to connect to mongoDB');
        log.error(error);
});

const startServer = () => {

    const router = express();
    
    router.use(cors({credentials: true,}));

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
    router.use(cookieParser())

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
    router.use('/', AuthRoutes)
    router.use(verifyAccessToken);
    router.use('/users', UserRoutes);
    router.use('/menu', MenuRoutes);
    router.use('/tables', TableRoutes);
    router.use('/orders', OrderRoutes);
    router.use('/receipt', ReceiptRoutes);
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