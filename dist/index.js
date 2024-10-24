"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_1 = require("./bot/bot");
const jupiter_1 = require("./api/jupiter");
const app = (0, express_1.default)();
const PORT = 3000; // You can set any port you want
let cachedPrice = ""; // Cached price starts as an empty string
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
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the new price from Jupiter API using your runBot function
    const newPriceString = yield (0, bot_1.runBot)();
    if (newPriceString !== null && newPriceString !== undefined) {
        // Convert both cached and new price strings to numbers for comparison
        const newPrice = parseFloat(newPriceString);
        // Ensure cachedPrice is a valid string before parsing
        const cachedPriceNum = cachedPrice ? parseFloat(cachedPrice) : 0;
        // Compare the new price with the cached price
        if (cachedPrice === "" || newPrice > cachedPriceNum) {
            console.log(`New price (${newPrice}) is higher than cached price (${cachedPriceNum || 'none'}). Updating cache.`);
            cachedPrice = newPriceString; // Update the cached price as a string
            /*SWAP*/
            const quoteResponseResult = yield (0, jupiter_1.quoteResponse)(inputMint, outputMint, amount, slippageBps);
            console.log(quoteResponseResult);
        }
        else {
            console.log(`New price (${newPrice}) is not higher than cached price (${cachedPriceNum}). Keeping current cache.`);
        }
    }
    else {
        console.log("Token price not available.");
    }
}), 5000); // Set to your desired interval, here it's 260 seconds
// Start the express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
