import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { IUserModel, User } from "../models/User";
import log from "../libraries/Logger";
import bcrypt from 'bcrypt'
import { config } from "../config/config";

const signJWT = (user: IUserModel, refresh: boolean = true): string => {
    log.warn(`Attempting signing ${!(refresh) ? 'access' : 'refresh'} token for ${user.username}...`);
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        (!refresh) ? config.jwt.access_token : config.jwt.refresh_token,
        {
            issuer: "reservaByte",
            algorithm: 'HS256',
            expiresIn: (!refresh) ? '5s' : '10h'
        }
    );
};


const login = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;
    if (!username || !password ) return res.sendStatus(400);
    try {
        const user = await User.findOne({username});
        if (!user) return res.sendStatus(404);
        const result = await bcrypt.compare(password, user.password);
        if (!result) return res.sendStatus(401); 
        const refreshToken = signJWT(user);
        const accessToken = signJWT(user, false);
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 10 * 60 * 60 * 1000});
        const response = { accessToken: accessToken, user: { username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, id: user.id } }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const register = (req: Request, res: Response, next: NextFunction) => { 
    
}

const refresh = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const userId = JSON.parse(atob(refreshToken.split('.')[1])).id;
    try {
        const user = await User.findById(userId);
        if(!user) return res.sendStatus(404);
        jwt.verify(refreshToken, config.jwt.refresh_token);
        const newAccessToken = signJWT(user, false);
        const response = { accessToken: newAccessToken, user: { username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, id: user.id } }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    //* On client, also delete the accessToken
    const cookies = req.cookies;
    if (cookies.jwt) res.clearCookie('jwt');
    return res.sendStatus(204);
}

export default { login, register, refresh, logout };