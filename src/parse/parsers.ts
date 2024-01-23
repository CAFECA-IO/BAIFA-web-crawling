import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// parse to blocks table
async function toBlocks(number: number, block: any, chainId: number) {
  const parsedBlock = {
    chain_id: chainId,
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
  transactionReceipts: any[],
  web3: any,
  chainId: number,
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
          chain_id: chainId,
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
async function toChains(chain_name: string, chainId: number) {
  // check if chain exist
  const existingChain = await prisma.chains.findFirst({
    where: { id: chainId },
  });
  if (!existingChain) {
    const parsedChain = {
      id: chainId,
      chain_name: chain_name,
      chain_icon: "/currencies/isun.svg",
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

async function toTransactions(
  transactions: any[],
  block: any,
  transactionReceipts: any[],
) {
  if (transactions?.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const transactionReceipt = transactionReceipts[i];
      // check if transaction exist
      const existingTransaction = await prisma.transactions.findFirst({
        where: { hash: transaction.hash },
      });
      if (!existingTransaction) {
        const parsedTransaction = {
          chain_id: Number(transaction.chain_id),
          created_timestamp: new Date(block.timestamp * 1000),
          hash: transaction.hash,
          type: await type(transaction, transactionReceipt),
          // 0 pending, 1 success, 2 fail
          status: "1",
          block_hash: transaction.block_hash,
          from_address: transaction.from,
          to_address: transaction.to,
          evidence_id: await evidenceId(transaction, transactionReceipt, block),
          value: Number(transaction.value),
          fee: Number(transaction.gas) * Number(transaction.gas_price),
          // Info: (20240115 - Gibbs) transaction 裡的 from, to 及 receipt logs裡的每個 address, 不重複
          related_addresses: [
            ...new Set([
              transaction.from,
              transaction?.to,
              ...transactionReceipt.logs?.map((log) => log.address),
            ]),
          ],
        };
        // Deprecated: check parsedTransaction data (20240115 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("parsedTransaction", parsedTransaction);
        await prisma.transactions.create({
          data: parsedTransaction,
        });
        // Deprecated: check parse to transactions table success (20240109 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("parsedTransaction success! hash:", parsedTransaction.hash);
        await toAddresses(parsedTransaction);
        const parsedTokenTransfer = await toTokenTransfers(
          parsedTransaction,
          transaction,
          transactionReceipt,
        );
        await toTokenBalances(parsedTokenTransfer);
        await toCurrencies(parsedTokenTransfer);
      }
    }
  }
}

// different type of transaction
async function type(transaction: any, transactionReceipt: any) {
  /* Info: (20240112 - Gibbs)
  0	Normal
  1	Create contract
  2	ERC-20
  3	NFT
  4	Evidence
    */
  // create contract
  if (transactionReceipt.contract_address !== "null") {
    return "1";
    // normal transaction
  } else if (transaction.input === "0x") {
    return "0";
    // ERC20 transfer
  } else if (transaction.input.substring(0, 10) === "0xa9059cbb") {
    return "2";
    // ERC721 transferFrom
  } else if (transaction.input.substring(0, 10) === "0x23b872dd") {
    return "3";
    // evidence
    // 0xb6aca21a test:0x60806040
  } else if (transaction.input.substring(0, 10) === "0xb6aca21a") {
    return "4";
  } else {
    return "99";
  }
}

// create evidence id
async function evidenceId(
  transaction: any,
  transactionReceipt: any,
  block: any,
) {
  // check if transaction is evidence
  // 0xb6aca21a test:0x60806040
  if (transaction.input?.substring(0, 10) === "0xb6aca21a") {
    if (transactionReceipt.logs.length > 0) {
      const parsedReceiptLogs = transactionReceipt.logs;
      // Deprecated: check parsedReceiptLogs data (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("parsedReceiptLogs", parsedReceiptLogs);
      // get evidence id
      const evidenceId =
        parsedReceiptLogs[0].address.substring(2) +
        parsedReceiptLogs[0].topics[3].substring(26);
      // Deprecated: check evidenceId data (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("evidenceId:", evidenceId);
      await toEvidences(transaction, transactionReceipt, evidenceId, block);
      return evidenceId;
    } else {
      return;
    }
  }
}

// parse to evidences table
async function toEvidences(
  transaction: any,
  transactionReceipt: any,
  evidenceId: string,
  block: any,
) {
  // check if evidence id exist
  const existingEvidence = await prisma.evidences.findFirst({
    where: { evidence_id: evidenceId },
  });
  if (!existingEvidence) {
    const parsedEvidence = {
      // to do
      // parse transactionReceipts log:
      // events: nft, erc20, create contract, call contract
      evidence_id: evidenceId,
      chain_id: Number(transaction.chain_id),
      created_timestamp: new Date(block.timestamp * 1000),
      contract_address: "0x" + evidenceId.substring(0, 40),
      state: "public",
      content: "a json content",
      creator_address: transactionReceipt.from,
      token_id: evidenceId.substring(40),
    };
    await prisma.evidences.create({
      data: parsedEvidence,
    });
    // Deprecated: check parse to evidences table success (20240115 - Gibbs)
    // eslint-disable-next-line no-console
    console.log(
      "parse to evidences table success",
      "parsedEvidence",
      parsedEvidence,
    );
  }
}

// parse to addresses table
async function toAddresses(parsedTransaction: any) {
  // check if address exist
  const address = parsedTransaction.from_address;
  const existingAddress = await prisma.addresses.findFirst({
    where: { address: address },
  });
  if (!existingAddress) {
    const parsedAddress = {
      chain_id: parsedTransaction.chain_id,
      created_timestamp: parsedTransaction.created_timestamp,
      address: address,
      score: 60,
      latest_active_time: parsedTransaction.created_timestamp,
    };
    await prisma.addresses.create({
      data: parsedAddress,
    });
    // Deprecated: check parse to addresses table success (20240116 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parse to addresses table success", parsedAddress);
  } else {
    // update latest_active_time
    if (
      existingAddress.latest_active_time < parsedTransaction.created_timestamp
    ) {
      await prisma.addresses.update({
        where: { address: address },
        data: { latest_active_time: parsedTransaction.created_timestamp },
      });
      // Deprecated: check update latest_active_time success (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("update address latest_active_time success");
    }
    // update created_timestamp
    if (
      existingAddress.created_timestamp > parsedTransaction.created_timestamp
    ) {
      await prisma.addresses.update({
        where: { address: address },
        data: { created_timestamp: parsedTransaction.created_timestamp },
      });
      // Deprecated: check update created_timestamp success (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("update address created_timestamp success");
    }
  }
}

// parse to token_transfers table
async function toTokenTransfers(
  parsedTransaction: any,
  transaction: any,
  transactionReceipt: any,
) {
  // check if transfer exist
  const existingTokenTransfer = await prisma.token_transfers.findFirst({
    where: { transaction_hash: parsedTransaction.hash, index: transaction.transaction_index },
  });
  const transactionReceiptLogsTopics =
    transactionReceipt.logs[0]?.topics || null;
  if (
    !existingTokenTransfer ||
    transactionReceiptLogsTopics ||
    transactionReceiptLogsTopics.length === 3 ||
    transactionReceiptLogsTopics[0] ===
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  ) {
    const parsedTokenTransfer = {
      from_address: transactionReceiptLogsTopics[1],
      to_address: transactionReceiptLogsTopics[2],
      value: parseInt(transactionReceipt.logs[0]?.data, 16),
      chain_id: parsedTransaction.chain_id,
      currency_id: parsedTransaction.to_address,
      transaction_hash: parsedTransaction.hash,
      index: Number(transaction.transaction_index),
    };
    await prisma.token_transfers.create({
      data: parsedTokenTransfer,
    });
    // Deprecated: check parse to token_transfers table success (20240116 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parse to token_transfers table success", parsedTokenTransfer);
    return parsedTokenTransfer;
  }
}

// parse to token_balances table
async function toTokenBalances(parsedTokenTransfer: any) {
  // check if from_address exist
  const existingFrom = await prisma.token_balances.findFirst({
    where: {
      address: parsedTokenTransfer.from_address,
      currency_id: parsedTokenTransfer.currency_id,
    },
  });
  if (!existingFrom) {
    const parsedFromTokenBalance = {
      address: parsedTokenTransfer.from_address,
      currency_id: parsedTokenTransfer.currency_id,
      value: parsedTokenTransfer.value * -1,
      chain_id: parsedTokenTransfer.chain_id,
    };
    await prisma.token_balances.create({
      data: parsedFromTokenBalance,
    });
  } else {
    // update token_balance
    await prisma.token_balances.updateMany({
      where: {
        address: parsedTokenTransfer.from_address,
        currency_id: parsedTokenTransfer.currency_id,
      },
      data: {
        value: existingFrom.value - parsedTokenTransfer.value,
      },
    });
  }
  // check if to_address exist
  const existingTo = await prisma.token_balances.findFirst({
    where: {
      address: parsedTokenTransfer.to_address,
      currency_id: parsedTokenTransfer.currency_id,
    },
  });
  if (!existingTo) {
    const parsedToTokenBalance = {
      address: parsedTokenTransfer.to_address,
      currency_id: parsedTokenTransfer.currency_id,
      value: parsedTokenTransfer.value,
      chain_id: parsedTokenTransfer.chain_id,
    };
    await prisma.token_balances.create({
      data: parsedToTokenBalance,
    });
  } else {
    // update token_balance
    await prisma.token_balances.updateMany({
      where: {
        address: parsedTokenTransfer.to_address,
        currency_id: parsedTokenTransfer.currency_id,
      },
      data: {
        value: existingTo.value + parsedTokenTransfer.value,
      },
    });
  }
  // Deprecated: check parse to token_balances table success (20240122 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to token_balances table success");
}

// parse to currencies table
async function toCurrencies(parsedTokenTransfer: any) {
  const holderCount = await prisma.token_balances.count({
    where: { currency_id: parsedTokenTransfer.currency_id },
  });
  const total_amount = await prisma.token_balances.aggregate({
    where: { currency_id: parsedTokenTransfer.currency_id },
    _sum: { value: true },
  });
  // check if currency id (contract address) exist
  const existingCurrency = await prisma.currencies.findFirst({
    where: { id: parsedTokenTransfer.currency_id },
  });
  if (!existingCurrency) {
    const parsedCurrency = {
      id: parsedTokenTransfer.currency_id,
      risk_level: "normal",
      price:               Int?,
      volume_in_24h:       Int?,
      symbol:              String?,
      total_amount: total_amount,
      holder_count: holderCount,
      total_transfers: parsedTokenTransfer.value,
      chain_id: parsedTokenTransfer.chain_id,  
    };
    await prisma.currencies.create({
      data: parsedCurrency,
    });
  } else {
    // update currency
    const parsedCurrency = {
      price: Int ?,
      volume_in_24h: Int ?,
      total_amount: total_amount,
      holder_count: holderCount,
      total_transfers: existingCurrency.total_transfers + parsedTokenTransfer.value,
    };
    await prisma.currencies.updateMany({
      where: { id: parsedTokenTransfer.currency_id },
      data: {
        // to do
      },
    });
  }
}

export { toBlocks, toContracts, toChains, toTransactions };
