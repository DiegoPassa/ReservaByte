import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ' ';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ' ';
const SERVER_PORT = process.env.SERVER_PORT;

// TODO Add some other meaningful data, like: access_token duration etc...

export const config = {
    mongo: {
        url: "mongodb://mean_mongo:27017/ReservaByte"
    },
    server: {
        port: SERVER_PORT
    },
    jwt: {
        access_token: ACCESS_TOKEN_SECRET,
        refresh_token: REFRESH_TOKEN_SECRET
    }
}