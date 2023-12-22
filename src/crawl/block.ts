import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function crawlBlock(web3: any) {
  // Get the latest block number

  // const latestBlockNumber = Number(await this.web3.eth.getBlockNumber());
  // test
  const latestBlockNumber = Number(31726);

  console.log("latestBlockNumber:", latestBlockNumber);
  // get bigEnd and smallEnd from block table
  const blockNumbers = await prisma.block.findMany({
    select: { number: true },
    orderBy: { number: "desc" },
  });
  console.log("blockNumbers:", blockNumbers);

  // const bigEnd = Number(blockNumbers[0].number);
  // const smallEnd = Number(blockNumbers[blockNumbers.length - 1].number);
  // console.log('bigEnd:', bigEnd, 'smallEnd:', smallEnd);
  //test
  const bigEnd = blockNumbers[0]?.number || latestBlockNumber;
  const smallEnd = blockNumbers[blockNumbers.length - 1]?.number || latestBlockNumber;
  console.log("bigEnd:", bigEnd, "smallEnd:", smallEnd);

  // get block from bigEnd to latest block
  if (latestBlockNumber > bigEnd) {
    for (let i = bigEnd + 1; i <= latestBlockNumber; i++) {
      // console.log('biggerToLatest:', i);
      await saveBlock(web3, i);
    }
  }
  // get block from smallEnd to block 0
  if (smallEnd > 0) {
    for (let i = smallEnd - 1; i >= 0; i--) {
      // console.log('smallerToZero:', i);
      await saveBlock(web3, i);
    }
  }
}

async function saveBlock(web3: any, i: number) {
  // Get the block details by block number
  const block = await web3.eth.getBlock(i);
  const data = {
    baseFeePerGas: block.baseFeePerGas.toString(),
    number: Number(block.number),
    hash: block.hash.toString(),
    parentHash: block.parentHash.toString(),
    nonce: block.nonce.toString(),
    sha3Uncles: block.sha3Uncles.toString(),
    logsBloom: block.logsBloom.toString(),
    transactionsRoot: block.transactionsRoot.toString(),
    stateRoot: block.stateRoot.toString(),
    miner: block.miner.toString(),
    difficulty: block.difficulty.toString(),
    totalDifficulty: block.totalDifficulty.toString(),
    extraData: block.extraData.toString(),
    size: block.size.toString(),
    gasLimit: block.gasLimit.toString(),
    gasUsed: block.gasUsed.toString(),
    timestamp: block.timestamp.toString(),
    mixHash: block.mixHash.toString(),
    receiptsRoot: block.receiptsRoot.toString(),
    uncles: block.uncles.toString(),
    transactionCount: block.transactions?.length || 0,
    transactionFinished: false,
    transactionReceiptFinished: false,
  };
  await prisma.block.create({
    data,
  });
}

export { crawlBlock };
