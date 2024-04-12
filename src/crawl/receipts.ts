// import { PrismaClient } from "@prisma/client";
import prisma from "../client";
// const prisma = new PrismaClient();

async function getTransactionReceiptAndSave(
  web3: any,
  transactionHash: string,
) {
  // check if the transaction receipt exists in the database
  const existingTransactionReceipt =
    await prisma.transaction_receipt_raw.findUnique({
      where: { transaction_hash: transactionHash },
    });
  if (!existingTransactionReceipt) {
    // Get the transaction receipt by transaction hash
    const transactionReceipt =
      await web3.eth.getTransactionReceipt(transactionHash);
    const data = {
      transaction_hash: transactionReceipt.transactionHash.toString(),
      transaction_index: transactionReceipt.transactionIndex.toString(),
      block_hash: transactionReceipt.blockHash.toString(),
      block_number: Number(transactionReceipt.blockNumber),
      from: transactionReceipt.from.toString(),
      to: transactionReceipt.to?.toString() || "null",
      cumulative_gas_used: transactionReceipt.cumulativeGasUsed.toString(),
      gas_used: transactionReceipt.gasUsed.toString(),
      contract_address:
        transactionReceipt.contractAddress?.toString() || "null",
      logs: transactionReceipt.logs,
      logs_bloom: transactionReceipt.logsBloom.toString(),
      status: transactionReceipt.status.toString(),
      type: transactionReceipt.type.toString(),
      effective_gas_price: transactionReceipt.effectiveGasPrice.toString(),
    };
    // use prisma client to store transaction receipt
    await prisma.transaction_receipt_raw.create({
      data,
    });
    // Deprecated:  check transactionReceipt saved (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("transactionReceipt saved");
  }
}

async function getNumberOfTransactionReceiptsOfBlock(blockNumber: number) {
  const numberOfTransactionReceiptsOfBlock =
    await prisma.transaction_receipt_raw.count({
      where: { block_number: blockNumber },
    });
  return numberOfTransactionReceiptsOfBlock;
}

async function updateTransactionReceiptFinished(blockNumber: number) {
  try {
    await prisma.block_raw.update({
      where: { number: blockNumber },
      data: { transaction_receipt_finished: true },
    });
    // Deprecated: print updateTransactionReceiptFinished (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("update transaction_receipt_finished: true");
  } catch (error) {
    // Deprecated: print error (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("update transaction_receipt_finished error:", error);
  }
}

export {
  getTransactionReceiptAndSave,
  getNumberOfTransactionReceiptsOfBlock,
  updateTransactionReceiptFinished,
};
