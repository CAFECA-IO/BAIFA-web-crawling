import { PrismaClient } from "@prisma/client";
import {
  getTransactionReceiptAndSave,
  getNumberOfTransactionReceiptsOfBlock,
  updateTransactionReceiptFinished,
} from "./receipts";

const prisma = new PrismaClient();

async function crawlTransactionAndReceipt(web3: any, blockNumber: number) {
  // Deprecated: print crawlTransaction blockNumber (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("crawlTransaction blockNumber:", blockNumber);
  // check transactionFinished true or false
  const transactionInfo = await getTransactionInfo(blockNumber);
  if (!transactionInfo.transaction_finished) {
    await getAndSaveTransactionAndReceiptData(
      web3,
      blockNumber,
      transactionInfo,
    );
  }
}

async function getAndSaveTransactionAndReceiptData(
  web3: any,
  blockNumber: number,
  transactionInfo: any,
) {
  // Get transactions in the block
  // Deprecated: print blockNumber (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("getAndSaveTransactionData blockNumber:", blockNumber);
  const block = await web3.eth.getBlock(blockNumber);
  // Deprecated: print block (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("block:", block);
  const transactions = block.transactions;
  // Deprecated: print all transactions hash of the block (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("transactions:", transactions);
  // save transactions
  if (transactions?.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      // Get the transaction details by transaction hash
      await getOneTransactionAndSave(web3, transactions[i]);
      // Get the transaction receipt details by transaction hash
      await getTransactionReceiptAndSave(web3, transactions[i]);
    }
    // check all transactions and receipts of the block saved
    const numberOfTransactionsOfBlock =
      await getNumberOfTransactions(blockNumber);
    if (
      numberOfTransactionsOfBlock === Number(transactionInfo.transaction_count)
    ) {
      // update transactionFinished true
      await updateTransactionFinished(blockNumber);
      // get numbers of transaction receipt of the block in database
      const numberOfTransactionReceiptsOfBlock =
        await getNumberOfTransactionReceiptsOfBlock(blockNumber);
      // update transactionReceiptFinished true
      if (
        numberOfTransactionReceiptsOfBlock ===
        Number(transactionInfo.transaction_count)
      ) {
        await updateTransactionReceiptFinished(blockNumber);
      }
    }
  } else {
    await updateTransactionFinished(blockNumber);
    await updateTransactionReceiptFinished(blockNumber);
  }
}

async function getTransactionInfo(blockNumber: number) {
  const transactionInfo = await prisma.block_raw.findUnique({
    where: { number: blockNumber },
    select: {
      transaction_finished: true,
      transaction_count: true,
      transaction_receipt_finished: true,
    },
  });
  // Deprecated: print transactionInfo of the block in db (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("transactionInfo:", transactionInfo);
  return transactionInfo;
}

async function getOneTransactionAndSave(web3: any, transactionHash: string) {
  const transaction = await web3.eth.getTransaction(transactionHash);
  // Deprecated: print one transaction data by hash (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("transaction:", transaction);
  // check if the transaction hash exists in the database
  const existingTransaction = await prisma.transaction_raw.findUnique({
    where: { hash: transactionHash },
  });
  if (!existingTransaction) {
    // use prisma client to store raw data
    const data = {
      block_number: Number(transaction.blockNumber),
      hash: transaction.hash.toString(),
      nonce: transaction.nonce.toString(),
      block_hash: transaction.blockHash.toString(),
      transaction_index: transaction.transactionIndex.toString(),
      from: transaction.from.toString(),
      to: transaction?.to?.toString() || "null",
      value: transaction.value.toString(),
      gas: transaction.gas.toString(),
      gas_price: transaction.gasPrice.toString(),
      input: transaction.input,
      v: transaction.v.toString(),
      r: transaction.r.toString(),
      s: transaction.s.toString(),
      max_fee_per_gas: transaction.maxFeePerGas.toString(),
      max_priority_fee_per_gas: transaction.maxPriorityFeePerGas.toString(),
      type: transaction.type.toString(),
      access_list: JSON.stringify(transaction.accessList),
      chain_id: transaction.chainId.toString(),
    };
    // Deprecated: print need-to-save transaction (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("data:", data);
    // save transaction
    await prisma.transaction_raw.create({
      data,
    });
    // Deprecated:  check transaction saved (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("transaction saved");
  }
}

async function getNumberOfTransactions(blockNumber: number) {
  const numberOfTransactionsOfBlock = await prisma.transaction_raw.count({
    where: { block_number: blockNumber },
  });
  // Deprecated: print numberOfTransactionsOfBlock (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("numberOfTransactionsOfBlock:", numberOfTransactionsOfBlock);
  return numberOfTransactionsOfBlock;
}

async function updateTransactionFinished(blockNumber: number) {
  try {
    await prisma.block_raw.update({
      where: { number: blockNumber },
      data: { transaction_finished: true },
    });
    // Deprecated:  check update transaction_finished (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("update transaction_finished: true");
  } catch (error) {
    // Deprecated:  check check update transaction_finished (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("updateTransactionFinished error:", error);
  }
}

export { crawlTransactionAndReceipt };
