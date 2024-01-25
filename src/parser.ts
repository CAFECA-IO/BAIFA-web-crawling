import Web3 from "web3";
import { Logger } from "@nestjs/common";
import { parsing } from "./parse/parsing";
import { toChains } from "./parse/parsers";

const chainData = {
  chain_id: 8017,
  chain_name: "iSunChain",
  symbol: "ISC",
  decimals: 18,
  rpc: "https://isuncoin.baifa.io/",
  chain_icon: "/currencies/isun.svg",
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
      await toChains(chainData);
      while (true) {
        // Info: (20240118 - Gibbs) conduct every 5 seconds
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.go();
      }
    } catch (error) {
      // Deprecated: check parser error (20240118 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("Parser error:", error);
    }
  }

  async go() {
    // Deprecated: check crawler start (20240104 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("Parser go");
    await parsing(this.web3);
  }
}

export { chainData };
export default Parser;
