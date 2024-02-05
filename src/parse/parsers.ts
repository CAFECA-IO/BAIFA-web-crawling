import { PrismaClient } from "@prisma/client";
// import abi
import abi from "./abi";

const prisma = new PrismaClient();

// const parseTransacrion = async(raw) => {
//   /*
//   1. get transaction detail
//   2. insert transaction into db
//   3. update original token balance
//   3. parse token transfer event
//   4. for each token transfer event: add currency if not exist
//   5. for each token transfer event: add token transfer into db
//   6. for each token transfer event: update token balance
//   7. update transaction raw status
//    */

//   const step1Result = await function1();
//   const step2Result = await function2(step1Result);
//   const step3Result = await function3(step2Result);
//   const step4Result = await function4(step3Result);
//   const step5Result = await function5(step4Result);
//   const step6Result = await function6(step5Result);
//   const step7Result = await function7(step6Result);

// }

// parse to blocks table
async function toBlocks(
  number: number,
  block: any,
  chainId: number,
  chainData: any,
) {
  // check if data exist
  const existingBlock = await prisma.blocks.findUnique({
    where: { number: number },
  });
  if (!existingBlock) {
    const parsedBlock = {
      chain_id: chainId,
      symbol: chainData.symbol,
      burnt_fees: block.burnt_fees.toString(),
      created_timestamp: Number(block.timestamp),
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
      extra_data: block.extra_data,
    };
    await prisma.blocks.create({
      data: parsedBlock,
    });
    // update block_raw parse_finished status
    await prisma.block_raw.update({
      where: { number: number },
      data: { parse_finished: true },
    });
    // Deprecated: check parse to blocks table success (20240105 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parse to blocks table success", parsedBlock);
  }
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
          created_timestamp: Number(block.timestamp),
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
async function toChains(chainData: any) {
  // check if chain exist
  const existingChain = await prisma.chains.findFirst({
    where: { id: chainData.chain_id },
  });
  if (!existingChain) {
    const parsedChain = {
      id: chainData.chain_id,
      chain_name: chainData.chain_name,
      symbol: chainData.symbol,
      decimals: chainData.decimals,
      rpc: chainData.rpc,
    };
    // create chain
    await prisma.chains.create({
      data: parsedChain,
    });
    // Deprecated: check parse to chains table success (20240109 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parse to chains table success", parsedChain);
  }
  // Deprecated: check parse to chains table success (20240109 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("chains exist");
}

async function toTransactions(
  transactions: any[],
  block: any,
  transactionReceipts: any[],
  web3: any,
) {
  if (transactions?.length > 0) {
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const transactionReceipt = transactionReceipts[i];
      // Deprecated: check transaction data (20240131 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("transaction", transaction);
      // Deprecated: check transactionReceipt data (20240131 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("transactionReceipt", transactionReceipt);
      // check if transaction exist
      const existingTransaction = await prisma.transactions.findFirst({
        where: { hash: transaction.hash },
      });
      if (!existingTransaction) {
        const parsedTransaction = {
          chain_id: Number(transaction.chain_id),
          created_timestamp: Number(block.timestamp),
          hash: transaction.hash,
          type: await type(transaction, transactionReceipt),
          // 0 pending, 1 success, 2 fail
          status: "1",
          block_hash: transaction.block_hash,
          from_address: transaction.from,
          to_address: transaction.to,
          evidence_id: await evidenceId(transaction, transactionReceipt, block),
          value: transaction.value,
          fee: (
            Number(transaction.gas) * Number(transaction.gas_price)
          ).toString(),
          // Info: (20240115 - Gibbs) transaction 裡的 from, to 及 receipt logs裡的每個 address, 不重複
          related_addresses: [
            ...new Set([
              transaction.from,
              transaction?.to,
              ...transactionReceipt.logs?.map((log) => log.address),
            ]),
          ],
        };
        // Deprecated: check transaction value (20240131 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("type", typeof transaction.value, transaction.value);
        // Deprecated: check parsedTransaction value (20240131 - Gibbs)
        // eslint-disable-next-line no-console
        console.log(
          "value",
          typeof parsedTransaction.value,
          parsedTransaction.value,
        );
        // Deprecated: check parsedTransaction data (20240115 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("parsedTransaction", parsedTransaction);
        await prisma.transactions.create({
          data: parsedTransaction,
        });
        // update transaction_raw and transaction_receipt_raw parse_finished status
        await prisma.transaction_raw.update({
          where: { hash: transaction.hash },
          data: { parse_finished: true },
        });
        await prisma.transaction_receipt_raw.update({
          where: { transaction_hash: transaction.hash },
          data: { parse_finished: true },
        });
        // Deprecated: check parse to transactions table success (20240109 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("parsedTransaction success! hash:", parsedTransaction.hash);
        await toAddresses(parsedTransaction);
        const currency_id = await toCurrencies(
          parsedTransaction,
          web3,
          transactionReceipt,
        );
        const parsedTokenTransfer = await toTokenTransfers(
          parsedTransaction,
          transaction,
          transactionReceipt,
          currency_id,
        );
        // Deprecated: check parsedTokenTransfer data (20240131 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("output of parsedTokenTransfer", parsedTokenTransfer);
        if (parsedTokenTransfer && parsedTokenTransfer.value !== "0") {
          await toTokenBalances(parsedTokenTransfer);
        }
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
      created_timestamp: Number(block.timestamp),
      contract_address: "0x" + evidenceId.substring(0, 40),
      state: "0",
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
  currency_id: string,
) {
  // check if transfer exist
  const existingTokenTransfer = await prisma.token_transfers.findFirst({
    where: {
      transaction_hash: parsedTransaction.hash,
      index: Number(transaction.transaction_index),
    },
  });
  const transactionReceiptLogsTopics =
    transactionReceipt.logs[0]?.topics || null;
  // erc20 transfer
  if (
    !existingTokenTransfer &&
    transactionReceiptLogsTopics &&
    transactionReceiptLogsTopics.length === 3 &&
    transactionReceiptLogsTopics[0] ===
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  ) {
    const parsedTokenTransfer = {
      from_address: transactionReceiptLogsTopics[1],
      to_address: transactionReceiptLogsTopics[2],
      value: parseInt(transactionReceipt.logs[0]?.data, 16).toString(),
      chain_id: parsedTransaction.chain_id,
      currency_id: currency_id,
      transaction_hash: parsedTransaction.hash,
      index: Number(transaction.transaction_index),
      created_timestamp: parsedTransaction.created_timestamp,
    };
    // Deprecated: check parsedTokenTransfer data (20240131 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parsedTokenTransfer - erc20", parsedTokenTransfer);
    if (parsedTokenTransfer.value !== "0") {
      await prisma.token_transfers.create({
        data: parsedTokenTransfer,
      });
      // Deprecated: check parse to token_transfers table success (20240124 - Gibbs)
      // eslint-disable-next-line no-console
      console.log(
        "parse to token_transfers table success (ERC 20)",
        parsedTokenTransfer,
      );
    }
    return parsedTokenTransfer;
    // normal transfer
  } else if (
    !existingTokenTransfer &&
    !transactionReceiptLogsTopics &&
    parsedTransaction.type === "0"
  ) {
    const parsedTokenTransfer = {
      from_address: parsedTransaction.from_address,
      to_address: parsedTransaction.to_address,
      value: parsedTransaction.value,
      chain_id: parsedTransaction.chain_id,
      currency_id: currency_id,
      transaction_hash: parsedTransaction.hash,
      index: Number(transaction.transaction_index),
      created_timestamp: parsedTransaction.created_timestamp,
    };
    // Deprecated: check parsedTokenTransfer data (20240131 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parsedTokenTransfer - normal", parsedTokenTransfer);
    if (parsedTokenTransfer.value !== "0") {
      await prisma.token_transfers.create({
        data: parsedTokenTransfer,
      });
      // Deprecated: check parse to token_transfers table success (20240124 - Gibbs)
      // eslint-disable-next-line no-console
      console.log(
        "parse to token_transfers table success (normal)",
        parsedTokenTransfer,
      );
    }
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
      value: (Number(parsedTokenTransfer.value) * -1).toString(),
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
        value: (
          Number(existingFrom.value) - Number(parsedTokenTransfer.value)
        ).toString(),
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
        value: (
          Number(existingTo.value) + Number(parsedTokenTransfer.value)
        ).toString(),
      },
    });
  }
  // Deprecated: check parse to token_balances table success (20240122 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to token_balances table success");
}

