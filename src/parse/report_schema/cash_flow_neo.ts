import { z } from "zod";

// Info: create validation function (20240325 - Shirley)
const CashDetailSchema = z.object({
  weightedAverageCost: z.string(),
  breakdown: z
    .object({
      USD: z.object({
        amount: z.string(),
        weightedAverageCost: z.string(),
      }),
    })
    .optional(),
});

const NonCashDetailSchema = z.object({
  weightedAverageCost: z.string(),
  breakdown: z.object({
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
  }),
});

export const CashFlowNeoSchema = z.object({
  reportType: z.string(),
  reportID: z.string(),
  reportName: z.string(),
  reportStartTime: z.number(),
  reportEndTime: z.number(),
  supplementalScheduleOfNonCashOperatingActivities: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      cryptocurrenciesPaidToCustomersForPerpetualContractProfits: z.object({
        weightedAverageCost: z.string(),
      }),
      cryptocurrenciesDepositedByCustomers: NonCashDetailSchema,
      cryptocurrenciesWithdrawnByCustomers: NonCashDetailSchema,
      cryptocurrenciesPaidToSuppliersForExpenses: NonCashDetailSchema,
      cryptocurrencyInflows: NonCashDetailSchema,
      cryptocurrencyOutflows: NonCashDetailSchema,
      purchaseOfCryptocurrenciesWithNonCashConsideration: NonCashDetailSchema,
      disposalOfCryptocurrenciesForNonCashConsideration: NonCashDetailSchema,
      cryptocurrenciesReceivedFromCustomersAsTransactionFees:
        NonCashDetailSchema,
    }),
  }),
  otherSupplementaryItems: z.object({
    details: z.object({
      relatedToNonCash: z.object({
        cryptocurrenciesEndOfPeriod: z.object({
          weightedAverageCost: z.string(),
        }),
        cryptocurrenciesBeginningOfPeriod: z.object({
          weightedAverageCost: z.string(),
        }),
      }),
      relatedToCash: z.object({
        netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: z.object({
          weightedAverageCost: z.string(),
        }),
        cryptocurrenciesBeginningOfPeriod: z.object({
          weightedAverageCost: z.string(),
        }),
        cryptocurrenciesEndOfPeriod: z.object({
          weightedAverageCost: z.string(),
        }),
      }),
    }),
  }),
  operatingActivities: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      cashDepositedByCustomers: CashDetailSchema,
      cashWithdrawnByCustomers: CashDetailSchema,
      purchaseOfCryptocurrencies: CashDetailSchema,
      disposalOfCryptocurrencies: CashDetailSchema,
      cashReceivedFromCustomersAsTransactionFee: CashDetailSchema,
      cashPaidToSuppliersForExpenses: CashDetailSchema,
    }),
  }),
  investingActivities: z.object({
    weightedAverageCost: z.string(),
  }),
  financingActivities: z.object({
    weightedAverageCost: z.string(),
    details: z.object({
      proceedsFromIssuanceOfCommonStock: z.object({
        weightedAverageCost: z.string(),
      }),
      longTermDebt: z.object({
        weightedAverageCost: z.string(),
      }),
      shortTermBorrowings: z.object({
        weightedAverageCost: z.string(),
      }),
      paymentsOfDividends: z.object({
        weightedAverageCost: z.string(),
      }),
      treasuryStock: z.object({
        weightedAverageCost: z.string(),
      }),
    }),
  }),
});

// Info: create relevant types (20240325 - Shirley)
export type ICashDetail = z.infer<typeof CashDetailSchema>;
export type INonCashDetail = z.infer<typeof NonCashDetailSchema>;
export type ICashFlowNeo = z.infer<typeof CashFlowNeoSchema>;

export interface ICashFlowResponse {
  currentReport: z.infer<typeof CashFlowNeoSchema>;
  previousReport: z.infer<typeof CashFlowNeoSchema>;
  lastYearReport: z.infer<typeof CashFlowNeoSchema>;
}

export const dummyCashBreakdown = {
  USD: {
    amount: "0",
    weightedAverageCost: "0",
  },
};
