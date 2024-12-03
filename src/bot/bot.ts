import { fetchTokenPrice } from './../api/jupiter';

const MINT_ADDRESS = "AwcCFuJgUYNYHXm6tHhr7DsXDY6FKvXUt2DFjmgHpump";


export const runBot = async () => {
    try {
        const price = await fetchTokenPrice(MINT_ADDRESS);

        if (price !== null) {
            console.log(`Token price(USD): ${price}`)
            return price;
        } else {
            console.log("Token price not available");
        }
    } catch (error) {
        console.log("Something went wrong");
    }
};
