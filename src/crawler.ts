import Web3 from "web3";
import { Logger } from "@nestjs/common";
// use prisma client to store raw data
import { PrismaClient } from "@prisma/client";
import { crawlBlock } from "./crawl/block";

const prisma = new PrismaClient();

class Crawler {
  private web3: Web3;
  private logger: Logger;
  constructor() {
    console.log("Crawler constructor");
    // Connect to the iSunCoin node
    this.web3 = new Web3("https://isuncoin.baifa.io/");
    this.logger = new Logger();
  }

  start() {
    this.go();
  }

  async go() {
    console.log("Crawler go");
    await crawlBlock(this.web3);
    const dataCount = await prisma.block.count();
    console.log("crawl block end, dataCount:", dataCount);
    /*
    this.logger.log(`Latest Block Number: ${latestBlockNumber}`);
    // Get all block number in block table in descending order
    const blockNumbers = await prisma.block.findMany({
      select: { number: true },
      orderBy: { number: 'desc' },
    });
    // Get current biggest block number in the database
    const currentBiggestBlockNumber = blockNumbers[0];
    // Get to latest block
    if (currentBiggestBlockNumber.number === latestBlockNumber) {
      this.logger.log('Already at latest block');
      return;
    } else {
      for (
        let i = currentBiggestBlockNumber.number + 1;
        i <= latestBlockNumber;
        i++
      ) {
        // Get the block details by block number
        const getBlockByNumber = await this.web3.eth.getBlock(i);
        this.logger.log('getBlockByNumber:', getBlockByNumber);
        // check if the block number exists in the database
        const existingBlock = await prisma.block.findUnique({
          where: { number: i },
        });
        // use prisma client to store raw data
        if (existingBlock) {
          this.logger.log(
            `Block ${existingBlock.number} already exists in the database`,
          );
        } else {
          await prisma.block.create({
            data: {
              baseFeePerGas: getBlockByNumber.baseFeePerGas.toString(),
              number: Number(getBlockByNumber.number),
              hash: getBlockByNumber.hash.toString(),
              parentHash: getBlockByNumber.parentHash.toString(),
              nonce: getBlockByNumber.nonce.toString(),
              sha3Uncles: getBlockByNumber.sha3Uncles.toString(),
              logsBloom: getBlockByNumber.logsBloom.toString(),
              transactionsRoot: getBlockByNumber.transactionsRoot.toString(),
              stateRoot: getBlockByNumber.stateRoot.toString(),
              miner: getBlockByNumber.miner.toString(),
              difficulty: getBlockByNumber.difficulty.toString(),
              totalDifficulty: getBlockByNumber.totalDifficulty.toString(),
              extraData: getBlockByNumber.extraData.toString(),
              size: getBlockByNumber.size.toString(),
              gasLimit: getBlockByNumber.gasLimit.toString(),
              gasUsed: getBlockByNumber.gasUsed.toString(),
              timestamp: getBlockByNumber.timestamp.toString(),
              mixHash: getBlockByNumber.mixHash.toString(),
              receiptsRoot: getBlockByNumber.receiptsRoot.toString(),
              uncles: getBlockByNumber.uncles.toString(),
            },
          });
        }
      }
    }
    
    // Get the transaction details by transaction hash
    const getTransactionByHash = await this.web3.eth.getTransaction(
      getBlockByNumber.transactions[0].toString(),
    );
    this.logger.log('getTransactionByHash:', getTransactionByHash);
    // check if the transaction hash exists in the database
    const existingTransaction = await prisma.transaction.findUnique({
      where: { hash: getTransactionByHash.hash.toString() },
    });
    if (existingTransaction) {
      this.logger.log(
        `Transaction ${existingTransaction.hash} already exists in the database`,
      );
    } else {
      // use prisma client to store raw data
      let gasPrice, v, maxFeePerGas, maxPriorityFeePerGas, accessList;
      if ('gasPrice' in getTransactionByHash) {
        gasPrice = getTransactionByHash.gasPrice.toString();
      }
      if ('v' in getTransactionByHash) {
        v = getTransactionByHash.v.toString();
      }
      if ('maxFeePerGas' in getTransactionByHash) {
        maxFeePerGas = getTransactionByHash.maxFeePerGas.toString();
      }
      if ('maxPriorityFeePerGas' in getTransactionByHash) {
        maxPriorityFeePerGas =
          getTransactionByHash.maxPriorityFeePerGas.toString();
      }
      if ('accessList' in getTransactionByHash) {
        accessList = getTransactionByHash.accessList.toString();
      }
      await prisma.transaction.create({
        data: {
          blockNumber: Number(getTransactionByHash.blockNumber),
          hash: getTransactionByHash.hash.toString(),
          nonce: getTransactionByHash.nonce.toString(),
          blockHash: getTransactionByHash.blockHash.toString(),
          transactionIndex: getTransactionByHash.transactionIndex.toString(),
          from: getTransactionByHash.from.toString(),
          to: getTransactionByHash.to.toString(),
          value: getTransactionByHash.value.toString(),
          gas: getTransactionByHash.gas.toString(),
          gasPrice,
          input: getTransactionByHash.input,
          v,
          r: getTransactionByHash.r.toString(),
          s: getTransactionByHash.s.toString(),
          maxFeePerGas,
          maxPriorityFeePerGas,
          type: getTransactionByHash.type.toString(),
          accessList,
          chainId: getTransactionByHash.chainId.toString(),
        },
      });
    }
    // Get the transaction receipt by transaction hash
    const getTransactionReceipt = await this.web3.eth.getTransactionReceipt(
      getTransactionByHash.hash,
    );
    this.logger.log('getTransactionReceipt:', getTransactionReceipt);
    // check if the transaction receipt exists in the database
    const existingTransactionReceipt =
      await prisma.transactionReceipt.findUnique({
        where: {
          transactionHash: getTransactionReceipt.transactionHash.toString(),
        },
      });
    if (existingTransactionReceipt) {
      this.logger.log(
        `Transaction Receipt ${existingTransactionReceipt.transactionHash} already exists in the database`,
      );
    } else {
      // use prisma client to store raw data
      await prisma.transactionReceipt.create({
        data: {
          blockNumber: Number(getTransactionReceipt.blockNumber),
          blockHash: getTransactionReceipt.blockHash.toString(),
          transactionHash: getTransactionReceipt.transactionHash.toString(),
          transactionIndex: getTransactionReceipt.transactionIndex.toString(),
          from: getTransactionReceipt.from.toString(),
          to: getTransactionReceipt.to.toString(),
          cumulativeGasUsed: getTransactionReceipt.cumulativeGasUsed.toString(),
          gasUsed: getTransactionReceipt.gasUsed.toString(),
          contractAddress:
            getTransactionReceipt.contractAddress?.toString() ?? 'null',
          logs: getTransactionReceipt.logs.toString(),
          logsBloom: getTransactionReceipt.logsBloom.toString(),
          status: getTransactionReceipt.status.toString(),
          type: getTransactionReceipt.type.toString(),
          effectiveGasPrice: getTransactionReceipt.effectiveGasPrice.toString(),
        },
      });
    }
    // recursive call
    this.go();
  }
  */
  }
}

export default Crawler;
