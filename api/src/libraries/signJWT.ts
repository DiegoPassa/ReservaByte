import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import Logger from './Logger';
import { config } from '../config/config';

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
    Logger.warn(`Attempting signing token for ${user.username}...`);
    try{
        jwt.sign(
            {
                username: user.username,
                roles: user.roles
            },
            config.jwt.access_token,
            {
                issuer: "reservaBytes",
                algorithm: 'HS256',
                expiresIn: '120s'
            },
            (error, token) => {
                if(error){
                    callback(error, null);
                }else if (token){
                    Logger.success("Token signed successfully");
                    callback(null, token);
                }
            }
        );
    }catch(error: any){
        Logger.error(error);
        callback(error, null);
    }
};

export default signJWT;