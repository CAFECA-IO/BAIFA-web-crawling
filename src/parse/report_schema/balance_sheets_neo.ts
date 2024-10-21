import { z } from "zod";

const FiatCurrencyDetailSchema = z.object({
  fairValue: z.string(),
  breakdown: z.object({
    USD: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
  }),
});

const CryptocurrencyDetailSchema = z.object({
  fairValue: z.string(),
  breakdown: z.object({
    BTC: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    ETH: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    USDT: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
  }),
});

const CurrencyDetailSchema = z.object({
  fairValue: z.string(),
  breakdown: z.object({
    BTC: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    ETH: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    USDT: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
    USD: z.object({
      amount: z.string(),
      fairValue: z.string(),
    }),
  }),
});

export const BalanceSheetsNeoSchema = z.object({
  reportID: z.string(),
  reportName: z.string(),
  reportStartTime: z.number(),
  reportEndTime: z.number(),
  reportType: z.string(),
  totalAssetsFairValue: z.string(),
  totalLiabilitiesAndEquityFairValue: z.string(),
  assets: z.object({
    fairValue: z.string(),
    details: z.object({
      cryptocurrency: CryptocurrencyDetailSchema,
      cashAndCashEquivalent: FiatCurrencyDetailSchema,
      accountsReceivable: CryptocurrencyDetailSchema,
    }),
  }),
  nonAssets: z.object({
    fairValue: z.string(),
  }),
  liabilities: z.object({
    fairValue: z.string(),
    details: z.object({
      userDeposit: CurrencyDetailSchema,
      accountsPayable: CurrencyDetailSchema,
    }),
  }),
  equity: z.object({
    fairValue: z.string(),
    details: z.object({
      retainedEarning: CurrencyDetailSchema,
      otherCapitalReserve: CurrencyDetailSchema,
    }),
  }),
});

export type IFiatCurrencyDetail = z.infer<typeof FiatCurrencyDetailSchema>;
export type ICryptocurrencyDetail = z.infer<typeof CryptocurrencyDetailSchema>;
export type ICurrencyDetail = z.infer<typeof CurrencyDetailSchema>;

export type IBalanceSheetsNeo = z.infer<typeof BalanceSheetsNeoSchema>;
export interface IBalanceSheetsResponse {
  currentReport: IBalanceSheetsNeo;
  previousReport: IBalanceSheetsNeo;
}

const fiatCurrencyDetailExample: IFiatCurrencyDetail = {
  fairValue: "10000",
  breakdown: {
    USD: {
      amount: "8000",
      fairValue: "8000",
    },
  },
};

const cryptocurrencyDetailExample: ICryptocurrencyDetail = {
  fairValue: "50000",
  breakdown: {
    BTC: {
      amount: "1",
      fairValue: "30000",
    },
    ETH: {
      amount: "10",
      fairValue: "15000",
    },
    USDT: {
      amount: "5000",
      fairValue: "5000",
    },
  },
};

const currencyDetailExample: ICurrencyDetail = {
  fairValue: "60000",
  breakdown: {
    BTC: {
      amount: "1.5",
      fairValue: "45000",
    },
    ETH: {
      amount: "20",
      fairValue: "10000",
    },
    USDT: {
      amount: "10000",
      fairValue: "10000",
    },
    USD: {
      amount: "5000",
      fairValue: "5000",
    },
  },
};

export const balanceSheetsNeoExample: IBalanceSheetsNeo = {
  reportID: "report_123",
  reportName: "Q1 Financial Report",
  reportStartTime: 1617235200, // 01 April 2021
  reportEndTime: 1625097600, // 01 July 2021
  reportType: "balance sheet",
  totalAssetsFairValue: "150000",
  totalLiabilitiesAndEquityFairValue: "150000",
  assets: {
    fairValue: "100000",
    details: {
      cryptocurrency: cryptocurrencyDetailExample,
      cashAndCashEquivalent: fiatCurrencyDetailExample,
      accountsReceivable: cryptocurrencyDetailExample,
    },
  },
  nonAssets: {
    fairValue: "0",
  },
  liabilities: {
    fairValue: "30000",
    details: {
      userDeposit: currencyDetailExample,
      accountsPayable: currencyDetailExample,
    },
  },
  equity: {
    fairValue: "20000",
    details: {
      retainedEarning: currencyDetailExample,
      otherCapitalReserve: currencyDetailExample,
    },
  },
};

export const balanceSheetsResponseExample: IBalanceSheetsResponse = {
  currentReport: balanceSheetsNeoExample,
  previousReport: balanceSheetsNeoExample,
};
