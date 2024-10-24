import { fetchCoinPrice } from './../api/coingecko';
import { fetchTokenPrice } from './../api/jupiter';

const MINT_ADDRESS = "69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs";

/*export const runBot = async () => {
    try {
        const price = await fetchCoinPrice();

        if (price !== null) {
            console.log(`Token price (USD): ${price}`);
            return price;
        } else {
            console.log("Token price not available.");
        }
    } catch (error) {
        console.log("Something went wrong");
    }
};*/

export const runBot = async () => {
    try {
        const price = await fetchTokenPrice(MINT_ADDRESS);

        if (price !== null) {
            console.log(`Token price(USD): ${price}`)
            return price;
        } else {
            console.log("Token price not available");
        }
    } catch (error) {
        console.log("Something went wrong");
    }
};
