// import { PrismaClient } from "@prisma/client";
import { CHAIN_INFO } from "src/constants/chain_info";
import prisma from "../client";
// const prisma = new PrismaClient();

// get block_raw data
async function getBlockRawData(blockNumber: number) {
  const block = await prisma.block_raw.findFirst({
    where: { number: blockNumber, chain_id: CHAIN_INFO.chain_id },
  });
  return block;
}

// get transaction_raw data
async function getTransactionRawDatas(blockNumber: number) {
  const chain_id = CHAIN_INFO.chain_id.toString();
  const transactions = await prisma.transaction_raw.findMany({
    where: { block_number: blockNumber, chain_id: chain_id },
  });
  return transactions;
}

// get transaction_receipt_raw data
async function getTransactionReceiptRawDatas(blockNumber: number) {
  const transactionReceipts = await prisma.transaction_receipt_raw.findMany({
    where: { block_number: blockNumber, chain_id: CHAIN_INFO.chain_id },
  });
  return transactionReceipts;
}

export {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
};
