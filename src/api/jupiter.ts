import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { Wallet } from '@project-serum/anchor';
import bs58 from 'bs58';
import { config } from '../config/config';

// RPC endpoint
const connection = new Connection(config.QUICKNODE_ENDPOINT);

// Wallet
const wallet = new Wallet(
  Keypair.fromSecretKey(bs58.decode(config.WALLET_PRIVATE_KEY))
);

/**
 * Fetches a quote from Jupiter API for swapping between two tokens.
 *
 * @param inputMint - The mint address of the input token.
 * @param outputMint - The mint address of the output token.
 * @param amount - The amount of the input token in its smallest unit (e.g., lamports for SOL).
 * @param slippageBps - The maximum slippage in basis points (bps).
 * @returns The quote response from Jupiter API.
 */
export const quoteResponse = async (
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50 // Default slippage of 0.5%
): Promise<any> => {
  try {
    const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

/**
 * Fetches the price of a token from the Jupiter API based on its mint address.
 *
 * @param tokenMint - The mint address of the token.
 * @returns The price of the token in USD.
 */
export const fetchTokenPrice = async (tokenMint: string): Promise<string | null> => {
  try {
    const url = `https://api.jup.ag/price/v2?ids=${tokenMint}`;

    const response = await fetch(url, {
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
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
};

/**
 * Performs a swap using the quote data from quoteResponse function
 *
 * @param quoteResponseResult - The mint address of the token.
 * @returns The price of the token in USD.
 */
export const jupiterSwap = async (quoteResponseResult: object): Promise<string | null> => {
  try {
    // Step 1: Get the serialized swap transaction from Jupiter API
    const swapUrl = "https://quote-api.jup.ag/v6/swap";
    const swapResponse = await fetch(swapUrl, {
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
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    console.log('Transaction deserialized:', transaction);

    // Step 3: Sign the transaction
    transaction.sign([wallet.payer]);

    // Step 4: Get the latest blockhash for transaction confirmation
    const latestBlockHash = await connection.getLatestBlockhash();

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

  } catch (error) {
    console.error('Error performing swap:', error);
    return null; // Return null if the swap failed
  }
};