// parse to currencies table
async function toCurrencies(
  parsedTransaction: any,
  web3: any,
  transactionReceipt: any,
) {
  const currency_id = await getCurrencyId(
    transactionReceipt,
    parsedTransaction,
  );
  // Deprecated: check currency_id (20240131 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("currency_id1", currency_id);
  // create currency
  if (currency_id) {
    const existingCurrency = await prisma.currencies.findFirst({
      where: { id: currency_id },
    });
    if (!existingCurrency) {
      await createCurrency(currency_id, web3, parsedTransaction);
    }
    if (parsedTransaction.value !== "0") {
      // update currency total_transfers
      await prisma.currencies.update({
        where: { id: currency_id },
        data: {
          total_transfers: {
            increment: 1,
          },
        },
      });
    }
  }
  return currency_id;
}

// get currency id
async function getCurrencyId(transactionReceipt: any, parsedTransaction: any) {
  const transactionReceiptLogsTopics =
    transactionReceipt.logs[0]?.topics || null;
  // Deprecated: check transactionReceiptLogsTopics data (20240131 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("transactionReceiptLogsTopics", transactionReceiptLogsTopics);
  // erc20 transfer
  if (
    transactionReceiptLogsTopics &&
    transactionReceiptLogsTopics?.length === 3 &&
    transactionReceiptLogsTopics[0] ===
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  ) {
    return parsedTransaction.to_address;
    // normal transfer
  } else if (!transactionReceiptLogsTopics && parsedTransaction.type === "0") {
    return "0x0000000000000000000000000000000000000000";
  } else {
  }
}

