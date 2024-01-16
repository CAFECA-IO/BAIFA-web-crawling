import Web3 from "web3";
import { Logger } from "@nestjs/common";
import { getDatasByBlockNumber } from "./parse/parsing";

class Parser {
  private web3: Web3;
  private logger: Logger;
  constructor() {
    this.web3 = new Web3("https://isuncoin.baifa.io/");
    // Deprecated: check crawler init (20240104 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Parser constructor");
    this.logger = new Logger();
  }

  start() {
    this.go();
    // conduct every 5 seconds
    setInterval(() => {
      this.go();
    }, 5000);
  }

  async go() {
    // Deprecated: check crawler start (20240104 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Parser go");
    // test
    await getDatasByBlockNumber(190353, this.web3);
    // Deprecated: check crawl block end (20240104 - Gibbs)
    // eslint-disable-next-line no-console
    // console.log(
    //   "block data:",
    //   datas.block,
    //   "transaction data:",
    //   datas.transactions,
    //   "transactionReceipt data:",
    //   datas.transactionReceipts,
    // );
  }
}

export default Parser;
