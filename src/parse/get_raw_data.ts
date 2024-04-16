// import { PrismaClient } from "@prisma/client";
import prisma from "../client";
// const prisma = new PrismaClient();

// get block_raw data
async function getBlockRawData(blockNumber: number) {
  const block = await prisma.block_raw.findUnique({
    where: { number: blockNumber },
  });
  return block;
}

// get transaction_raw data
async function getTransactionRawDatas(blockNumber: number) {
  const transactions = await prisma.transaction_raw.findMany({
    where: { block_number: blockNumber },
  });
  return transactions;
}

// get transaction_receipt_raw data
async function getTransactionReceiptRawDatas(blockNumber: number) {
  const transactionReceipts = await prisma.transaction_receipt_raw.findMany({
    where: { block_number: blockNumber },
  });
  return transactionReceipts;
}

export {
  getBlockRawData,
  getTransactionRawDatas,
  getTransactionReceiptRawDatas,
};
