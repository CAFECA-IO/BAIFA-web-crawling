-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blockHash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "gas" TEXT NOT NULL,
    "gasPrice" TEXT NOT NULL,
    "maxFeePerGas" TEXT NOT NULL,
    "maxPriorityFeePerGas" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "transactionIndex" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accessList" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "v" TEXT NOT NULL,
    "r" TEXT NOT NULL,
    "s" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baseFeePerGas" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "extraData" TEXT NOT NULL,
    "gasLimit" TEXT NOT NULL,
    "gasUsed" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "logsBloom" TEXT NOT NULL,
    "miner" TEXT NOT NULL,
    "mixHash" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "parentHash" TEXT NOT NULL,
    "receiptsRoot" TEXT NOT NULL,
    "sha3Uncles" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stateRoot" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "totalDifficulty" TEXT NOT NULL,
    "transactionsRoot" TEXT NOT NULL,
    "uncles" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TransactionReceipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blockHash" TEXT NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "cumulativeGasUsed" TEXT NOT NULL,
    "effectiveGasPrice" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "gasUsed" TEXT NOT NULL,
    "logs" TEXT NOT NULL,
    "logsBloom" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionIndex" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Block_hash_key" ON "Block"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Block_number_key" ON "Block"("number");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionReceipt_transactionHash_key" ON "TransactionReceipt"("transactionHash");
