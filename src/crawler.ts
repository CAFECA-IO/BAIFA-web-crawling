import Web3 from "web3";
import { Logger } from "@nestjs/common";
// Info: (20240111 - Gibbs) use prisma client to store raw data
import { PrismaClient } from "@prisma/client";
import { crawlBlock } from "./crawl/block";

const prisma = new PrismaClient();

class Crawler {
  private web3: Web3;
  private logger: Logger;
  constructor() {
    // Deprecated: check crawler init (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Crawler constructor");
    // Connect to the iSunCoin node
    this.web3 = new Web3("https://isuncoin.baifa.io/");
    this.logger = new Logger();
  }

  start() {
    this.go();
    // Info: (20240111 - Gibbs) use prisma client to store raw data
    setInterval(() => {
      this.go();
    }, 5000);
  }

  async go() {
    // Deprecated: check crawler start (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Crawler go");
    await crawlBlock(this.web3);
    const dataCount = await prisma.block_raw.count();
    // Deprecated: check crawl block end (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("crawl block end, dataCount:", dataCount);
  }
}

export default Crawler;
