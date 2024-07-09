export const chainInfo = {
  chainId: Number(process.env.CHAIN_ID) || 8017,
  chainName: process.env.CHAIN_NAME || "iSunCoin",
  symbol: process.env.SYMBOL || "ISC",
  decimal: Number(process.env.DECIMAL) || 18,
  rpc: process.env.RPC || "https://isuncoin.baifa.io/",
};
