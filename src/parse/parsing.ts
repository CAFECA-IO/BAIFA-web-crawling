import {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
} from "./get_raw_data";

import { toBlocks, toContracts, toChains, toTransactions } from "./parsers";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Info: (20240116 - Gibbs) put chainId here, iSunCloud
const chainId = 8017;
// Info: (20240116 - Gibbs) put chainName here, iSunCloud
const chainName = "iSunChain";

async function parseDatasByBlockNumber(number: number, web3: any) {
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

async function parsing(web3: any) {
  /* Info: (20240118 - Gibbs) use block number to record process
    1. get startBlockNumber: max block number of prisma.blocks or first time: 0
    2. get endBlockNumber: latest block number of prisma.block_raw
    3. get datas from startBlockNumber to endBlockNumber
    4. error: record error block number
    */
  const startBlockNumber =
    (
      await prisma.blocks.findFirst({
        select: { number: true },
        orderBy: { number: "desc" },
      })
    )?.number || 0;
  // console.log("startBlockNumber:", startBlockNumber);
  const endBlockNumber = (
    await prisma.block_raw.findFirst({
      select: { number: true },
      orderBy: { number: "desc" },
    })
  ).number;
  // console.log("endBlockNumber:", endBlockNumber);
  for (let i = startBlockNumber; i <= endBlockNumber; i++) {
    try {
      await parseDatasByBlockNumber(i, web3);
      // Deprecated: print block number of parse datas (20240118 - Gibbs)
      // eslint-disable-next-line no-console
      console.log(`parse datas by block number: ${i} success`);
    } catch (error) {
      // Deprecated: print error block number (20240118 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("error block number:", i, error);
    }
  }

  // test
  // await getDatasByBlockNumber(190353, this.web3);
}

export { parsing };
