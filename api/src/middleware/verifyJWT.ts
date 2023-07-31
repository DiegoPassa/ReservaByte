import { Request, Response, NextFunction } from "express";
import log from "../libraries/Logger";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

function verifyAccessToken(req: Request, res: Response, next: NextFunction){
    log.warn("Validating token...");
    let token = req.headers.authorization?.split(' ')[1];
    if (token){
        jwt.verify(
            token, 
            config.jwt.access_token,
            (error, decoded: any) => {
                if(error){
                    return res.status(403).json({
                        message: error.message,
                        error
                    });
                }else{
                    log.success(`${decoded.username} succesfully authorized`);
                    res.locals.jwtRole = decoded.role;
                    next();
                }
        })
    }else{
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};

export default verifyAccessToken;