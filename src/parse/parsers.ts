import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// parse to blocks table
async function toBlocks(number: number, block: any, transactions: any[]) {
  const parsedBlock = {
    chain_id: Number(transactions[0].chain_id),
    symbol: "ISC",
    burnt_fees: 0,
    created_timestamp: new Date(block.timestamp * 1000),
    miner: block.miner,
    reward: (
      Number(block.base_fee_per_gas) * Number(block.gas_used) +
      10 ** 18
    ).toString(),
    size: Number(block.size),
    transaction_count: block.transaction_count,
    parent_hash: block.parent_hash,
    number: Number(block.number),
    hash: block.hash,
  };
  // check if data exist
  const existingBlock = await prisma.blocks.findUnique({
    where: { number: number },
  });
  if (!existingBlock) {
    await prisma.blocks.create({
      data: parsedBlock,
    });
  }
  // Deprecated: check parse to blocks table success (20240105 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to blocks table success", parsedBlock);
}

// parse to contracts table
async function toContracts(
  block: any,
  transactions: any[],
  transactionReceipts: any[],
  web3: any,
) {
  // check every transactionReceipts of the block
  for (let i = 0; i < transactionReceipts.length; i++) {
    const contractAddress = transactionReceipts[i].contract_address;
    // check if data exist
    if (contractAddress !== "null") {
      const existingContract = await prisma.contracts.findFirst({
        where: { contract_address: contractAddress },
      });
      if (!existingContract) {
        // get contract
        // const contract = new web3.eth.Contract([], contractAddress);
        // const abi = contract.options.jsonInterface;
        const parsedContract = {
          // to do
          // parse transactionReceipts log:
          // events: nft, erc20, create contract, call contract
          chain_id: Number(transactions[0].chain_id),
          contract_address: contractAddress,
          creator_address: transactionReceipts[i].from,
          created_timestamp: new Date(block.timestamp * 1000),
          source_code: await web3.eth.getCode(contractAddress),
        };
        await prisma.contracts.create({
          data: parsedContract,
        });
        // Deprecated: check parse to contracts table success (20240109 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("parsedContract", parsedContract);
      }
    }
  }
  // Deprecated: check parse to contracts table success (20240105 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to contracts table success");
}

// parse to chains table
async function toChains(transactions: any, chain_name: string) {
  // check if chain exist
  const chain_id = Number(transactions[0].chain_id);
  const existingChain = await prisma.chains.findFirst({
    where: { id: chain_id },
  });
  if (!existingChain) {
    const parsedChain = {
      id: chain_id,
      chain_name: chain_name,
      chain_icon: null,
    };
    // create chain
    await prisma.chains.create({
      data: parsedChain,
    });
    // Deprecated: check parse to chains table success (20240109 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parsedChain", parsedChain);
  }
  // Deprecated: check parse to chains table success (20240109 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to chains table success");
}

export { toBlocks, toContracts, toChains };
