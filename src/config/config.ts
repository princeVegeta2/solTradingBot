import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
    QUICKNODE_ENDPOINT: process.env.QUICKNODE_ENDPOINT || '',
    WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY || '',
    // other configurations...
};
