import { fetchCoinPrice } from './../api/coingecko';

export const runBot = async () => {
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
};
