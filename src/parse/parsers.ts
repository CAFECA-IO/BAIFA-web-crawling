// import { PrismaClient } from "@prisma/client";
import { chainInfo } from "../lib/chain_info";
import prisma from "../client";
// import abi
import abi from "./abi";

// import parseReportNameAddress
import { parseReportNameAddress } from "./parse_report_name_address";

// const prisma = new PrismaClient();

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
  web3: any,
) {
  // check if data exist
  const existingBlock = await prisma.blocks.findFirst({
    where: { number: number, chain_id: chainId },
  });
  if (!existingBlock) {
    const parsedBlock = {
      chain_id: chainId,
      symbol: chainData.symbol,
      burnt_fees: block.burnt_fees.toString(),
      created_timestamp: Number(block.timestamp),
      miner: block.miner,
      reward: (
        BigInt(block.base_fee_per_gas) * BigInt(block.gas_used) +
        BigInt(10 ** 18)
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
    await prisma.block_raw.updateMany({
      where: { number: number, chain_id: chainId },
      data: { parse_finished: true },
    });
    // block to balance_versions table
    await BlockToBalanceVersions(parsedBlock);
    // Deprecated: check parse to blocks table success (20240105 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parse to blocks table success", parsedBlock.number);
    await createCurrencyInitial(web3, parsedBlock);
    await parseBlockMinerAddress(parsedBlock);
    // update block reward to token balances
    await updateRewardToTokenBalances(parsedBlock);
    return parsedBlock;
  }
}

// block to balance_versions table
async function BlockToBalanceVersions(parsedBlock: any) {
  const latestSnapshot = await prisma.balance_versions.findMany({
    where: {
      address: parsedBlock.miner,
      currency: "0x0000000000000000000000000000000000000000",
      chain_id: parsedBlock.chain_id,
    },
    orderBy: {
      created_timestamp: "desc",
    },
    take: 1,
  });
  // console.log("latestSnapshot[0].snapshot", latestSnapshot[0].snapshot);
  // console.log("parsedBlock.reward", parsedBlock.reward);
  // const test = BigInt(latestSnapshot[0].snapshot) + BigInt(parsedBlock.reward);
  // console.log("test", test);
  // console.log("test.toString()", test.toString());
  let updatedSnapshot = parsedBlock.reward;
  if (latestSnapshot && latestSnapshot.length > 0) {
    const reward = BigInt(parsedBlock.reward);
    const lastSnapshot = BigInt(latestSnapshot[0].snapshot);
    updatedSnapshot = lastSnapshot + reward;
    updatedSnapshot = updatedSnapshot.toString();
  }
  await prisma.balance_versions.create({
    data: {
      chain_id: parsedBlock.chain_id,
      created_timestamp: parsedBlock.created_timestamp,
      address: parsedBlock.miner,
      modify: parsedBlock.reward,
      currency: "0x0000000000000000000000000000000000000000",
      snapshot: updatedSnapshot,
    },
  });
  // Deprecated: check parse to balance_versions table success (20240206 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("parse to balance_versions table success");
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
        where: { contract_address: contractAddress, chain_id: chainId },
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
          latest_active_time: Number(block.timestamp),
        };
        await prisma.contracts.create({
          data: parsedContract,
        });
        // Deprecated: check parse to contracts table success (20240109 - Gibbs)
        // eslint-disable-next-line no-console
        // console.log("parsedContract", parsedContract);
      } else {
        // update latest_active_time
        if (existingContract.latest_active_time < block.timestamp) {
          await prisma.contracts.updateMany({
            where: { contract_address: contractAddress, chain_id: chainId },
            data: { latest_active_time: Number(block.timestamp) },
          });
          // Deprecated: check update latest_active_time success (20240305 - Gibbs)
          // eslint-disable-next-line no-console
          // console.log(
          //   "update contract latest_active_time success, contract address: ",
          //   contractAddress,
          // );
        }
        // update created_timestamp
        if (existingContract.created_timestamp > block.timestamp) {
          await prisma.contracts.updateMany({
            where: { contract_address: contractAddress, chain_id: chainId },
            data: { created_timestamp: Number(block.timestamp) },
          });
          // Deprecated: check update created_timestamp success (20240305 - Gibbs)
          // eslint-disable-next-line no-console
          // console.log(
          //   "update contract created_timestamp success, contract address: ",
          //   contractAddress,
          // );
        }
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
      // console.log("transaction", transaction);
      // Deprecated: check transactionReceipt data (20240131 - Gibbs)
      // eslint-disable-next-line no-console
      // console.log("transactionReceipt", transactionReceipt);
      // check if transaction exist
      const chain_id = Number(transaction.chain_id);
      const existingTransaction = await prisma.transactions.findFirst({
        where: {
          hash: transaction.hash,
          chain_id: chain_id,
        },
      });
      if (!existingTransaction) {
        const parsedTransaction = {
          chain_id: chain_id,
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
            BigInt(transaction.gas) * BigInt(transaction.gas_price)
          ).toString(),
          // Info: (20240115 - Gibbs) transaction 裡的 from, to 及 receipt logs裡的每個 address, 不重複
          related_addresses: [
            ...new Set([
              transaction.from,
              transaction?.to,
              ...(transactionReceipt?.logs?.map((log) => log.address) || []),
            ]),
          ],
        };
        // Deprecated: check transaction value (20240131 - Gibbs)
        // eslint-disable-next-line no-console
        // console.log("type", typeof transaction.value, transaction.value);
        // Deprecated: check parsedTransaction value (20240131 - Gibbs)
        // eslint-disable-next-line no-console
        // console.log(
        //   "value",
        //   typeof parsedTransaction.value,
        //   parsedTransaction.value,
        // );
        // Deprecated: check parsedTransaction data (20240115 - Gibbs)
        // eslint-disable-next-line no-console
        // console.log("parsedTransaction", parsedTransaction);
        await prisma.transactions.create({
          data: parsedTransaction,
        });
        // update transaction_raw and transaction_receipt_raw parse_finished status
        await prisma.transaction_raw.update({
          where: { hash: transaction.hash, chain_id: transaction.chain_id },
          data: { parse_finished: true },
        });
        const chainIdNumber = Number(transaction.chain_id);
        await prisma.transaction_receipt_raw.update({
          where: {
            transaction_hash: transaction.hash,
            chain_id: chainIdNumber,
          },
          data: { parse_finished: true },
        });
        // Deprecated: check parse to transactions table success (20240109 - Gibbs)
        // eslint-disable-next-line no-console
        console.log("parsedTransaction success! hash:", parsedTransaction.hash);
        // await createCurrencyInitial(web3, parsedTransaction);
        await updateTotalTransfers(
          parsedTransaction,
          "0x0000000000000000000000000000000000000000",
        );
        await createBalanceVersionsForTransaction(parsedTransaction);
        await toAddresses(parsedTransaction);
        // const currency_id = await toCurrencies(
        //   parsedTransaction,
        //   web3,
        //   transactionReceipt,
        // );
        await toTokenTransfers(parsedTransaction);
        await parsedTransactionLogs(
          parsedTransaction,
          transactionReceipt,
          web3,
        );
        // Deprecated: check parsedTokenTransfer data (20240131 - Gibbs)
        // eslint-disable-next-line no-console
        // console.log("output of parsedTokenTransfer", parsedTokenTransfer);
        // if (parsedTokenTransfer && parsedTokenTransfer.value !== "0") {
        // await toTokenBalances(parsedTokenTransfer);
        // }
        // update token balances for transaction; transaction logs have been updated in parsedTransactionLogs
        await updateTokenBalances(
          parsedTransaction,
          "0x0000000000000000000000000000000000000000",
        );
      }
    }
  }
}

