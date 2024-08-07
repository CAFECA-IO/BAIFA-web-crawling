import Web3 from "web3";
import { Logger } from "@nestjs/common";
import { parsing } from "./parse/parsing";
import { toChains, toCodes } from "./parse/parsers";
import codesData from "./parse/codes";
import { chainInfo } from "./lib/chain_info";

const chainData = {
  chain_id: chainInfo.chainId,
  chain_name: chainInfo.chainName,
  symbol: chainInfo.symbol,
  decimals: chainInfo.decimal,
  rpc: chainInfo.rpc,
};

class Parser {
  private web3: Web3;
  private logger: Logger;
  constructor() {
    this.web3 = new Web3(chainData.rpc);
    // Deprecated: check crawler init (20240104 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Parser constructor");
    this.logger = new Logger();
  }

  async start() {
    try {
      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await this.go();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("捕捉到錯誤:", error, "crash後pm2重啟");
      throw error;
    }
  }

  async go() {
    // 故意引發一個錯誤來測試錯誤處理機制
    throw new Error("這是一個測試錯誤");
  }

  //原本
  //   async start() {
  //   try {
  //     await toChains(chainData);
  //     await toCodes(codesData);
  //     while (true) {
  //       // Info: (20240118 - Gibbs) conduct every 5 seconds
  //       await new Promise((resolve) => setTimeout(resolve, 5000));
  //       await this.go();
  //     }
  //   } catch (error) {
  //     // Deprecated: check parser error (20240118 - Gibbs)
  //     // eslint-disable-next-line no-console
  //     console.log("Parser error:", error);
  //     throw error;
  //   }
  // }

  // async go() {
  //   // Deprecated: check crawler start (20240104 - Gibbs)
  //   // eslint-disable-next-line no-console
  //   console.log("Parser go");
  //   await parsing(this.web3);
  // }
}

export { chainData };
export default Parser;
