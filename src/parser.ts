import Web3 from "web3";
import { Logger } from "@nestjs/common";
import { parsing } from "./parse/parsing";

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

  async start() {
    try {
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

export default Parser;
