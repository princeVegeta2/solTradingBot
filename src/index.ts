import express from 'express';
import { runBot } from './bot/bot';
import { quoteResponse } from './api/jupiter';

const app = express();
const PORT = 3000;  // You can set any port you want
let cachedPrice = "";  // Cached price starts as an empty string

const inputMint = "69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs";
const outputMint = "So11111111111111111111111111111111111111112";
const amount = 1000000;
const slippageBps = 50;
/*
// Set up the interval to call the bot every 260 seconds
setInterval(async () => {
    const newPriceString = await runBot();
    const quoteResponseResult = await quoteResponse(inputMint, outputMint, amount, slippageBps);

    if (newPriceString !== null && cachedPrice !== "") {
        // Convert both cached and new price strings to numbers for comparison
        const newPrice = parseFloat(newPriceString);
        const cachedPriceNum = parseFloat(cachedPrice);

        // Compare the new price with the cached price
        if (newPrice > cachedPriceNum) {
            console.log(`New price (${newPrice}) is higher than cached price (${cachedPriceNum}). Updating cache.`);
            cachedPrice = newPriceString;  // Update the cached price as a string
        } else {
            console.log(`New price (${newPrice}) is not higher than cached price (${cachedPriceNum}). Keeping current cache.`);
        }
    } else if (newPriceString !== null && cachedPrice === "") {
        // Initialize the cache on the first run
        console.log(`Initializing cached price with ${newPriceString}`);
        cachedPrice = newPriceString;
    }

    console.log(quoteResponseResult);

}, 5000);
*/

setInterval(async () => {
    // Fetch the new price from Jupiter API using your runBot function
    const newPriceString = await runBot();

    if (newPriceString !== null && newPriceString !== undefined) {
        // Convert both cached and new price strings to numbers for comparison
        const newPrice = parseFloat(newPriceString);

        // Ensure cachedPrice is a valid string before parsing
        const cachedPriceNum = cachedPrice ? parseFloat(cachedPrice) : 0;

        // Compare the new price with the cached price
        if (cachedPrice === "" || newPrice > cachedPriceNum) {
            console.log(`New price (${newPrice}) is higher than cached price (${cachedPriceNum || 'none'}). Updating cache.`);
            cachedPrice = newPriceString;  // Update the cached price as a string

            /*SWAP*/
            const quoteResponseResult = await quoteResponse(inputMint, outputMint, amount, slippageBps);
            console.log(quoteResponseResult);

        } else {
            console.log(`New price (${newPrice}) is not higher than cached price (${cachedPriceNum}). Keeping current cache.`);
        }
    } else {
        console.log("Token price not available.");
    }

}, 5000);  // Set to your desired interval, here it's 260 seconds


// Start the express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
