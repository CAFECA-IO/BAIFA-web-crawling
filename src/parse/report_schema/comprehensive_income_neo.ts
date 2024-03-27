import { z } from "zod";

// Info: create validation function (20240325 - Shirley)
const BreakdownSchema = z.object({
  USDT: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
  ETH: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
  BTC: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
  USD: z.object({
    amount: z.string(),
    weightedAverageCost: z.string(),
  }),
});

const IncomeAccountingDetailSchema = z.object({
  weightedAverageCost: z.string(),
  breakdown: BreakdownSchema,
});

const DetailsSchema = z.object({
  depositFee: IncomeAccountingDetailSchema,
  withdrawalFee: IncomeAccountingDetailSchema,
  tradingFee: IncomeAccountingDetailSchema,
  spreadFee: IncomeAccountingDetailSchema,
  liquidationFee: IncomeAccountingDetailSchema,
  guaranteedStopLossFee: IncomeAccountingDetailSchema,
});

export const ComprehensiveIncomeNeoSchema = z.object({
  reportType: z.string(),
  reportID: z.string(),
  reportName: z.string(),
  reportStartTime: z.number(),
  reportEndTime: z.number(),
  netProfit: z.string(),

  income: z.object({
    weightedAverageCost: z.string(),
    details: DetailsSchema,
  }),

  costs: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      technicalProviderFee: IncomeAccountingDetailSchema,
      marketDataProviderFee: z.object({
        weightedAverageCost: z.string(),
      }),
      newCoinListingCost: z.object({
        weightedAverageCost: z.string(),
      }),
    }),
  }),
  operatingExpenses: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      salaries: z.string(),
      rent: z.string(),
      marketing: z.string(),
      rebateExpenses: IncomeAccountingDetailSchema,
    }),
  }),
  financialCosts: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      interestExpense: z.string(),
      fiatToCryptocurrencyConversionLosses: z.string(),
      cryptocurrencyToFiatConversionLosses: z.string(),
      fiatToFiatConversionLosses: z.string(),
      cryptocurrencyForexLosses: IncomeAccountingDetailSchema,
    }),
  }),
  otherGainLosses: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      investmentGains: z.string(),
      forexGains: z.string(),
      cryptocurrencyGains: IncomeAccountingDetailSchema,
    }),
  }),
});

// Info: create relevant types (20240325 - Shirley)

export type IBreakdown = z.infer<typeof BreakdownSchema>;

export type IIncomeAccountingDetail = z.infer<
  typeof IncomeAccountingDetailSchema
>;

export type IComprehensiveIncomeNeo = z.infer<
  typeof ComprehensiveIncomeNeoSchema
>;

export interface IComprehensiveIncomeResponse {
  currentReport: IComprehensiveIncomeNeo;
  previousReport: IComprehensiveIncomeNeo;
  lastYearReport: IComprehensiveIncomeNeo;
}

const dummyBreakdown = {
  USDT: {
    amount: "1000",
    weightedAverageCost: "0.99",
  },
  ETH: {
    amount: "5",
    weightedAverageCost: "2000",
  },
  BTC: {
    amount: "1",
    weightedAverageCost: "30000",
  },
  USD: {
    amount: "500",
    weightedAverageCost: "1",
  },
};

const dummyIncomeAccountingDetail = {
  weightedAverageCost: "1.00",
  breakdown: dummyBreakdown,
};

const dummyDetails = {
  depositFee: dummyIncomeAccountingDetail,
  withdrawalFee: dummyIncomeAccountingDetail,
  tradingFee: dummyIncomeAccountingDetail,
  spreadFee: dummyIncomeAccountingDetail,
  liquidationFee: dummyIncomeAccountingDetail,
  guaranteedStopLossFee: dummyIncomeAccountingDetail,
};

export const dummyComprehensiveIncomeNeo: IComprehensiveIncomeNeo = {
  reportType: "comprehensive income",
  reportID: "RPT123456",
  reportName: "Comprehensive Income Report - March 2023",
  reportStartTime: 1677628800, // March 1, 2023
  reportEndTime: 1679887999, // March 31, 2023
  netProfit: "15000",

  income: {
    weightedAverageCost: "0.95",
    details: dummyDetails,
  },

  costs: {
    weightedAverageCost: "0.90",
    details: {
      technicalProviderFee: dummyIncomeAccountingDetail,
      marketDataProviderFee: {
        weightedAverageCost: "0.85",
      },
      newCoinListingCost: {
        weightedAverageCost: "0.80",
      },
    },
  },
  operatingExpenses: {
    weightedAverageCost: "0.75",
    details: {
      salaries: "20000",
      rent: "5000",
      marketing: "3000",
      rebateExpenses: dummyIncomeAccountingDetail,
    },
  },
  financialCosts: {
    weightedAverageCost: "0.70",
    details: {
      interestExpense: "1000",
      fiatToCryptocurrencyConversionLosses: "500",
      cryptocurrencyToFiatConversionLosses: "300",
      fiatToFiatConversionLosses: "200",
      cryptocurrencyForexLosses: dummyIncomeAccountingDetail,
    },
  },
  otherGainLosses: {
    weightedAverageCost: "0.65",
    details: {
      investmentGains: "800",
      forexGains: "600",
      cryptocurrencyGains: dummyIncomeAccountingDetail,
    },
  },
};

export const dummyComprehensiveIncomeResponse: IComprehensiveIncomeResponse = {
  currentReport: dummyComprehensiveIncomeNeo,
  previousReport: dummyComprehensiveIncomeNeo,
  lastYearReport: dummyComprehensiveIncomeNeo,
};
