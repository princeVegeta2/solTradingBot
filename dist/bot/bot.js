"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBot = void 0;
const jupiter_1 = require("./../api/jupiter");
const MINT_ADDRESS = "AwcCFuJgUYNYHXm6tHhr7DsXDY6FKvXUt2DFjmgHpump";
const runBot = async () => {
    try {
        const price = await (0, jupiter_1.fetchTokenPrice)(MINT_ADDRESS);
        if (price !== null) {
            console.log(`Token price(USD): ${price}`);
            return price;
        }
        else {
            console.log("Token price not available");
        }
    }
    catch (error) {
        console.log("Something went wrong");
    }
};
exports.runBot = runBot;
