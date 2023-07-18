import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User, { IUser, IUserModel } from "../models/User";
import log from "../libraries/Logger";
import bcryptjs from 'bcryptjs'
import { config } from "../config/config";

const signJWT = (user: IUserModel, refresh?: boolean): string => {
    if(refresh === undefined) refresh = true;
    log.warn(`Attempting signing ${!(refresh) ? 'access' : 'refresh'} token for ${user.username}...`);
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            roles: user.roles
        },
        (!refresh) ? config.jwt.access_token : config.jwt.refresh_token,
        {
            issuer: "reservaBytes",
            algorithm: 'HS256',
            expiresIn: (!refresh) ? '30s' : '5m'
        }
    );
};


const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;
    if (!username || ! password ) return res.sendStatus(400);
    User.findOne({username}).select("username").select("password").select("roles").then( user => {
        if(!user){
            log.error("Wrong credentials");
            return res.sendStatus(404);
        }
        bcryptjs.compare(password, user?.password, (error, success) => {
            if(error){
                log.error(error);
                return res.sendStatus(401);
            }
            if(success){
                const accessToken = signJWT(user, false);
                const refreshToken = signJWT(user);

                user.refreshToken = refreshToken;
                
                return user
                    .save()
                    .then(user => {
                        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 5 * 60 * 1000})
                        res.status(200).json({accessToken: accessToken });
                    })
                    .catch(err => res.status(500).json({err}));
            }else{
                log.error("Wrong credentials");
                return res.sendStatus(401);
            }
        })
    }).catch(err => res.status(500).json({error: err}));
}

const register = (req: Request, res: Response, next: NextFunction) => { 
    
}

const handleRefresh = (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    User.findOne({refreshToken}).select("_id").select("username").select("refreshToken").then( user => {
        if(!user) return res.sendStatus(404);
        jwt.verify(
            refreshToken,
            config.jwt.refresh_token,
            (err: any, decoded: any) => {
                if(err || user.username !== decoded.username) return res.sendStatus(403);
                const newAccessToken = signJWT(user, false);
                res.status(200).json({ accessToken: newAccessToken });
            }
        )
    }).catch(err => res.status(500).json({error: err}));
}

const logout = (req: Request, res: Response, next: NextFunction) => {
    //* On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    User.findOne({refreshToken}).select("refreshToken").then( user => {
        if(user){
            user.refreshToken = undefined;
            user.save().catch(err => res.status(500).json({err}));
        }
        res.clearCookie('jwt');
        return res.sendStatus(204);
    }).catch(err => res.status(500).json({error: err}));
}

export default { login, register, handleRefresh, logout };