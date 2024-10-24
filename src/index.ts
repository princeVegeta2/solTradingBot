import express from 'express';
import { runBot } from './bot/bot';

const app = express();
const PORT = 3000;  // You can set any port you want
let cachedPrice = "";  // Cached price starts as an empty string

// Set up the interval to call the bot every 260 seconds
setInterval(async () => {
    const newPriceString = await runBot();

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

}, 260000);

// Start the express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
