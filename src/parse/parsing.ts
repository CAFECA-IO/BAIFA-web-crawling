import {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
} from "./get_raw_data";

import { toBlocks, toContracts } from "./parsers";

async function getDatasByBlockNumber(number: number, web3: any) {
  const block = await getBlockRawData(number);
  // Deprecated: check block (20240109 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("block:", block);
  const transactions = await getTransactionRawDatas(number);
  const transactionReceipts = await getTransactionReceiptRawDatas(number);
  await toBlocks(number, block, transactions);
  await toContracts(block, transactions, transactionReceipts, web3);
}

export { getDatasByBlockNumber };
