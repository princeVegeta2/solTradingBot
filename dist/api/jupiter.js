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
exports.fetchTokenPrice = exports.quoteResponse = void 0;
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
const quoteResponse = (inputMint_1, outputMint_1, amount_1, ...args_1) => __awaiter(void 0, [inputMint_1, outputMint_1, amount_1, ...args_1], void 0, function* (inputMint, outputMint, amount, slippageBps = 50 // Default slippage of 0.5%
) {
    try {
        const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
        const response = yield (0, cross_fetch_1.default)(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
});
exports.quoteResponse = quoteResponse;
/**
 * Fetches the price of a token from the Jupiter API based on its mint address.
 *
 * @param tokenMint - The mint address of the token.
 * @returns The price of the token in USD.
 */
const fetchTokenPrice = (tokenMint) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const url = `https://api.jup.ag/price/v2?ids=${tokenMint}`;
        const response = yield (0, cross_fetch_1.default)(url, {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        const tokenPrice = ((_a = data === null || data === void 0 ? void 0 : data.data[tokenMint]) === null || _a === void 0 ? void 0 : _a.price) || null;
        return tokenPrice;
    }
    catch (error) {
        console.error('Error fetching token price:', error);
        return null;
    }
});
exports.fetchTokenPrice = fetchTokenPrice;
