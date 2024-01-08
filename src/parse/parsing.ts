import { PrismaClient } from "@prisma/client";
import {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
} from "./get_raw_data";

const prisma = new PrismaClient();

async function getDatasByBlockNumber(number: number) {
  const block = await getBlockRawData(number);
  console.log("block:", block);
  const transactions = await getTransactionRawDatas(number);
  const transactionReceipts = await getTransactionReceiptRawDatas(number);
  await toBlocks(number, block, transactions);
}

// parse to blocks table
async function toBlocks(number: number, block: any, transactions: any[]) {
  const parsedBlock = {
    chain_id: Number(transactions[0].chain_id),
    symbol: "ISC",
    burnt_fees: 0,
    created_timestamp: new Date(block.timestamp * 1000),
    miner: block.miner,
    reward: (
      Number(block.base_fee_per_gas) * Number(block.gas_used) +
      (10 ^ 18)
    ).toString(),
    size: Number(block.size),
    transaction_count: block.transaction_count,
    parent_hash: block.parent_hash,
    number: Number(block.number),
    hash: block.hash,
  };
  // check if data exist
  const existingBlock = await prisma.blocks.findUnique({
    where: { number: number },
  });
  if (!existingBlock) {
    await prisma.blocks.create({
      data: parsedBlock,
    });
  }
  // Deprecated: check parse to blocks table success (20240105 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to blocks table success", parsedBlock);
}

export { getDatasByBlockNumber };
