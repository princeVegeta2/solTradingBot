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
exports.fetchCoinPrice = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config"); // Ensure this points to your configuration file
const MINT_ADDRESS = "69kdRLyP5DTRkpHraaSZAQbWmAwzF9guKjZfzMXzcbAs";
const fetchCoinPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const url = `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${MINT_ADDRESS}&vs_currencies=usd`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': config_1.config.COINGECKO_API_KEY // Use the API key from the environment variable
            }
        };
        // Using axios with the API key
        const response = yield axios_1.default.get(url, options);
        const fetchedTokenPrice = ((_a = response.data[MINT_ADDRESS]) === null || _a === void 0 ? void 0 : _a.usd) || null;
        const fullPrecisionPrice = fetchedTokenPrice.toString();
        return fullPrecisionPrice;
    }
    catch (error) {
        console.error("Error fetching price");
        return null;
    }
});
exports.fetchCoinPrice = fetchCoinPrice;
