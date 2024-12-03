"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jupiterSwap = exports.fetchTokenPrice = exports.quoteResponse = void 0;
const web3_js_1 = require("@solana/web3.js");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const anchor_1 = require("@project-serum/anchor");
const bs58_1 = __importDefault(require("bs58"));
const config_1 = require("../config/config");
// RPC endpoint
const connection = new web3_js_1.Connection(config_1.config.QUICKNODE_ENDPOINT);
// Wallet
const wallet = new anchor_1.Wallet(web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(config_1.config.WALLET_PRIVATE_KEY)));
/**
 * Fetches a quote from Jupiter API for swapping between two tokens.
 *
 * @param inputMint - The mint address of the input token.
 * @param outputMint - The mint address of the output token.
 * @param amount - The amount of the input token in its smallest unit (e.g., lamports for SOL).
 * @param slippageBps - The maximum slippage in basis points (bps).
 * @returns The quote response from Jupiter API.
 */
const quoteResponse = async (inputMint, outputMint, amount, slippageBps = 50) => {
    try {
        const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
        console.log("Requesting Jupiter API with URL:", url); // Debugging
        const response = await (0, cross_fetch_1.default)(url);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Response error body:", errorBody); // Log error response
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching quote:", error);
        throw error;
    }
};
exports.quoteResponse = quoteResponse;
/**
 * Fetches the price of a token from the Jupiter API based on its mint address.
 *
 * @param tokenMint - The mint address of the token.
 * @returns The price of the token in USD.
 */
const fetchTokenPrice = async (tokenMint) => {
    try {
        const url = `https://api.jup.ag/price/v2?ids=${tokenMint}`;
        const response = await (0, cross_fetch_1.default)(url, {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const tokenPrice = data?.data[tokenMint]?.price || null;
        return tokenPrice;
    }
    catch (error) {
        console.error('Error fetching token price:', error);
        return null;
    }
};
exports.fetchTokenPrice = fetchTokenPrice;
/**
 * Performs a swap using the quote data from quoteResponse function
 *
 * @param quoteResponseResult - The mint address of the token.
 * @returns The price of the token in USD.
 */
const jupiterSwap = async (quoteResponseResult) => {
    try {
        // Step 1: Get the serialized swap transaction from Jupiter API
        const swapUrl = "https://quote-api.jup.ag/v6/swap";
        const swapResponse = await (0, cross_fetch_1.default)(swapUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse: quoteResponseResult,
                userPublicKey: wallet.publicKey.toString(),
                wrapAndUnwrapSol: true
            })
        });
        if (!swapResponse.ok) {
            throw new Error(`HTTP error! Status: ${swapResponse.status}`);
        }
        const { swapTransaction } = await swapResponse.json();
        // Step 2: Deserialize the transaction from base64
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        let transaction = web3_js_1.VersionedTransaction.deserialize(swapTransactionBuf);
        console.log('Transaction deserialized:', transaction);
        // Step 3: Sign the transaction
        transaction.sign([wallet.payer]);
        // Step 4: Get the latest blockhash for transaction confirmation
        const latestBlockHash = await connection.getLatestBlockhash();
        transaction.message.recentBlockhash = latestBlockHash.blockhash;
        // Step 5: Serialize and send the transaction
        const rawTransaction = transaction.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
        });
        // Step 6: Confirm the transaction
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid
        });
        console.log(`Transaction successful: https://solscan.io/tx/${txid}`);
        return txid; // Return the transaction ID on success
    }
    catch (error) {
        console.error('Error performing swap:', error);
        return null; // Return null if the swap failed
    }
};
exports.jupiterSwap = jupiterSwap;
