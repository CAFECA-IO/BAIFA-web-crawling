import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// calculate the holder numbers of each currency in token_balances table and update holer count in currencies table
async function calculateHolderNumbers() {
  // get all currency ids from token_balances table
  const currencyIds = await prisma.token_balances.findMany({
    select: { currency_id: true },
    distinct: ["currency_id"],
  });
  // get all holder numbers of each currency
  for (let i = 0; i < currencyIds.length; i++) {
    const currencyId = currencyIds[i].currency_id;
    const holderNumbers = await prisma.token_balances.count({
      where: { currency_id: currencyId },
    });
    // holder count !== holderNumbers, update holder count
    const holderCount = await prisma.currencies.findFirst({
      where: { id: currencyId },
      select: { holder_count: true },
    });
    if (holderCount.holder_count !== holderNumbers) {
      // update holder count of each currency in currencies table
      await prisma.currencies.update({
        where: { id: currencyId },
        data: { holder_count: holderNumbers },
      });
    }
  }
  // Deprecated: print holder count updated (20240325 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("all holder count updated");
}

// auto conduct calculateHolderNumbers function every 1 hour
async function scheduleCalculateHolderNumbers() {
  while (true) {
    await calculateHolderNumbers();
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60));
  }
}

export { scheduleCalculateHolderNumbers };
