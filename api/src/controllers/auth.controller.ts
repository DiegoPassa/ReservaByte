import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { IUserModel, User } from "../models/User";
import log from "../libraries/Logger";
import bcrypt from 'bcrypt'
import { config } from "../config/config";

const signJWT = (user: IUserModel, refresh?: boolean): string => {
    if(refresh === undefined) refresh = true;
    log.warn(`Attempting signing ${!(refresh) ? 'access' : 'refresh'} token for ${user.username}...`);
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            role: user.role
        },
        (!refresh) ? config.jwt.access_token : config.jwt.refresh_token,
        {
            issuer: "reservaBytes",
            algorithm: 'HS256',
            expiresIn: (!refresh) ? '30m' : '3h'
        }
    );
};


const login = async (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;
    if (!username || !password ) return res.sendStatus(400);
    try {
        const user = await User.findOne({username}, 'username password role');
        if (!user) return res.sendStatus(404);
        const result = await bcrypt.compare(password, user.password);
        if (!result) return res.sendStatus(401); 
        const accessToken = signJWT(user, false);
        const refreshToken = signJWT(user);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
        return res.status(200).json({ accessToken: accessToken });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

const register = (req: Request, res: Response, next: NextFunction) => { 
    
}

const handleRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    try {
        const user = await User.findOne({refreshToken}, 'username refreshToken role');
        if(!user) return res.sendStatus(404);
        const jwtDecoded = jwt.verify(refreshToken, config.jwt.refresh_token);
        const newAccessToken = signJWT(user, false);
        return res.status(200).json({ data: jwtDecoded, accessToken: newAccessToken });
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    //* On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    try {
        await User.findOneAndUpdate({refreshToken}, {
            $unset: { refreshToken }
        });
        res.clearCookie('jwt');
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({error: error});
    }
    
}

export default { login, register, handleRefresh, logout };