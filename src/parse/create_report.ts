import { timeStamp } from "console";
require("events").EventEmitter.defaultMaxListeners = 15;
const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const { report } = require("process");
const prisma = new PrismaClient();
const provider = new ethers.providers.JsonRpcProvider(
  `https://isuncoin.baifa.io`,
);
const contractABIPath = path.resolve(
  __dirname,
  "../../../../src/services/blockchain/artifacts/artifacts/src/services/blockchain/contracts/router.sol/RouterContract.json",
);

const contractABI = JSON.parse(fs.readFileSync(contractABIPath, "utf8"));
const routerContractAddress = process.argv[4];
console.log("routerContractAddress", routerContractAddress);
const contractInstance = new ethers.Contract(
  routerContractAddress,
  contractABI.abi,
  provider,
);

const reports = contractInstance;

async function getContractValue(reportName, reportType, reportColumn) {
  try {
    const value = await reports.getValue(reportName, reportType, reportColumn);
    console.log("value", value);

    formattedValue = ethers.utils.formatUnits(value, 18);

    return formattedValue;
  } catch (error) {
    console.error(error);
  }
}
