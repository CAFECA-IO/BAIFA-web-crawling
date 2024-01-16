import {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
} from "./get_raw_data";

import { toBlocks, toContracts, toChains, toTransactions } from "./parsers";

// Info: (20240116 - Gibbs) put chainId here, iSunCloud
const chainId = 8017;
// Info: (20240116 - Gibbs) put chainName here, iSunCloud
const chainName = "iSunChain";

async function getDatasByBlockNumber(number: number, web3: any) {
  const block = await getBlockRawData(number);
  // Deprecated: check block (20240109 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("block:", block);
  const transactions = await getTransactionRawDatas(number);
  const transactionReceipts = await getTransactionReceiptRawDatas(number);
  await toBlocks(number, block, chainId);
  await toContracts(block, transactionReceipts, web3, chainId);
  await toChains(chainName, chainId);
  await toTransactions(transactions, block, transactionReceipts);
}

export { getDatasByBlockNumber };
