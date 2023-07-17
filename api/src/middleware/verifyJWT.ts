import { Request, Response, NextFunction } from "express";
import log from "../libraries/Logger";
import { config } from "../config/config";
import jwt from "jsonwebtoken";
import { UserRole } from "../models/User";

interface JWTPayload{
    username: string,
    roles: UserRole[],
    iat: number,
    exp: number,
    iss: string
}

function verifyJWT(req: Request, res: Response, next: NextFunction){
    log.warn("Validating token...");
    let token = req.headers.authorization?.split(' ')[1];
    if (token){
        jwt.verify(token, config.jwt.access_token, (error, decoded: any) => {
            if(error){
                return res.status(404).json({
                    message: error.message,
                    error
                });
            }else{
                // const payload = decoded as JWTPayload;
                log.success(`${decoded.username} succesfully authorized`);
                res.locals.jwtRoles = decoded.roles;
                next();
            }
        })
    }else{
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
};

export default verifyJWT;