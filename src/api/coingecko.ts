import axios from 'axios';
import { config } from '../config/config';  // Ensure this points to your configuration file

const MINT_ADDRESS = "69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs";

export const fetchCoinPrice = async () => {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${MINT_ADDRESS}&vs_currencies=usd`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': config.COINGECKO_API_KEY  // Use the API key from the environment variable
            }
        };

        // Using axios with the API key
        const response = await axios.get(url, options);
        const fetchedTokenPrice = response.data[MINT_ADDRESS]?.usd || null;

        const fullPrecisionPrice = fetchedTokenPrice.toString();

        return fullPrecisionPrice;
    } catch (error) {
        console.error("Error fetching price");
        return null;
    }
};
