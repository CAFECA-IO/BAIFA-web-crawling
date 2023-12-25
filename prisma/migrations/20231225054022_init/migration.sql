-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "block_hash" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "gas" TEXT NOT NULL,
    "gas_price" TEXT NOT NULL,
    "max_fee_per_gas" TEXT NOT NULL,
    "max_priority_fee_per_gas" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "transaction_index" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "access_list" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "v" TEXT NOT NULL,
    "r" TEXT NOT NULL,
    "s" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Block" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "base_fee_per_gas" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "extra_data" TEXT NOT NULL,
    "gas_limit" TEXT NOT NULL,
    "gas_used" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "logs_bloom" TEXT NOT NULL,
    "miner" TEXT NOT NULL,
    "mix_hash" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "parent_hash" TEXT NOT NULL,
    "receipts_root" TEXT NOT NULL,
    "sha3_uncles" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "state_root" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "total_difficulty" TEXT NOT NULL,
    "transactions_root" TEXT NOT NULL,
    "uncles" TEXT NOT NULL,
    "transaction_count" INTEGER NOT NULL,
    "transaction_finished" BOOLEAN NOT NULL DEFAULT false,
    "transaction_receipt_finished" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "TransactionReceipt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "block_hash" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "contract_address" TEXT NOT NULL,
    "cumulative_gas_used" TEXT NOT NULL,
    "effective_gas_price" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "gas_used" TEXT NOT NULL,
    "logs" TEXT NOT NULL,
    "logs_bloom" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "transaction_index" TEXT NOT NULL,
    "type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_hash_key" ON "Transaction"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Block_hash_key" ON "Block"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Block_number_key" ON "Block"("number");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionReceipt_transaction_hash_key" ON "TransactionReceipt"("transaction_hash");