// create new currency
async function createCurrency(
  currency_id: string,
  web3: any,
  parsedTransaction: any,
) {
  const contractAddress = currency_id;
  // Deprecated: check contractAddress (20240131 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("contractAddress", contractAddress);
  if (
    contractAddress &&
    contractAddress !== "0x0000000000000000000000000000000000000000"
  ) {
    const contract = new web3.eth.Contract(abi, contractAddress);
    const newCurrency = {
      id: currency_id,
      risk_level: "1",
      price: 0,
      volume_in_24h: "0",
      symbol: await contract.methods.symbol().call(),
      total_amount: (await contract.methods.totalSupply().call()).toString(),
      holder_count: 0,
      total_transfers: 0,
      chain_id: parsedTransaction.chain_id,
      name: await contract.methods.name().call(),
    };
    await prisma.currencies.create({
      data: newCurrency,
    });
    // Deprecated: check new currency create success (20240123 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("create new ERC 20 currency success", newCurrency);
  } else if (
    contractAddress &&
    contractAddress === "0x0000000000000000000000000000000000000000"
  ) {
    const newCurrency = {
      id: currency_id,
      risk_level: "1",
      price: 0,
      volume_in_24h: "0",
      symbol: "you tell me",
      total_amount: "0",
      holder_count: 0,
      total_transfers: 0,
      chain_id: parsedTransaction.chain_id,
      name: "you tell me",
    };
    await prisma.currencies.create({
      data: newCurrency,
    });
    // Deprecated: check new currency create success (20240125 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("create new normal currency success", newCurrency);
  }
}

async function toCodes(codesData: any) {
  const codesCount = await prisma.codes.count();
  if (codesCount === 0) {
    for (const code of codesData) {
      await prisma.codes.create({
        data: code,
      });
    }
  }
  // Deprecated: check codes table created (20240201 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("codes table created !");
}

export { toBlocks, toContracts, toChains, toTransactions, toCodes };
