"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bot_1 = require("./bot/bot");
const jupiter_1 = require("./api/jupiter");
const getTokenBalance_1 = require("./services/getTokenBalance");
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@project-serum/anchor");
const bs58_1 = __importDefault(require("bs58"));
const config_1 = require("./config/config");
const app = (0, express_1.default)();
const PORT = 3000; // You can set any port you want
let cachedPrice = 0.0; // Cached price starts as an empty string
let selling = false;
// RPC endpoint
const connection = new web3_js_1.Connection(config_1.config.QUICKNODE_ENDPOINT);
// Wallet
const wallet = new anchor_1.Wallet(web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(config_1.config.WALLET_PRIVATE_KEY)));
const walletPublicKey = wallet.publicKey; // Extract the PublicKey
const solMint = "So11111111111111111111111111111111111111112";
const tokenMint = "AwcCFuJgUYNYHXm6tHhr7DsXDY6FKvXUt2DFjmgHpump";
const amountSol = 100000000; // Amount of SOL to trade
const slippageBps = 50; // Slippage in basis points
const getAndSetTokenBalance = async () => {
    try {
        const balance = await (0, getTokenBalance_1.getTokenBalance)(connection, walletPublicKey, tokenMint);
        console.log(`Token balance: ${balance}`);
        return balance;
    }
    catch (error) {
        console.error('Error fetching token balance:', error);
        return 0;
    }
};
// Interval logic
setInterval(async () => {
    try {
        // Fetch the new price from Jupiter API
        const newPriceString = await (0, bot_1.runBot)();
        if (selling) {
            if (newPriceString !== null && newPriceString !== undefined) {
                cachedPrice = parseFloat(newPriceString);
                // Compare the new price with the cached price
                if (cachedPrice >= 0.0025) {
                    console.log("Price went over 0.0025, setting up a sale");
                    // Fetch the token balance
                    const amountToken = await getAndSetTokenBalance();
                    if (amountToken > 0) {
                        // Perform the quote response and swap
                        const quoteResponseResult = await (0, jupiter_1.quoteResponse)(tokenMint, solMint, amountToken, slippageBps);
                        console.log("Sale setup complete:", quoteResponseResult);
                        selling = false;
                    }
                    else {
                        console.log("Insufficient token balance for sale.");
                    }
                }
            }
            else {
                console.log("Token price not available.");
            }
        }
        else {
            // Buying logic
            if (!selling && newPriceString !== null && newPriceString !== undefined) {
                cachedPrice = parseFloat(newPriceString);
                if (cachedPrice <= 0.0021) {
                    console.log("Price went under 0.0020, setting up a buy");
                    // Perform the quote response and swap
                    const quoteResponseResult = await (0, jupiter_1.quoteResponse)(solMint, tokenMint, amountSol, slippageBps);
                    console.log("Buy setup complete:", quoteResponseResult);
                    // Perform the swap using jupiterSwap
                    const txid = await (0, jupiter_1.jupiterSwap)(quoteResponseResult);
                    if (txid) {
                        console.log(`Buy transaction successful! TXID: ${txid}`);
                        selling = true; // Set the state to selling after a successful purchase
                    }
                    else {
                        console.log("Buy transaction failed.");
                    }
                    selling = true;
                }
            }
            else {
                console.log("Token price not available.");
            }
        }
    }
    catch (error) {
        console.error("Error in trading logic:", error);
    }
}, 60000); // Run every 1 minutes
// Start the express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
