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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBot = void 0;
const coingecko_1 = require("./../api/coingecko");
const runBot = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const price = yield (0, coingecko_1.fetchCoinPrice)();
        if (price !== null) {
            console.log(`Token price (USD): ${price}`);
            return price;
        }
        else {
            console.log("Token price not available.");
        }
    }
    catch (error) {
        console.log("Something went wrong");
    }
});
exports.runBot = runBot;