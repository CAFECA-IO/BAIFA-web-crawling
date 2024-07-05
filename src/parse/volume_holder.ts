// import { PrismaClient } from "@prisma/client";
import { CHAIN_INFO } from "src/constants/chain_info";
import prisma from "../client";
// const prisma = new PrismaClient();

// calculate the holder numbers of each currency in token_balances table and update holer count in currencies table
async function calculateHolderNumbers(currencyIds) {
  // get all holder numbers of each currency
  for (let i = 0; i < currencyIds.length; i++) {
    const currencyId = currencyIds[i].id;
    const holderNumbers = await prisma.token_balances.count({
      where: { currency_id: currencyId, chain_id: CHAIN_INFO.chain_id },
    });
    // holder count !== holderNumbers, update holder count
    const holderCount = await prisma.currencies.findFirst({
      where: { address: currencyId, chain_id: CHAIN_INFO.chain_id },
      select: { holder_count: true },
    });
    if (holderCount.holder_count !== holderNumbers) {
      // update holder count of each currency in currencies table
      await prisma.currencies.updateMany({
        where: { address: currencyId, chain_id: CHAIN_INFO.chain_id },
        data: { holder_count: holderNumbers },
      });
    }
  }
  // Deprecated: print holder count updated (20240325 - Gibbs)
  // eslint-disable-next-line no-console
  console.log("all holder count updated");
}

// calculate volume(value) in 24h for each currency in token_transfers table and update volume_in_24h in currencies table
async function calculateVolumeIn24h(currencyIds) {
  // get all volume_in_24h of each currency
  for (let i = 0; i < currencyIds.length; i++) {
    const currencyId = currencyIds[i].id;
    const volumeIn24h = await prisma.token_transfers.findMany({
      where: {
        currency_id: currencyId,
        created_timestamp: {
          gte: (Date.now() - 24 * 60 * 60 * 1000) / 1000, // 過去 24 小時
        },
        chain_id: CHAIN_INFO.chain_id,
      },
      select: {
        value: true, // 只選擇 value 欄位
      },
    });
    let volumeIn24hResult = "0";
    if (volumeIn24h.length > 0) {
      volumeIn24hResult = volumeIn24h
        .reduce((temp, cur) => {
          return BigInt(temp) + BigInt(cur.value);
        }, BigInt(0))
        .toString();
    }
    // volume_in_24h !== volumeIn24h, update volume_in_24h
    const volume24h = await prisma.currencies.findFirst({
      where: { address: currencyId, chain_id: CHAIN_INFO.chain_id },
      select: { volume_in_24h: true },
    });
    if (volume24h.volume_in_24h !== volumeIn24hResult) {
      // update volume_in_24h of each currency in currencies table
      await prisma.currencies.updateMany({
        where: { address: currencyId, chain_id: CHAIN_INFO.chain_id },
        data: { volume_in_24h: volumeIn24hResult },
      });
    }
  }
}

// auto conduct calculateHolderNumbers function and  calculateVolumeIn24h function every 1 hour
async function scheduleCalculateHolderVolume() {
  while (true) {
    // get all currency ids from currencies table
    const currencyIds = await prisma.currencies.findMany({
      where: { chain_id: CHAIN_INFO.chain_id },
      select: { address: true },
      distinct: ["address"],
    });
    await calculateHolderNumbers(currencyIds);
    await calculateVolumeIn24h(currencyIds);
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60));
  }
}

export { scheduleCalculateHolderVolume };
