// import { PrismaClient } from "@prisma/client";
import prisma from "../client_crawl";
import { crawlTransactionAndReceipt } from "./transactions";

// const prisma = new PrismaClient();

// import fs from "fs";
import { promises as fs } from "fs";
import * as path from "node:path";
const errorLogPath = path.join(process.cwd(), "errorBlocks.log");

async function crawlBlock(web3: any) {
  // Get the latest block number
  const latestBlockNumber = Number(await web3.eth.getBlockNumber());
  // test
  // const latestBlockNumber = 9999999;
  // Deprecated: print latestBlockNumber (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("latestBlockNumber:", latestBlockNumber);
  // get bigEnd and smallEnd from block_raw table
  const blockNumbers = await prisma.block_raw.findMany({
    select: { number: true },
    orderBy: { number: "desc" },
  });
  // Deprecated: print blockNumbers (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("blockNumbers:", blockNumbers);

  //test
  // const bigEnd = 9999999;
  // const smallEnd = 9999999;
  const bigEnd = blockNumbers[0]?.number || -1;
  const smallEnd = blockNumbers[blockNumbers.length - 1]?.number || -1;
  // Deprecated: print bigEnd and smallEnd (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("bigEnd:", bigEnd, "smallEnd:", smallEnd);

  // (old) get block from bigEnd to latest block
  /*
  if (latestBlockNumber > bigEnd) {
    for (let i = bigEnd + 1; i <= latestBlockNumber; i++) {
      // check if block exist
      const existingBlock = await checkBlockExisting(i);
      if (!existingBlock) {
        try {
          // using transaction to pack saveBlock and crawlTransactionAndReceipt function
          await prisma.$transaction(
            async () => {
              await saveBlock(web3, i);
              await crawlTransactionAndReceipt(web3, i);
            },
            // info: (20240319 - Gibbs) set transaction timeout to 5 minutes
            { timeout: 1000 * 60 * 5 },
          );
        } catch (error) {
          // Deprecated: print error block number (20240305 - Gibbs)
          // eslint-disable-next-line no-console
          console.log("crawling error block number:", i, error);
          continue;
        }
      }
    }
  }

  // (old) get block from smallEnd to block 0
  if (smallEnd > 0) {
    for (let i = smallEnd - 1; i >= 0; i--) {
      // check if block exist
      const existingBlock = await checkBlockExisting(i);
      if (!existingBlock) {
        try {
          // using transaction to pack saveBlock and crawlTransactionAndReceipt function
          await prisma.$transaction(
            async () => {
              await saveBlock(web3, i);
              await crawlTransactionAndReceipt(web3, i);
            },
            // info: (20240319 - Gibbs) set transaction timeout to 5 minutes
            { timeout: 1000 * 60 * 5 },
          );
        } catch (error) {
          // Deprecated: print error block number (20240305 - Gibbs)
          // eslint-disable-next-line no-console
          console.log("crawling error block number:", i, error);
          continue;
        }
      }
    }
  }
  */
  // (new) get block from bigEnd to latest block
  if (latestBlockNumber > bigEnd) {
    for (let i = bigEnd + 1; i <= latestBlockNumber; i++) {
      // check if block exist
      const existingBlock = await checkBlockExisting(i);
      if (!existingBlock) {
        let attempts = 0;
        let errorOccurred = false;
        while (attempts < 3) {
          try {
            // using transaction to pack saveBlock and crawlTransactionAndReceipt function
            await prisma.$transaction(
              async () => {
                await saveBlock(web3, i);
                await crawlTransactionAndReceipt(web3, i);
              },
              // set transaction timeout to 10 minutes
              { timeout: 1000 * 60 * 10 },
            );
            break; // if success, break the loop
          } catch (error) {
            attempts++;
            errorOccurred = true; // record error occurred
          }
        }
        if (errorOccurred && attempts >= 3) {
          try {
            // if error occurred and attempts >= 3, write the error block number to error log
            await fs.appendFile(errorLogPath, `爬取錯誤的區塊號碼: ${i}\n`);
            // Deprecated: print error block number (20240328 - Gibbs)
            // eslint-disable-next-line no-console
            console.log(`爬取錯誤的區塊號碼: ${i}`);
          } catch (error) {
            console.error(
              `寫入 errorLogPath 錯誤, 爬取錯誤的區塊號碼: ${i}, 錯誤: ${error}`,
            );
          }
        }
        // if (errorOccurred && attempts >= 3) {
        //   // if error occurred and attempts >= 3, write the error block number to error log
        //   fs.appendFileSync(errorLogPath, `爬取錯誤的區塊號碼: ${i}\n`);
        //   // Deprecated: print error block number (20240328 - Gibbs)
        //   // eslint-disable-next-line no-console
        //   console.log(`爬取錯誤的區塊號碼: ${i}`);
        // }
      }
    }
  }

  // (new) get block from smallEnd to block 0
  if (smallEnd > 0) {
    for (let i = smallEnd - 1; i >= 0; i--) {
      // check if block exist
      const existingBlock = await checkBlockExisting(i);
      if (!existingBlock) {
        let attempts = 0;
        let errorOccurred = false;
        while (attempts < 3) {
          try {
            // using transaction to pack saveBlock and crawlTransactionAndReceipt function
            await prisma.$transaction(
              async () => {
                await saveBlock(web3, i);
                await crawlTransactionAndReceipt(web3, i);
              },
              // set transaction timeout to 10 minutes
              { timeout: 1000 * 60 * 10 },
            );
            break; // if success, break the loop
          } catch (error) {
            attempts++;
            errorOccurred = true; // record error occurred
          }
        }
        if (errorOccurred && attempts >= 3) {
          // if error occurred and attempts >= 3, write the error block number to error log
          fs.appendFileSync(errorLogPath, `爬取錯誤的區塊號碼: ${i}\n`);
          // Deprecated: print error block number (20240328 - Gibbs)
          // eslint-disable-next-line no-console
          console.log(`爬取錯誤的區塊號碼: ${i}`);
        }
      }
    }
  }
}

async function saveBlock(web3: any, i: number) {
  // Get the block details by block number
  const block = await web3.eth.getBlock(i);
  const data = {
    base_fee_per_gas: block.baseFeePerGas.toString(),
    number: Number(block.number),
    hash: block.hash.toString(),
    parent_hash: block.parentHash.toString(),
    nonce: block.nonce.toString(),
    sha3_uncles: block.sha3Uncles.toString(),
    logs_bloom: block.logsBloom.toString(),
    transactions_root: block.transactionsRoot.toString(),
    state_root: block.stateRoot.toString(),
    miner: block.miner.toString(),
    difficulty: block.difficulty.toString(),
    total_difficulty: block.totalDifficulty.toString(),
    extra_data: block.extraData.toString(),
    size: block.size.toString(),
    gas_limit: block.gasLimit.toString(),
    gas_used: block.gasUsed.toString(),
    timestamp: block.timestamp.toString(),
    mix_hash: block.mixHash.toString(),
    receipts_root: block.receiptsRoot.toString(),
    uncles: block.uncles,
    transaction_count: block.transactions?.length || 0,
    transaction_finished: false,
    transaction_receipt_finished: false,
    burnt_fees: 0,
  };
  // use prisma client to store block
  // eslint-disable-next-line no-console
  console.log("block.number:", block.number);
  await prisma.block_raw.create({
    data,
  });
}

async function checkBlockExisting(blockNumber: number) {
  const existingBlock = await prisma.block_raw.findUnique({
    where: { number: blockNumber },
  });
  return existingBlock;
}

export { crawlBlock };
