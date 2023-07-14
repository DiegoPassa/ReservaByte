import { Request, Response, NextFunction } from "express";

const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyJWT(req: Request, res: Response, next: NextFunction){
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.sendStatus(401);
    console.log(authHeader);
    const token = authHeader.split(' ', 1);
    // jwt.verify(
    //     token,
    //     process.env.ACCESS_TOKEN_SECRET,
    //     (err, decoded) => {
    //         if (err) return res.sendStatus(403);
    //         req.user = decoded.user;
    //         next();
    //     }
    // );
};

module.exports = verifyJWT;