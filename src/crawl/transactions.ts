import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crawlTransaction(web3: any, blockNumber: number) {
  // check transactionFinished true or false
  const transactionFinished = await prisma.block.findUnique({
    where: { number: blockNumber },
    select: { transactionFinished: true },
  });
  if (!transactionFinished) {
    // Get transactions in the block
    const getBlockByNumber = await web3.eth.getBlock(blockNumber);
    const transactions = getBlockByNumber.transactions;
    for (let i = 0; i < transactions.length; i++) {
      // Get the transaction details by transaction hash
      const getTransactionByHash = await web3.eth.getTransaction(
        transactions[i].toString(),
      );
      // check if the transaction hash exists in the database
      const existingTransaction = await prisma.transaction.findUnique({
        where: { hash: getTransactionByHash.hash.toString() },
      });
      if (existingTransaction) {
        console.log(
          `Transaction ${existingTransaction.hash} already exists in the database`,
        );
      } else {
        // use prisma client to store raw data
        let gasPrice, v, maxFeePerGas, maxPriorityFeePerGas, accessList;
        if ('gasPrice' in getTransactionByHash) {
          gasPrice = getTransactionByHash.gasPrice.toString();
        }
        if ('v' in getTransactionByHash) {
          v = getTransactionByHash.v.toString();
        }
        if ('maxFeePerGas' in getTransactionByHash) {
          maxFeePerGas = getTransactionByHash.maxFeePerGas.toString();
        }
        if ('maxPriorityFeePerGas' in getTransactionByHash) {
          maxPriorityFeePerGas =
            getTransactionByHash.maxPriorityFeePerGas.toString();
        }
        if ('accessList' in getTransactionByHash) {
          accessList = getTransactionByHash.accessList.toString();
        }
        await prisma.transaction.create({
          data: {
            blockNumber: Number(getTransactionByHash.blockNumber),
            hash: getTransactionByHash.hash.toString(),
            nonce: getTransactionByHash.nonce.toString(),
            blockHash: getTransactionByHash.blockHash.toString(),
            transactionIndex: getTransactionByHash.transactionIndex.toString(),
            from: getTransactionByHash.from.toString(),
            to: getTransactionByHash.to.toString(),
            value: getTransactionByHash.value.toString(),
            gas: getTransactionByHash.gas.toString(),
            gasPrice,
            input: getTransactionByHash.input,
            v,
            r: getTransactionByHash.r.toString(),
            s: getTransactionByHash.s.toString(),
            maxFeePerGas,
            maxPriorityFeePerGas,
            type: getTransactionByHash.type.toString(),
            accessList,
            chainId: getTransactionByHash.chainId.toString(),
          },
        });
      }
    }

  } 
}




/*
// Get the transaction details by transaction hash
const getTransactionByHash = await this.web3.eth.getTransaction(
  getBlockByNumber.transactions[0].toString(),
);
this.logger.log('getTransactionByHash:', getTransactionByHash);
// check if the transaction hash exists in the database
const existingTransaction = await prisma.transaction.findUnique({
  where: { hash: getTransactionByHash.hash.toString() },
});
if (existingTransaction) {
  this.logger.log(
    `Transaction ${existingTransaction.hash} already exists in the database`,
  );
} else {
  // use prisma client to store raw data
  let gasPrice, v, maxFeePerGas, maxPriorityFeePerGas, accessList;
  if ('gasPrice' in getTransactionByHash) {
    gasPrice = getTransactionByHash.gasPrice.toString();
  }
  if ('v' in getTransactionByHash) {
    v = getTransactionByHash.v.toString();
  }
  if ('maxFeePerGas' in getTransactionByHash) {
    maxFeePerGas = getTransactionByHash.maxFeePerGas.toString();
  }
  if ('maxPriorityFeePerGas' in getTransactionByHash) {
    maxPriorityFeePerGas =
      getTransactionByHash.maxPriorityFeePerGas.toString();
  }
  if ('accessList' in getTransactionByHash) {
    accessList = getTransactionByHash.accessList.toString();
  }
  await prisma.transaction.create({
    data: {
      blockNumber: Number(getTransactionByHash.blockNumber),
      hash: getTransactionByHash.hash.toString(),
      nonce: getTransactionByHash.nonce.toString(),
      blockHash: getTransactionByHash.blockHash.toString(),
      transactionIndex: getTransactionByHash.transactionIndex.toString(),
      from: getTransactionByHash.from.toString(),
      to: getTransactionByHash.to.toString(),
      value: getTransactionByHash.value.toString(),
      gas: getTransactionByHash.gas.toString(),
      gasPrice,
      input: getTransactionByHash.input,
      v,
      r: getTransactionByHash.r.toString(),
      s: getTransactionByHash.s.toString(),
      maxFeePerGas,
      maxPriorityFeePerGas,
      type: getTransactionByHash.type.toString(),
      accessList,
      chainId: getTransactionByHash.chainId.toString(),
    },
  });
}
*/
