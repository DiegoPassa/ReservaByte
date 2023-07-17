import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import log from "../libraries/Logger";
import bcryptjs from 'bcryptjs'
import signJWT from "../libraries/signJWT";

const login = (req: Request, res: Response, next: NextFunction) => {  
    let { username, password } = req.body;
    User.findOne({username}).select("username").select("password").select("roles").then( user => {
        if(!user){
            return res.sendStatus(401);
        }
        bcryptjs.compare(password, user?.password, (error, result) => {
            if(error){
                log.error(error);
                return res.sendStatus(401);
            }
            if(result){
                signJWT(user, (_error, token) => {
                    if( _error ){
                        log.error("Unable to sign token");
                        return res.sendStatus(401);
                    }
                    return res.status(200).json({
                        message: "Auth successfull",
                        token,
                        user: user.username
                    });
                })
            }else{
                return res.sendStatus(401);
            }
        })
    }).catch(err => res.sendStatus(500));
}

const register = (req: Request, res: Response, next: NextFunction) => { 
    
}

export default { login, register };