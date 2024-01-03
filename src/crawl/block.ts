import { PrismaClient } from "@prisma/client";
import { crawlTransactionAndReceipt } from "./transactions";

const prisma = new PrismaClient();

async function crawlBlock(web3: any) {
  // Get the latest block number

  // const latestBlockNumber = Number(await web3.eth.getBlockNumber());
  // test
  const latestBlockNumber = Number(79829);
  // Deprecated: print latestBlockNumber (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("latestBlockNumber:", latestBlockNumber);
  // get bigEnd and smallEnd from block table
  const blockNumbers = await prisma.block.findMany({
    select: { number: true },
    orderBy: { number: "desc" },
  });
  // Deprecated: print blockNumbers (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("blockNumbers:", blockNumbers);

  //test
  const bigEnd = 79820;
  const smallEnd = 79815;
  // const bigEnd = blockNumbers[0]?.number || -1;
  // const smallEnd = blockNumbers[blockNumbers.length - 1]?.number || -1;
  // Deprecated: print bigEnd and smallEnd (20231225 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("bigEnd:", bigEnd, "smallEnd:", smallEnd);

  // get block from bigEnd to latest block
  if (latestBlockNumber > bigEnd) {
    for (let i = bigEnd + 1; i <= latestBlockNumber; i++) {
      // check if block exist
      const existingBlock = await checkBlockExisting(i);
      if (!existingBlock) {
        await saveBlock(web3, i);
        await crawlTransactionAndReceipt(web3, i);
      }
    }
  }
  // get block from smallEnd to block 0
  if (smallEnd > 0) {
    for (let i = smallEnd - 1; i >= 79810; i--) {
      // Deprecated: print every block number from smallEnd to zero (20231225 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("smallerToZero:", i);
      // check if block exist
      const existingBlock = await checkBlockExisting(i);
      if (!existingBlock) {
        await saveBlock(web3, i);
        await crawlTransactionAndReceipt(web3, i);
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
    uncles: block.uncles.toString(),
    transaction_count: block.transactions?.length || 0,
    transaction_finished: false,
    transaction_receipt_finished: false,
  };
  // use prisma client to store block
  await prisma.block.create({
    data,
  });
}

async function checkBlockExisting(blockNumber: number) {
  const existingBlock = await prisma.block.findUnique({
    where: { number: blockNumber },
  });
  return existingBlock;
}

export { crawlBlock };
