import {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
} from "./get_raw_data";

import {
  toBlocks,
  toContracts,
  toTransactions,
  updateTotalAmount,
} from "./parsers";

import { PrismaClient } from "@prisma/client";

// import chainData
import { chainData } from "../parser";

const prisma = new PrismaClient();

async function parseDatasByBlockNumber(number: number, web3: any) {
  const block = await getBlockRawData(number);
  // Deprecated: check block (20240109 - Gibbs)
  // eslint-disable-next-line no-console
  // console.log("block:", block);
  const transactions = await getTransactionRawDatas(number);
  // console.log("transactions:", transactions);
  const transactionReceipts = await getTransactionReceiptRawDatas(number);
  // console.log("transactionReceipts:", transactionReceipts);
  const parsedBlock = await toBlocks(
    number,
    block,
    chainData.chain_id,
    chainData,
    web3,
  );
  await toContracts(block, transactionReceipts, web3, chainData.chain_id);
  await toTransactions(transactions, block, transactionReceipts, web3);
  // update total amount for 原生幣種 in currencies table after parsing each block
  await updateTotalAmount(parsedBlock);
  // Deprecated: print block number of parse datas (20240131 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse datas by block number:", number, "success");
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
  console.log("startBlockNumber:", startBlockNumber);
  const endBlockNumber = (
    await prisma.block_raw.findFirst({
      select: { number: true },
      orderBy: { number: "desc" },
    })
  ).number;
  console.log("endBlockNumber:", endBlockNumber);
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
  // await parseDatasByBlockNumber(4576, web3);
}

export { parsing };
