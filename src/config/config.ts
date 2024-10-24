import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
    // other configurations...
};
