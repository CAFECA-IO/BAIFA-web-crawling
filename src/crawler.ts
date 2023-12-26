import Web3 from 'web3';
import { Logger } from '@nestjs/common';

class Crawler {
  private web3: Web3;
  private logger: Logger;
  constructor() {
    console.log('Crawler constructor');
    // Connect to the iSunCoin node
    this.web3 = new Web3('https://isuncoin.baifa.io/');
    this.logger = new Logger();
  }

  start() {
    this.go();
  }

  async go() {
    console.log('Crawler go');
    // Get the latest block number
    const latestBlockNumber = await this.web3.eth.getBlockNumber();
    this.logger.log(`Latest Block Number: ${latestBlockNumber}`);

    // Get the block details by block number
    const getBlockByNumber = await this.web3.eth.getBlock(31726);
    this.logger.log('getBlockByNumber:', getBlockByNumber);

    // Get the transaction details by transaction hash
    const getTransactionByHash = await this.web3.eth.getTransaction(
      getBlockByNumber.transactions[0].toString(),
    );
    this.logger.log('getTransactionByHash:', getTransactionByHash);

    // Get the transaction receipt by transaction hash
    const getTransactionReceipt = await this.web3.eth.getTransactionReceipt(
      getTransactionByHash.hash,
    );
    this.logger.log('getTransactionReceipt:', getTransactionReceipt);

    // recursive call
    this.go();
  }
}

export default Crawler;
