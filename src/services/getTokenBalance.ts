import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Fetches the token balance of a wallet for a specific token.
 *
 * @param connection - The Solana connection object.
 * @param walletPublicKey - The public key of the wallet.
 * @param tokenMint - The mint address of the token.
 * @returns The token balance (in the smallest unit).
 */
export const getTokenBalance = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  tokenMint: string
): Promise<number> => {
  try {
    const tokenMintPublicKey = new PublicKey(tokenMint);

    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getTokenAccountsByOwner(walletPublicKey, {
      mint: tokenMintPublicKey,
    });

    // Find the token balance from the first account (there might be multiple accounts)
    if (tokenAccounts.value.length > 0) {
      const balanceInfo = await connection.getTokenAccountBalance(tokenAccounts.value[0].pubkey);
      return parseInt(balanceInfo.value.amount); // Balance in smallest unit (e.g., lamports for SOL)
    } else {
      console.log('No token accounts found for this mint.');
      return 0; // No balance
    }
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return 0; // Return 0 on error
  }
};
