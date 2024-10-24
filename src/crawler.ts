import Web3 from "web3";
import { Logger } from "@nestjs/common";
// Info: (20240111 - Gibbs) use prisma client to store raw data
// import { PrismaClient } from "@prisma/client";
import prisma from "./client";
import { crawlBlock } from "./crawl/block";
import { chainInfo } from "./lib/chain_info";

// const prisma = new PrismaClient();

class Crawler {
  private web3: Web3;
  private logger: Logger;
  constructor() {
    // Deprecated: check crawler init (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Crawler constructor");
    // Info: (20240111 - Gibbs) Connect to the iSunCoin node
    this.web3 = new Web3(chainInfo.rpc);
    this.logger = new Logger();
  }

  async start() {
    while (true) {
      try {
        // Info: (20240115 - Gibbs) conduct every 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.go();
      } catch (error) {
        // Deprecated: check crawler error (20240115 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("Crawler error:", error);
      }
    }
  }

  async go() {
    // Deprecated: check crawler start (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Crawler go");
    // Info: (20240115 - Gibbs) use prisma client to store raw data
    await crawlBlock(this.web3);
    // where chain id
    const dataCount = await prisma.block_raw.count({
      where: {
        chain_id: chainInfo.chainId,
      },
    });
    // Deprecated: check crawl block end (20231225 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("crawl block end, dataCount:", dataCount);
  }
}

export default Crawler;