// update token balances
async function updateTokenBalances(data: any, currency_id: string) {
  // console.log("updateTokenBalances", data, currency_id);
  if (data.from_address) {
    const fromValue = await prisma.balance_versions.findMany({
      where: {
        address: data.from_address,
        currency: currency_id,
        chain_id: data.chain_id,
      },
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    // console.log("fromValue", fromValue);
    if (fromValue.length > 0) {
      const paddedValue = padTokenValue(fromValue[0].snapshot);
      const currency_id_number = await prisma.currencies.findFirst({
        where: {
          address: currency_id,
          chain_id: data.chain_id,
        },
      });
      const existingRecord = await prisma.token_balances.findFirst({
        where: {
          address: data.from_address,
          currency_id: currency_id_number.id,
          chain_id: data.chain_id,
        },
      });
      if (existingRecord) {
        await prisma.token_balances.updateMany({
          where: {
            address: data.from_address,
            currency_id: currency_id_number.id,
            chain_id: data.chain_id,
          },
          data: {
            value: paddedValue,
          },
        });
      } else {
        await prisma.token_balances.create({
          data: {
            address: data.from_address,
            currency_id: currency_id_number.id,
            value: paddedValue,
            chain_id: data.chain_id,
          },
        });
      }
    }
  }
  if (data.to_address) {
    const toValue = await prisma.balance_versions.findMany({
      where: {
        address: data.to_address,
        currency: currency_id,
        chain_id: data.chain_id,
      },
      orderBy: {
        id: "desc",
      },
      take: 1,
    });
    // console.log("toValue", toValue);
    if (toValue.length > 0) {
      const paddedValue = padTokenValue(toValue[0].snapshot);

      const currency_id_number = await prisma.currencies.findFirst({
        where: {
          address: currency_id,
          chain_id: data.chain_id,
        },
      });
      const existingRecord = await prisma.token_balances.findFirst({
        where: {
          address: data.to_address,
          currency_id: currency_id_number.id,
          chain_id: data.chain_id,
        },
      });
      if (existingRecord) {
        await prisma.token_balances.updateMany({
          where: {
            address: data.to_address,
            currency_id: currency_id_number.id,
            chain_id: data.chain_id,
          },
          data: {
            value: paddedValue,
          },
        });
      } else {
        await prisma.token_balances.create({
          data: {
            address: data.to_address,
            currency_id: currency_id_number.id,
            value: paddedValue,
            chain_id: data.chain_id,
          },
        });
      }
      // await prisma.token_balances.upsert({
      //   where: {
      //     address_currency_id: {
      //       address: data.to_address,
      //       currency_id: currency_id,
      //     },
      //     chain_id: data.chain_id,
      //   },
      //   create: {
      //     address: data.to_address,
      //     currency_id: currency_id,
      //     value: paddedValue,
      //     chain_id: data.chain_id,
      //   },
      //   update: {
      //     value: paddedValue,
      //   },
      // });
    }
  }
}

// parse each log data of a transaction data
async function parsedTransactionLogs(
  parsedTransaction: any,
  transactionReceipt: any,
  web3: any,
) {
  const transactionLogs = transactionReceipt.logs;
  if (transactionLogs.length > 0) {
    for (let i = 0; i < transactionLogs.length; i++) {
      const transactionLog = transactionLogs[i];
      // ERC20 3 events (transfer, minted, burned)
      // create currency if not exist
      const currency_id = await toCurrencies(
        parsedTransaction,
        web3,
        transactionReceipt,
        transactionLog,
      );
      let parsedTransactionLogsToTransfers = undefined;
      // only take erc20 transfer; erc20 transfer: 3 params, nft transfer: 4 params
      if (
        transactionLog.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
        transactionLog.topics.length === 3
      ) {
        parsedTransactionLogsToTransfers = {
          from_address: "0x" + transactionLog.topics[1].substr(-40),
          to_address: "0x" + transactionLog.topics[2].substr(-40),
          value: BigInt(transactionLog.data).toString(),
          chain_id: parsedTransaction.chain_id,
          currency_id: currency_id,
          transaction_hash: parsedTransaction.hash,
          index: i + 1,
          created_timestamp: parsedTransaction.created_timestamp,
        };
        // minted
      } else if (
        transactionLog.topics[0] ===
        "0x9d228d69b5fdb8d273a2336f8fb8612d039631024ea9bf09c424a9503aa078f0"
      ) {
        parsedTransactionLogsToTransfers = {
          to_address: "0x" + transactionLog.topics[1].substr(-40),
          value: BigInt("0x" + transactionLog.data.slice(-64)).toString(),
          chain_id: parsedTransaction.chain_id,
          currency_id: currency_id,
          transaction_hash: parsedTransaction.hash,
          index: i + 1,
          created_timestamp: parsedTransaction.created_timestamp,
        };
      } else if (
        transactionLog.topics[0] ===
        "0x2fe5be0146f74c5bce36c0b80911af6c7d86ff27e89d5cfa61fc681327954e5d"
      ) {
        parsedTransactionLogsToTransfers = {
          to_address: "0x" + transactionLog.topics[1].substr(-40),
          value: BigInt(transactionLog.data.slice(0, 66)).toString(),
          chain_id: parsedTransaction.chain_id,
          currency_id: currency_id,
          transaction_hash: parsedTransaction.hash,
          index: i + 1,
          created_timestamp: parsedTransaction.created_timestamp,
        };
        // burned
      } else if (
        transactionLog.topics[0] ===
        "0xa78a9be3a7b862d26933ad85fb11d80ef66b8f972d7cbba06621d583943a4098"
      ) {
        parsedTransactionLogsToTransfers = {
          from_address: "0x" + transactionLog.topics[2].substr(-40),
          value: BigInt(transactionLog.data.slice(0, 66)).toString(),
          chain_id: parsedTransaction.chain_id,
          currency_id: currency_id,
          transaction_hash: parsedTransaction.hash,
          index: i + 1,
          created_timestamp: parsedTransaction.created_timestamp,
        };
      }
      // check if currency exist
      const existingCurrency = await prisma.currencies.findFirst({
        where: {
          address: currency_id,
          chain_id: parsedTransaction.chain_id,
        },
      });
      if (!existingCurrency) {
        await createCurrency(currency_id, web3, parsedTransaction);
      }
      if (parsedTransactionLogsToTransfers) {
        // update balance_versions table
        await createBalanceVersionsForTransactionLog(
          parsedTransactionLogsToTransfers,
        );
        // update token transfers table
        await TransactionLogToTokenTransfers(parsedTransactionLogsToTransfers);
        // update total transfers
        await updateTotalTransfers(
          parsedTransactionLogsToTransfers,
          currency_id,
        );
        // update token balances for each transaction log
        await updateTokenBalances(
          parsedTransactionLogsToTransfers,
          currency_id,
        );
      }
    }
  }
}

// update token transfers table for each transaction log
async function TransactionLogToTokenTransfers(
  parsedTransactionLogsToTransfers: any,
) {
  // check if transaction log exist
  const existingTokenTransfer = await prisma.token_transfers.findFirst({
    where: {
      transaction_hash: parsedTransactionLogsToTransfers.transaction_hash,
      index: parsedTransactionLogsToTransfers.index,
      chain_id: parsedTransactionLogsToTransfers.chain_id,
    },
  });
  if (!existingTokenTransfer) {
    await prisma.token_transfers.create({
      data: {
        from_address: parsedTransactionLogsToTransfers.from_address,
        to_address: parsedTransactionLogsToTransfers.to_address,
        value: parsedTransactionLogsToTransfers.value,
        chain_id: parsedTransactionLogsToTransfers.chain_id,
        currency_id: parsedTransactionLogsToTransfers.currency_id,
        transaction_hash: parsedTransactionLogsToTransfers.transaction_hash,
        index: parsedTransactionLogsToTransfers.index,
        created_timestamp: parsedTransactionLogsToTransfers.created_timestamp,
      },
    });
  }
}

// create currency for 原生幣種
async function createCurrencyInitial(web3: any, parsedBlock: any) {
  const existingCurrency = await prisma.currencies.findFirst({
    where: {
      address: "0x0000000000000000000000000000000000000000",
      chain_id: parsedBlock.chain_id,
    },
  });
  if (!existingCurrency) {
    await createCurrency(
      "0x0000000000000000000000000000000000000000",
      web3,
      parsedBlock,
    );
  }
}

// update balance_versions table for each transaction log
async function createBalanceVersionsForTransactionLog(
  parsedTransactionLogsToTransfers: any,
) {
  // const existingBalanceVersionFrom = await prisma.balance_versions.findFirst({
  //   where: {
  //     address: parsedTransactionLogsToTransfers.from_address,
  //     currency: parsedTransactionLogsToTransfers.currency_id,
  //   },
  // });
  // get updated snapshotFrom and snapshotTo
  const { updateSnapshotFrom, updateSnapshotTo } = await updateSnapshotValue(
    parsedTransactionLogsToTransfers,
    parsedTransactionLogsToTransfers.currency_id,
  );
  if (parsedTransactionLogsToTransfers.from_address) {
    await prisma.balance_versions.create({
      data: {
        chain_id: parsedTransactionLogsToTransfers.chain_id,
        created_timestamp: parsedTransactionLogsToTransfers.created_timestamp,
        address: parsedTransactionLogsToTransfers.from_address,
        modify: "-" + parsedTransactionLogsToTransfers.value,
        currency: parsedTransactionLogsToTransfers.currency_id,
        transaction_hash: parsedTransactionLogsToTransfers.transaction_hash,
        snapshot: updateSnapshotFrom.toString(),
      },
    });
  }
  // const existingBalanceVersionTo = await prisma.balance_versions.findFirst({
  //   where: {
  //     address: parsedTransactionLogsToTransfers.to_address,
  //     currency: parsedTransactionLogsToTransfers.currency_id,
  //   },
  // });
  if (parsedTransactionLogsToTransfers.to_address) {
    await prisma.balance_versions.create({
      data: {
        chain_id: parsedTransactionLogsToTransfers.chain_id,
        created_timestamp: parsedTransactionLogsToTransfers.created_timestamp,
        address: parsedTransactionLogsToTransfers.to_address,
        modify: parsedTransactionLogsToTransfers.value,
        currency: parsedTransactionLogsToTransfers.currency_id,
        transaction_hash: parsedTransactionLogsToTransfers.transaction_hash,
        snapshot: updateSnapshotTo.toString(),
      },
    });
  }
}

// update balance_versions table for each transaction
async function createBalanceVersionsForTransaction(parsedTransaction: any) {
  if (parsedTransaction.from_address && parsedTransaction.fee !== "0") {
    // get updated snapshot
    const snapshotFee = await updateSnapshotFee(
      parsedTransaction,
      "0x0000000000000000000000000000000000000000",
    );
    await prisma.balance_versions.create({
      data: {
        chain_id: parsedTransaction.chain_id,
        created_timestamp: parsedTransaction.created_timestamp,
        address: parsedTransaction.from_address,
        modify: "-" + parsedTransaction.fee,
        currency: "0x0000000000000000000000000000000000000000",
        snapshot: snapshotFee.toString(),
      },
    });
  }
  if (
    parsedTransaction.from_address &&
    parsedTransaction.to_address &&
    parsedTransaction.value !== "0"
  ) {
    // get updated snapshotFrom and snapshotTo
    const { updateSnapshotFrom, updateSnapshotTo } = await updateSnapshotValue(
      parsedTransaction,
      "0x0000000000000000000000000000000000000000",
    );
    await prisma.balance_versions.create({
      data: {
        chain_id: parsedTransaction.chain_id,
        created_timestamp: parsedTransaction.created_timestamp,
        address: parsedTransaction.from_address,
        modify: "-" + parsedTransaction.value,
        currency: "0x0000000000000000000000000000000000000000",
        snapshot: updateSnapshotFrom.toString(),
      },
    });
    await prisma.balance_versions.create({
      data: {
        chain_id: parsedTransaction.chain_id,
        created_timestamp: parsedTransaction.created_timestamp,
        address: parsedTransaction.to_address,
        modify: parsedTransaction.value,
        currency: "0x0000000000000000000000000000000000000000",
        snapshot: updateSnapshotTo.toString(),
      },
    });
  }
}

//update Snapshot Fee
async function updateSnapshotFee(parsedTransaction: any, currency: string) {
  const latestEntry = await prisma.balance_versions.findMany({
    where: {
      address: parsedTransaction.from_address,
      currency: currency,
      chain_id: parsedTransaction.chain_id,
    },
    orderBy: {
      created_timestamp: "desc",
    },
    take: 1,
  });
  if (latestEntry) {
    const updateSnapshotFee =
      BigInt(latestEntry[0].snapshot) - BigInt(parsedTransaction.fee);
    return updateSnapshotFee;
  } else {
    return -BigInt(parsedTransaction.fee);
  }
}

// update Snapshot Value
async function updateSnapshotValue(
  parsedTransactionOrParsedTransactionLogsToTransfers: any,
  currency: string,
) {
  let updateSnapshotFrom = BigInt(0);
  let updateSnapshotTo = BigInt(0);
  if (parsedTransactionOrParsedTransactionLogsToTransfers.from_address) {
    const latestEntryFrom = await prisma.balance_versions.findMany({
      where: {
        address:
          parsedTransactionOrParsedTransactionLogsToTransfers.from_address,
        currency: currency,
        chain_id: parsedTransactionOrParsedTransactionLogsToTransfers.chain_id,
      },
      orderBy: {
        created_timestamp: "desc",
      },
      take: 1,
    });
    if (latestEntryFrom.length > 0) {
      updateSnapshotFrom =
        BigInt(latestEntryFrom[0].snapshot) -
        BigInt(parsedTransactionOrParsedTransactionLogsToTransfers.value);
    } else {
      updateSnapshotFrom = -BigInt(
        parsedTransactionOrParsedTransactionLogsToTransfers.value,
      );
    }
  }
  if (parsedTransactionOrParsedTransactionLogsToTransfers.to_address) {
    const latestEntryTo = await prisma.balance_versions.findMany({
      where: {
        address: parsedTransactionOrParsedTransactionLogsToTransfers.to_address,
        currency: currency,
        chain_id: parsedTransactionOrParsedTransactionLogsToTransfers.chain_id,
      },
      orderBy: {
        created_timestamp: "desc",
      },
      take: 1,
    });
    if (latestEntryTo.length > 0) {
      updateSnapshotTo =
        BigInt(latestEntryTo[0].snapshot) +
        BigInt(parsedTransactionOrParsedTransactionLogsToTransfers.value);
    } else {
      updateSnapshotTo = BigInt(
        parsedTransactionOrParsedTransactionLogsToTransfers.value,
      );
    }
  }
  return { updateSnapshotFrom, updateSnapshotTo };
}

// different type of transaction
async function type(transaction: any, transactionReceipt: any) {
  /* Info: (20240112 - Gibbs)
  0	Normal
  1	Create contract
  2	ERC-20
  3	NFT
  4	Evidence
  99 Others
    */
  // create contract

  if (
    transactionReceipt?.contract_address &&
    transactionReceipt.contract_address !== "null"
  ) {
    return "1";
    // normal transaction
  } else if (transaction?.input === "0x") {
    return "0";
    // ERC20 transfer
  } else if (transaction?.input.substring(0, 10) === "0xa9059cbb") {
    return "2";
    // ERC721 transferFrom
  } else if (transaction?.input.substring(0, 10) === "0x23b872dd") {
    return "3";
    // evidence
    // new: 0xaddd4bd3 old: 0xb6aca21a test: 0x60806040
  } else if (transaction?.input.substring(0, 10) === "0xaddd4bd3") {
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
  // new: 0xaddd4bd3 old:0xb6aca21a test:0x60806040
  if (transaction.input?.substring(0, 10) === "0xaddd4bd3") {
    if (transactionReceipt.logs.length > 0) {
      const parsedReceiptLogs = transactionReceipt.logs;
      // Deprecated: check parsedReceiptLogs data (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      // console.log("parsedReceiptLogs", parsedReceiptLogs);
      // get evidence id
      const evidenceId =
        parsedReceiptLogs[0].address.substring(2) +
        parsedReceiptLogs[0].topics[3].substring(26);
      // Deprecated: check evidenceId data (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      // console.log("evidenceId:", evidenceId);
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
  const chain_id = Number(transaction.chain_id);
  const existingEvidence = await prisma.evidences.findFirst({
    where: { evidence_id: evidenceId, chain_id: chain_id },
  });
  if (!existingEvidence) {
    // parse transaction receipt logs[1] data
    const { cleanReportName, reportAddress } = await parseReportNameAddress(
      transactionReceipt.logs[1]?.data || null,
    );
    const parsedEvidence = {
      // to do
      // parse transactionReceipts log:
      // events: nft, erc20, create contract, call contract
      evidence_id: evidenceId,
      chain_id: Number(transaction.chain_id),
      created_timestamp: Number(block.timestamp),
      contract_address: "0x" + evidenceId.substring(0, 40),
      state: transactionReceipt.logs[1].topics[3].substr(-1, 1),
      creator_address: transactionReceipt.from,
      token_id: evidenceId.substring(40),
      report_address: reportAddress,
      report_name: cleanReportName,
      evidence_type: "0",
    };
    await prisma.evidences.create({
      data: parsedEvidence,
    });
    // Deprecated: check parse to evidences table success (20240115 - Gibbs)
    // eslint-disable-next-line no-console
    // console.log(
    //   "parse to evidences table success",
    //   "parsedEvidence",
    //   parsedEvidence,
    // );
  }
}

// parse to addresses table
async function toAddresses(parsedTransaction: any) {
  // check if address exist
  const address = parsedTransaction.from_address;
  const existingAddress = await prisma.addresses.findFirst({
    where: { address: address, chain_id: parsedTransaction.chain_id },
  });
  if (!existingAddress) {
    const parsedAddress = {
      chain_id: parsedTransaction.chain_id,
      created_timestamp: parsedTransaction.created_timestamp,
      address: address,
      score: 0,
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
      await prisma.addresses.updateMany({
        where: { address: address, chain_id: parsedTransaction.chain_id },
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
      await prisma.addresses.updateMany({
        where: { address: address, chain_id: parsedTransaction.chain_id },
        data: { created_timestamp: parsedTransaction.created_timestamp },
      });
      // Deprecated: check update created_timestamp success (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("update address created_timestamp success");
    }
  }
}

// parser block miner address
async function parseBlockMinerAddress(block: any) {
  const minerAddress = block.miner;
  const existingAddress = await prisma.addresses.findFirst({
    where: { address: minerAddress, chain_id: block.chain_id },
  });
  if (!existingAddress) {
    const parsedAddress = {
      chain_id: block.chain_id,
      created_timestamp: block.created_timestamp,
      address: minerAddress,
      score: 0,
      latest_active_time: block.created_timestamp,
    };
    await prisma.addresses.create({
      data: parsedAddress,
    });
    // Deprecated: check miner parse to addresses table success (20240322 - Gibbs)
    // eslint-disable-next-line no-console
    console.log("parse miner to addresses table success", parsedAddress);
  } else {
    // update latest_active_time
    if (existingAddress.latest_active_time < block.created_timestamp) {
      await prisma.addresses.updateMany({
        where: { address: minerAddress, chain_id: block.chain_id },
        data: { latest_active_time: block.created_timestamp },
      });
      // Deprecated: check update latest_active_time success (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("update miner address latest_active_time success");
    }
    // update created_timestamp
    if (existingAddress.created_timestamp > block.created_timestamp) {
      await prisma.addresses.updateMany({
        where: { address: minerAddress, chain_id: block.chain_id },
        data: { created_timestamp: block.created_timestamp },
      });
      // Deprecated: check update created_timestamp success (20240116 - Gibbs)
      // eslint-disable-next-line no-console
      console.log("update miner address created_timestamp success");
    }
  }
}

// parse to token_transfers table
async function toTokenTransfers(parsedTransaction: any) {
  // check if transfer exist
  const existingTokenTransfer = await prisma.token_transfers.findFirst({
    where: {
      transaction_hash: parsedTransaction.hash,
      index: 0,
      chain_id: parsedTransaction.chain_id,
    },
  });
  if (!existingTokenTransfer) {
    if (
      parsedTransaction.from_address &&
      parsedTransaction.to_address &&
      parsedTransaction.value !== "0"
    ) {
      const currency_id_number = await prisma.currencies.findFirst({
        where: {
          address: "0x0000000000000000000000000000000000000000",
          chain_id: parsedTransaction.chain_id,
        },
      });
      const parsedTokenTransfer = {
        from_address: parsedTransaction.from_address,
        to_address: parsedTransaction.to_address,
        value: parsedTransaction.value,
        chain_id: parsedTransaction.chain_id,
        currency_id: currency_id_number.id,
        transaction_hash: parsedTransaction.hash,
        index: 0,
        created_timestamp: parsedTransaction.created_timestamp,
      };
      await prisma.token_transfers.create({
        data: parsedTokenTransfer,
      });
    }
  }
  // const transactionReceiptLogsTopics =
  //   transactionReceipt.logs[0]?.topics || null;
  // // erc20 transfer
  // if (
  //   !existingTokenTransfer &&
  //   transactionReceiptLogsTopics &&
  //   transactionReceiptLogsTopics.length === 3 &&
  //   transactionReceiptLogsTopics[0] ===
  //     "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  // ) {
  //   const parsedTokenTransfer = {
  //     from_address: transactionReceiptLogsTopics[1],
  //     to_address: transactionReceiptLogsTopics[2],
  //     value: parseInt(transactionReceipt.logs[0]?.data, 16).toString(),
  //     chain_id: parsedTransaction.chain_id,
  //     currency_id: currency_id,
  //     transaction_hash: parsedTransaction.hash,
  //     index: Number(transaction.transaction_index),
  //     created_timestamp: parsedTransaction.created_timestamp,
  //   };
  //   // Deprecated: check parsedTokenTransfer data (20240131 - Gibbs)
  //   // eslint-disable-next-line no-console
  //   console.log("parsedTokenTransfer - erc20", parsedTokenTransfer);
  //   if (parsedTokenTransfer.value !== "0") {
  //     await prisma.token_transfers.create({
  //       data: parsedTokenTransfer,
  //     });
  //     // Deprecated: check parse to token_transfers table success (20240124 - Gibbs)
  //     // eslint-disable-next-line no-console
  //     console.log(
  //       "parse to token_transfers table success (ERC 20)",
  //       parsedTokenTransfer,
  //     );
  //   }
  //   return parsedTokenTransfer;
  //   // normal transfer
  // } else if (
  //   !existingTokenTransfer &&
  //   !transactionReceiptLogsTopics &&
  //   parsedTransaction.type === "0"
  // ) {
  //   const parsedTokenTransfer = {
  //     from_address: parsedTransaction.from_address,
  //     to_address: parsedTransaction.to_address,
  //     value: parsedTransaction.value,
  //     chain_id: parsedTransaction.chain_id,
  //     currency_id: currency_id,
  //     transaction_hash: parsedTransaction.hash,
  //     index: Number(transaction.transaction_index),
  //     created_timestamp: parsedTransaction.created_timestamp,
  //   };
  //   // Deprecated: check parsedTokenTransfer data (20240131 - Gibbs)
  //   // eslint-disable-next-line no-console
  //   console.log("parsedTokenTransfer - normal", parsedTokenTransfer);
  //   if (parsedTokenTransfer.value !== "0") {
  //     await prisma.token_transfers.create({
  //       data: parsedTokenTransfer,
  //     });
  //     // Deprecated: check parse to token_transfers table success (20240124 - Gibbs)
  //     // eslint-disable-next-line no-console
  //     console.log(
  //       "parse to token_transfers table success (normal)",
  //       parsedTokenTransfer,
  //     );
  //   }
  //   return parsedTokenTransfer;
  // }
}

// parse to token_balances table
async function toTokenBalances(parsedTokenTransfer: any) {
  // eslint-disable-next-line prettier/prettier
  const parsedTokenTransferFrom = "0x" + parsedTokenTransfer.from_address.substr(-40, 40);
  const parsedTokenTransferTo =
    "0x" + parsedTokenTransfer.to_address.substr(-40, 40);
  // check if from_address exist
  const existingFrom = await prisma.token_balances.findFirst({
    where: {
      address: parsedTokenTransferFrom,
      currency_id: parsedTokenTransfer.currency_id,
      chain_id: parsedTokenTransfer.chain_id,
    },
  });
  if (!existingFrom) {
    const paddedValue = padTokenValue(
      (BigInt(parsedTokenTransfer.value) * BigInt(-1)).toString(),
    );
    const parsedFromTokenBalance = {
      address: parsedTokenTransferFrom,
      currency_id: parsedTokenTransfer.currency_id,
      value: paddedValue,
      chain_id: parsedTokenTransfer.chain_id,
    };
    await prisma.token_balances.create({
      data: parsedFromTokenBalance,
    });
  } else {
    // update token_balance
    const paddedValue = padTokenValue(
      (
        BigInt(existingFrom.value) - BigInt(parsedTokenTransfer.value)
      ).toString(),
    );
    await prisma.token_balances.updateMany({
      where: {
        address: parsedTokenTransferFrom,
        currency_id: parsedTokenTransfer.currency_id,
        chain_id: parsedTokenTransfer.chain_id,
      },
      data: {
        value: paddedValue,
      },
    });
  }
  // check if to_address exist
  const existingTo = await prisma.token_balances.findFirst({
    where: {
      address: parsedTokenTransferTo,
      currency_id: parsedTokenTransfer.currency_id,
      chain_id: parsedTokenTransfer.chain_id,
    },
  });
  if (!existingTo) {
    const paddedValue = padTokenValue(parsedTokenTransfer.value);
    const parsedToTokenBalance = {
      address: parsedTokenTransferTo,
      currency_id: parsedTokenTransfer.currency_id,
      value: paddedValue,
      chain_id: parsedTokenTransfer.chain_id,
    };
    await prisma.token_balances.create({
      data: parsedToTokenBalance,
    });
  } else {
    // update token_balance
    const paddedValue = padTokenValue(
      (BigInt(existingTo.value) + BigInt(parsedTokenTransfer.value)).toString(),
    );
    await prisma.token_balances.updateMany({
      where: {
        address: parsedTokenTransferTo,
        currency_id: parsedTokenTransfer.currency_id,
        chain_id: parsedTokenTransfer.chain_id,
      },
      data: {
        value: paddedValue,
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
  transactionLog: any,
) {
  const currency_id = await getCurrencyId(
    transactionReceipt,
    parsedTransaction,
    transactionLog,
  );
  // Deprecated: check currency_id (20240131 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("currency_id1", currency_id);
  // create currency
  if (currency_id) {
    const existingCurrency = await prisma.currencies.findFirst({
      where: { address: currency_id, chain_id: parsedTransaction.chain_id },
    });
    if (!existingCurrency) {
      await createCurrency(currency_id, web3, parsedTransaction);
    }
  }
  return currency_id;
}

// update total transfers
async function updateTotalTransfers(
  parsedTransactionOrParsedTransactionLogsToTransfers: any,
  currency_id: string,
) {
  if (parsedTransactionOrParsedTransactionLogsToTransfers.value !== "0") {
    // update currency total_transfers
    await prisma.currencies.updateMany({
      where: {
        address: currency_id,
        chain_id: parsedTransactionOrParsedTransactionLogsToTransfers.chain_id,
      },
      data: {
        total_transfers: {
          increment: 1,
        },
      },
    });
  }
}

// get currency id
async function getCurrencyId(
  transactionReceipt: any,
  parsedTransaction: any,
  transactionLog: any,
) {
  // const transactionReceiptLogsTopics =
  //   transactionReceipt.logs[0]?.topics || null;
  // // Deprecated: check transactionReceiptLogsTopics data (20240131 - Gibbs)
  // // eslint-disable-next-line no-console
  // console.log("transactionReceiptLogsTopics", transactionReceiptLogsTopics);
  // erc20 event: transfer, minted, burned
  if (
    transactionLog.topics[0] ===
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" ||
    transactionLog.topics[0] ===
      "0x9d228d69b5fdb8d273a2336f8fb8612d039631024ea9bf09c424a9503aa078f0" ||
    transactionLog.topics[0] ===
      "0x2fe5be0146f74c5bce36c0b80911af6c7d86ff27e89d5cfa61fc681327954e5d" ||
    transactionLog.topics[0] ===
      "0xa78a9be3a7b862d26933ad85fb11d80ef66b8f972d7cbba06621d583943a4098"
  ) {
    return transactionLog.address;
    // normal transfer
  }
  // else if (!transactionReceiptLogsTopics && parsedTransaction.type === "0") {
  //   return "0x0000000000000000000000000000000000000000";
  // } else {
  // }
}

// create new currency
async function createCurrency(
  currency_id: string,
  web3: any,
  parsedTransactionOrBlock: any,
) {
  const contractAddress = currency_id;
  // Deprecated: check contractAddress (20240131 - Gibbs)
  // eslint-disable-next-line no-console
  // console.log("contractAddress", contractAddress);
  if (
    contractAddress &&
    contractAddress !== "0x0000000000000000000000000000000000000000"
  ) {
    const contract = new web3.eth.Contract(abi, contractAddress);
    const newERC20Currency = await createERC20Currency(
      currency_id,
      contract,
      parsedTransactionOrBlock,
    );
    if (newERC20Currency) {
      await prisma.currencies.create({
        data: newERC20Currency,
      });
      // Deprecated: check new currency create success (20240123 - Gibbs)
      // eslint-disable-next-line no-console
      // console.log("create new ERC 20 currency success", newERC20Currency);
    }
  } else if (
    contractAddress &&
    contractAddress === "0x0000000000000000000000000000000000000000"
  ) {
    const newCurrency = {
      address: currency_id,
      risk_level: "1",
      price: 0,
      volume_in_24h: "0",
      symbol: chainInfo.symbol,
      total_amount: "0",
      holder_count: 0,
      total_transfers: 0,
      chain_id: parsedTransactionOrBlock.chain_id,
      name: chainInfo.chainName,
      decimals: chainInfo.decimal,
    };
    await prisma.currencies.create({
      data: newCurrency,
    });
    // Deprecated: check new currency create success (20240125 - Gibbs)
    // eslint-disable-next-line no-console
    // console.log("create new normal currency success", newCurrency);
  }
}

// if currency_id is ERC20, create new currency
async function createERC20Currency(
  currency_id: string,
  contract: any,
  parsedTransactionOrBlock: any,
) {
  try {
    const newCurrency = {
      address: currency_id,
      risk_level: "1",
      price: 0,
      volume_in_24h: "0",
      symbol: await contract.methods.symbol().call(),
      total_amount: (await contract.methods.totalSupply().call()).toString(),
      holder_count: 0,
      total_transfers: 0,
      chain_id: parsedTransactionOrBlock.chain_id,
      name: await contract.methods.name().call(),
      decimals: await contract.methods.decimals().call(),
    };
    return newCurrency;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("It's not ERC20 token transfer");
    return false;
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

// update total amount for 原生幣種 in currencies table after parsing each block
async function updateTotalAmount(parsedBlock: any) {
  if (parsedBlock) {
    const originalCurrency = await prisma.currencies.findFirst({
      where: {
        address: "0x0000000000000000000000000000000000000000",
        chain_id: parsedBlock.chain_id,
      },
    });
    const totalAmount = (
      BigInt(originalCurrency.total_amount) + BigInt(10 ** 18)
    ).toString();
    await prisma.currencies.updateMany({
      where: {
        address: "0x0000000000000000000000000000000000000000",
        chain_id: parsedBlock.chain_id,
      },
      data: {
        total_amount: totalAmount,
      },
    });
  }
}

function padTokenValue(value) {
  // make sure data type: string
  const stringValue = String(value);
  // check if is negative
  const isNegative = stringValue.startsWith("-");
  // calculate the number of zeros to be added, if it is negative, the length needs to be subtracted by 1 (sign bit)
  const paddingSize =
    64 - (isNegative ? stringValue.length - 1 : stringValue.length);
  // pad with zeros according to whether it is negative
  const paddedValue = isNegative
    ? "-" + "0".repeat(paddingSize) + stringValue.substring(1)
    : "0".repeat(paddingSize) + stringValue;

  return paddedValue;
}

async function updateRewardToTokenBalances(parsedBlock: any) {
  // check address if it is miner, yes, update reward to token_balances; no, create
  const minerAddress = parsedBlock.miner;
  const chainId = parsedBlock.chain_id;
  const currency = await prisma.currencies.findFirst({
    where: {
      address: "0x0000000000000000000000000000000000000000",
      chain_id: chainId,
    },
  });
  const existingAddress = await prisma.token_balances.findFirst({
    where: {
      address: minerAddress,
      chain_id: chainId,
      currency_id: currency.id,
    },
  });
  if (!existingAddress) {
    const parsedTokenBalance = {
      address: minerAddress,
      currency_id: currency.id,
      value: parsedBlock.reward,
      chain_id: chainId,
    };
    await prisma.token_balances.create({
      data: parsedTokenBalance,
    });
  } else {
    const paddedValue = padTokenValue(
      (BigInt(existingAddress.value) + BigInt(parsedBlock.reward)).toString(),
    );
    await prisma.token_balances.updateMany({
      where: {
        address: minerAddress,
        currency_id: currency.id,
        chain_id: chainId,
      },
      data: {
        value: paddedValue,
      },
    });
  }
}

export {
  toBlocks,
  toContracts,
  toChains,
  toTransactions,
  toCodes,
  updateTotalAmount,
};
