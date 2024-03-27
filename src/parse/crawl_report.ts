import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { BalanceSheetsNeoSchema } from "./report_schema/balance_sheets_neo";
import { ComprehensiveIncomeNeoSchema } from "./report_schema/comprehensive_income_neo";
import { CashFlowNeoSchema } from "./report_schema/cash_flow_neo";

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_transactionContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_timeSpanReport",
        type: "address",
      },
      {
        internalType: "address",
        name: "_reports",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "data",
        type: "bytes32[]",
      },
    ],
    name: "addTransactionRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "startTime",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "endTime",
        type: "int256",
      },
      {
        internalType: "bytes32",
        name: "reportName",
        type: "bytes32",
      },
    ],
    name: "generateReport",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getLatestTransactionTime",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "reportName",
        type: "string",
      },
      {
        internalType: "string",
        name: "reportType",
        type: "string",
      },
      {
        internalType: "string",
        name: "reportColumn",
        type: "string",
      },
    ],
    name: "getValue",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "transactionType",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "handlerAddress",
        type: "address",
      },
    ],
    name: "registerHandler",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_SP002",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_SP003",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_SP004",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_reportName",
        type: "bytes32",
      },
    ],
    name: "setRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const prisma = new PrismaClient();

// 創建智能合約實例
const provider = new ethers.JsonRpcProvider(`https://isuncoin.baifa.io`);

// 用於存儲 contractInstance 的快取
const contractInstancesCache = {};

async function putReport(lackReportEvidences) {
  /**
  1. get report name, address and report id from evidences table
  2. use crawlReport function to get report data
  3. put report data into evidences content column 
   **/
  // get the evidences which lack of content data, but have report address
  console.log("put report starting...");
  // loop the lackReportEvidences, use crawlReport function to get report data
  // 將所有異步操作包裝成 promise 並存入一個陣列中
  const updatePromises = lackReportEvidences.map(async (evidence) => {
    const reportAddress = evidence.report_address;
    // 檢查快取中是否已經有對應的 contractInstance
    if (!contractInstancesCache[reportAddress]) {
      // 如果沒有，則創建一個新的 contractInstance 並存入快取
      contractInstancesCache[reportAddress] = new ethers.Contract(
        reportAddress,
        abi,
        provider,
      );
    }
    // 從快取中獲取 contractInstance
    const contractInstance = contractInstancesCache[reportAddress];
    const reportName = evidence.report_name;
    const reportIdHex = "0x" + evidence.token_id;
    const reportId = BigInt(reportIdHex).toString();
    const reportData = await crawlReport(
      reportId,
      reportName,
      contractInstance,
    );
    // update the content column of the evidence
    await prisma.evidences.update({
      where: {
        evidence_id: evidence.evidence_id,
      },
      data: {
        content: reportData,
      },
    });
  });
  // 等待所有更新操作完成
  await Promise.all(updatePromises)
    .then(() => {
      console.log("put all report success");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
}

async function getContractValue(
  reportName,
  reportType,
  reportColumn,
  contractInstance,
) {
  try {
    // use getValue to get data
    const value = await contractInstance.getValue(
      reportName,
      reportType,
      reportColumn,
    );
    // formatted value
    let formattedValue = ethers.formatUnits(value, 18);
    if (formattedValue === "0.") {
      formattedValue = "0.0";
    }
    return formattedValue;
  } catch (error) {
    // Deprecated: print error (20240319 - Gibbs)
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function crawlReport(reportId, reportName, contractInstance) {
  console.log("start crawling report, report id", reportId);
  /*startTime*/ const startTime = await getContractValue(
    reportName,
    "time",
    "startTime",
    contractInstance,
  );
  /*endTime*/ const endTime = await getContractValue(
    reportName,
    "time",
    "endTime",
    contractInstance,
  );
  /*A001*/ const assets_details_cryptocurrency_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.totalAmountFairValue",
      contractInstance,
    );
  /*A002*/ const assets_details_cryptocurrency_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.USDT.amount",
      contractInstance,
    );
  /*A003*/ const assets_details_cryptocurrency_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.USDT.fairValue",
      contractInstance,
    );
  /*A004*/ const assets_totalAmountFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "assets.totalAmountFairValue",
    contractInstance,
  );
  /*A005*/ const totalAssetsFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "totalAssetsFairValue",
    contractInstance,
  );
  /*A006*/ const liabilities_details_userDeposit_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.totalAmountFairValue",
      contractInstance,
    );
  /*A007*/ const liabilities_details_userDeposit_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USDT.amount",
      contractInstance,
    );
  /*A008*/ const liabilities_details_userDeposit_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USDT.fairValue",
      contractInstance,
    );
  /*A009*/ const liabilities_totalAmountFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "liabilities.totalAmountFairValue",
    contractInstance,
  );
  /*A010*/ const equity_details_retainedEarnings_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.totalAmountFairValue",
      contractInstance,
    );
  /*A011*/ const equity_details_retainedEarnings_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USDT.amount",
      contractInstance,
    );
  /*A012*/ const equity_details_retainedEarnings_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USDT.fairValue",
      contractInstance,
    );
  /*A013*/ const equity_totalAmountFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "equity.totalAmountFairValue",
    contractInstance,
  );
  /*A014*/ const totalLiabilitiesAndEquityFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "totalLiabilitiesAndEquityFairValue",
    contractInstance,
  );
  /*A015*/ const assets_details_cryptocurrency_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.ETH.amount",
      contractInstance,
    );
  /*A016*/ const assets_details_cryptocurrency_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*A017*/ const equity_details_retainedEarnings_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.ETH.amount",
      contractInstance,
    );
  /*A018*/ const equity_details_retainedEarnings_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*A019*/ const assets_details_cashAndCashEquivalent_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cashAndCashEquivalent.totalAmountFairValue",
      contractInstance,
    );
  /*A020*/ const assets_details_accountsReceivable_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.totalAmountFairValue",
      contractInstance,
    );

  /*A022*/

  /*A025*/ const assets_details_accountsReceivable_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.USDT.amount",
      contractInstance,
    );
  /*A026*/ const assets_details_accountsReceivable_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.USDT.fairValue",
      contractInstance,
    );
  /*A027*/ const assets_details_accountsReceivable_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.BTC.amount",
      contractInstance,
    );
  /*A028*/ const assets_details_accountsReceivable_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.BTC.fairValue",
      contractInstance,
    );
  /*A029*/ const assets_details_accountsReceivable_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.ETH.amount",
      contractInstance,
    );
  /*A030*/ const assets_details_accountsReceivable_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*A031*/ const liabilities_details_accountsPayable_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.totalAmountFairValue",
      contractInstance,
    );
  /*A032*/ const liabilities_details_accountsPayable_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      " liabilities.details.accountsPayable.breakdown.USD.amount",
      contractInstance,
    );
  /*A033*/ const liabilities_details_accountsPayable_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.USD.fairValue",
      contractInstance,
    );
  /*A034*/ const liabilities_details_accountsPayable_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.USDT.amount",
      contractInstance,
    );
  /*A035*/ const liabilities_details_accountsPayable_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.USDT.fairValue",
      contractInstance,
    );
  /*A036*/ const liabilities_details_accountsPayable_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.BTC.amount",
      contractInstance,
    );
  /*A037*/ const liabilities_details_accountsPayable_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.BTC.fairValue",
      contractInstance,
    );
  /*A038*/ const liabilities_details_accountsPayable_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.ETH.amount",
      contractInstance,
    );
  /*A039*/ const liabilities_details_accountsPayable_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*A040*/ const liabilities_details_userDeposit_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USD.amount",
      contractInstance,
    );
  /*A041*/ const liabilities_details_userDeposit_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USD.fairValue",
      contractInstance,
    );
  /*A042*/ const liabilities_details_userDeposit_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.ETH.amount",
      contractInstance,
    );
  /*A043*/ const liabilities_details_userDeposit_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*A044*/ const liabilities_details_userDeposit_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.BTC.amount",
      contractInstance,
    );
  /*A045*/ const liabilities_details_userDeposit_breakdown_BTC_airValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.BTC.fairValue",
      contractInstance,
    );
  /*A046*/ const assets_details_cryptocurrency_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.BTC.amount",
      contractInstance,
    );
  /*A047*/ const assets_details_cryptocurrency_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.BTC.fairValue",
      contractInstance,
    );
  /*A048*/ const equity_details_retainedEarnings_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.BTC.amount",
      contractInstance,
    );
  /*A049*/ const equity_details_retainedEarnings_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.BTC.fairValue",
      contractInstance,
    );
  /*A050*/ const equity_details_retainedEarnings_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USD.amount",
      contractInstance,
    );
  /*A051*/ const equity_details_retainedEarnings_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USD.fairValue",
      contractInstance,
    );
  /*A052*/ const equity_details_otherCapitalReserve_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.fairValue",
      contractInstance,
    );
  /*A053*/ const equity_details_otherCapitalReserve_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USD.amount",
      contractInstance,
    );
  /*A054*/ const equity_details_otherCapitalReserve_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USD.fairValue",
      contractInstance,
    );
  /*A055*/ const equity_details_otherCapitalReserve_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USDT.amount",
      contractInstance,
    );
  /*A056*/ const equity_details_otherCapitalReserve_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USDT.fairValue",
      contractInstance,
    );
  /*A057*/ const equity_details_otherCapitalReserve_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.ETH.amount",
      contractInstance,
    );
  /*A058*/ const equity_details_otherCapitalReserve_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*A059*/ const equity_details_otherCapitalReserve_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.BTC.amount",
      contractInstance,
    );
  /*A060*/ const equity_details_otherCapitalReserve_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.BTC.fairValue",
      contractInstance,
    );
  /*A061*/ const assets_details_cashAndCashEquivalent_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cashAndCashEquivalent.breakdown.USD.amount",
      contractInstance,
    );
  /*A062*/ const assets_details_cashAndCashEquivalent_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cashAndCashEquivalent.breakdown.USD.fairValue",
      contractInstance,
    );
  /*B001*/ const income_details_depositFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.weightedAverageCost",
      contractInstance,
    );
  /*B002*/ const income_details_depositFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B003*/ const income_details_depositFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B004*/ const netProfit = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "netProfit",
    contractInstance,
  );
  /*B005*/ const income_details_withdrawalFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.weightedAverageCost",
      contractInstance,
    );
  /*B006*/ const income_details_withdrawalFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B007*/ const income_details_withdrawalFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B008*/ const costs_details_technicalProviderFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.weightedAverageCost",
      contractInstance,
    );
  /*B009*/ const costs_details_technicalProviderFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B010*/ const costs_details_technicalProviderFee_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.ETH.fairValue",
      contractInstance,
    );
  /*B011*/ const income_details_transactionFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.weightedAverageCost",
      contractInstance,
    );
  /*B012*/ const income_details_spreadFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.weightedAverageCost",
      contractInstance,
    );
  /*B013*/ const income_details_liquidationFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.weightedAverageCost",
      contractInstance,
    );
  /*B014*/ const income_details_guaranteedStopFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.weightedAverageCost",
      contractInstance,
    );
  /*B015*/ const costs_details_marketDataProviderFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.marketDataProviderFee.weightedAverageCost",
      contractInstance,
    );
  /*B016*/ const costs_details_newCoinListingCost_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.newCoinListingCost.weightedAverageCost",
      contractInstance,
    );
  /*B017*/ const operatingExpenses_details_salaries = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.details.salaries",
    contractInstance,
  );
  /*B018*/ const operatingExpenses_details_rent = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.details.rent",
    contractInstance,
  );
  /*B019*/ const operatingExpenses_details_marketing = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.details.marketing",
    contractInstance,
  );
  /*B020*/ const operatingExpenses_details_rebateExpenses_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.weightedAverageCost",
      contractInstance,
    );

  /*B021*/ const financialCosts_details_interestExpense =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.interestExpense",
      contractInstance,
    );
  /*B022*/ const financialCosts_details_cryptocurrencyForexLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses",
      contractInstance,
    );
  /*B023*/ const financialCosts_details_fiatToCryptocurrencyConversionLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.fiatToCryptocurrencyConversionLosses",
      contractInstance,
    );
  /*B024*/ const financialCosts_details_cryptocurrencyToFiatConversionLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyToFiatConversionLosses",
      contractInstance,
    );
  /*B025*/ const financialCosts_details_fiatToFiatConversionLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.fiatToFiatConversionLosses",
      contractInstance,
    );
  /*B026*/ const otherGainsLosses_details_investmentGains =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.investmentGains",
      contractInstance,
    );
  /*B027*/ const otherGainsLosses_details_forexGains = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "otherGainsLosses.details.forexGains",
    contractInstance,
  );
  /*B028*/ const otherGainsLosses_details_cryptocurrencyGains_weightedAverageCosts =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.weightedAverageCosts",
      contractInstance,
    );

  /*B029*/ const income_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "income.weightedAverageCost",
    contractInstance,
  );
  /*B030*/ const costs_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "costs.weightedAverageCost",
    contractInstance,
  );
  /*B031*/ const operatingExpenses_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.weightedAverageCost",
    contractInstance,
  );
  /*B032*/ const financialCosts_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "financialCosts.weightedAverageCost",
    contractInstance,
  );
  /*B033*/ const otherGainsLosses_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "otherGainsLosses.weightedAverageCost",
    contractInstance,
  );
  /*B034*/ const income_details_depositFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B035*/ const income_details_depositFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B036*/ const income_details_depositFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B037*/ const income_details_depositFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B038*/ const income_details_depositFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B039*/ const income_details_depositFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B040*/ const income_details_withdrawalFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B041*/ const income_details_withdrawalFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B042*/ const income_details_withdrawalFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B043*/ const income_details_withdrawalFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B044*/ const income_details_withdrawalFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B045*/ const income_details_withdrawalFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B046*/ const income_details_transactionFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B047*/ const income_details_transactionFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B048*/ const income_details_transactionFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B049*/ const income_details_transactionFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B050*/ const income_details_transactionFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B051*/ const income_details_transactionFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B052*/ const income_details_transactionFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B053*/ const income_details_transactionFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B054*/ const income_details_spreadFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      " income.details.spreadFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B055*/ const income_details_spreadFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B056*/ const income_details_spreadFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B057*/ const income_details_spreadFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B058*/ const income_details_spreadFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B059*/ const income_details_spreadFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B060*/ const income_details_spreadFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B061*/ const income_details_spreadFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B062*/ const income_details_liquidationFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B063*/ const income_details_liquidationFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B064*/ const income_details_liquidationFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B065*/ const income_details_liquidationFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B066*/ const income_details_liquidationFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B067*/ const income_details_liquidationFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      " income.details.liquidationFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B068*/ const income_details_liquidationFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B069*/ const income_details_liquidationFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B070*/ const income_details_guaranteedStopFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.ETH.amount",
      contractInstance,
    );
  /*B071*/ const income_details_guaranteedStopFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B072*/ const income_details_guaranteedStopFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B073*/ const income_details_guaranteedStopFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B074*/ const income_details_guaranteedStopFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      " income.details.guaranteedStopFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B075*/ const income_details_guaranteedStopFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B076*/ const income_details_guaranteedStopFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B077*/ const income_details_guaranteedStopFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B078*/ const operatingExpenses_details_rebateExpenses_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.ETH.amount",
      contractInstance,
    );
  /*B079*/ const operatingExpenses_details_rebateExpenses_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B080*/ const operatingExpenses_details_rebateExpenses_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.BTC.amount",
      contractInstance,
    );
  /*B081*/ const operatingExpenses_details_rebateExpenses_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B082*/ const operatingExpenses_details_rebateExpenses_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USDT.amount",
      contractInstance,
    );
  /*B083*/ const operatingExpenses_details_rebateExpenses_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B084*/ const operatingExpenses_details_rebateExpenses_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USD.amount",
      contractInstance,
    );
  /*B085*/ const operatingExpenses_details_rebateExpenses_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B086*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.ETH.amount",
      contractInstance,
    );
  /*B087*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B088*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.BTC.amount",
      contractInstance,
    );
  /*B089*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B090*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USDT.amount",
      contractInstance,
    );
  /*B091*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B092*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USD.amount",
      contractInstance,
    );
  /*B093*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B094*/ const costs_details_technicalProviderFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.BTC.amount",
      contractInstance,
    );
  /*B095*/ const costs_details_technicalProviderFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B096*/ const costs_details_technicalProviderFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USDT.amount",
      contractInstance,
    );
  /*B097*/ const costs_details_technicalProviderFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B098*/ const costs_details_technicalProviderFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USD.amount",
      contractInstance,
    );
  /*B099*/ const costs_details_technicalProviderFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*B100*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USDT.amount",
      contractInstance,
    );
  /*B101*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*B102*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.ETH.amount",
      contractInstance,
    );
  /*B103*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*B104*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.BTC.amount",
      contractInstance,
    );
  /*B105*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*B106*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USD.amount",
      contractInstance,
    );
  /*B107*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USD.weightedAverageCost",
      contractInstance,
    );

  /*C001*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.weightedAverageCost",
      contractInstance,
    );
  /*C002*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.USDT.amount",
      contractInstance,
    );
  /*C003*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C004*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost",
      contractInstance,
    );
  /*C005*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.USDT.amount",
      contractInstance,
    );
  /*C006*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C007*/ const supplementalScheduleOfNonCashOperatingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost",
      contractInstance,
    );
  /*C008*/ const otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesEndOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod.weightedAverageCost",
      contractInstance,
    );
  /*C009*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      " supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.weightedAverageCost",
      contractInstance,
    );
  /*C010*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.USDT.amount",
      contractInstance,
    );
  /*C011*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C012*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.weightedAverageCost",
      contractInstance,
    );
  /*C013*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.ETH.amount",
      contractInstance,
    );
  /*C014*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C015*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.weightedAverageCost",
      contractInstance,
    );
  /*C016*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.weightedAverageCost",
      contractInstance,
    );
  /*C023*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost",
      contractInstance,
    );
  /*C024*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost",
      contractInstance,
    );
  /*C025*/ const otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesBeginningOfPeriod.weightedAverageCost",
      contractInstance,
    );
  /*C027*/ const operatingActivities_details_cashDepositedByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashDepositedByCustomers.weightedAverageCost",
      contractInstance,
    );
  /*C028*/ const operatingActivities_details_cashWithdrawnByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashWithdrawnByCustomers.weightedAverageCost",
      contractInstance,
    );
  /*C029*/ const operatingActivities_details_purchaseOfCryptocurrencies_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.purchaseOfCryptocurrencies.weightedAverageCost",
      contractInstance,
    );
  /*C030*/ const operatingActivities_details_disposalOfCryptocurrencies_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.disposalOfCryptocurrencies.weightedAverageCost",
      contractInstance,
    );
  /*C031*/ const operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashReceivedFromCustomersAsTransactionFee.weightedAverageCost",
      contractInstance,
    );
  /*C034*/ const operatingActivities_details_cashPaidToSuppliersForExpenses_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashPaidToSuppliersForExpenses.weightedAverageCost",
      contractInstance,
    );
  /*C037*/ const operatingActivities_details_insuranceFundForPerpetualContracts_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.insuranceFundForPerpetualContracts.weightedAverageCost",
      contractInstance,
    );
  /*C041*/ const operatingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.weightedAverageCost",
      contractInstance,
    );
  /*C042*/ const investingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "investingActivities.weightedAverageCost",
      contractInstance,
    );
  /*C043*/ const financingActivities_details_proceedsFromIssuanceOfCommonStock_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.proceedsFromIssuanceOfCommonStock.weightedAverageCost",
      contractInstance,
    );
  /*C044*/ const financingActivities_details_longTermDebt_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.longTermDebt.weightedAverageCost",
      contractInstance,
    );
  /*C045*/ const financingActivities_details_shortTermBorrowings_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.shortTermBorrowings.weightedAverageCost",
      contractInstance,
    );
  /*C046*/ const financingActivities_details_paymentsOfDividends_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.paymentsOfDividends.weightedAverageCost",
      contractInstance,
    );
  /*C047*/ const financingActivities_details_treasuryStock_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.treasuryStock.weightedAverageCost",
      contractInstance,
    );
  /*C048*/ const financingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.weightedAverageCost",
      contractInstance,
    );
  /*C049*/ const otherSupplementaryItems_details_relatedToCash_netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToCash.netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash.weightedAverageCost",
      contractInstance,
    );
  /*C050*/ const otherSupplementaryItems_details_relatedToCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToCash.cryptocurrenciesBeginningOfPeriod.weightedAverageCost",
      contractInstance,
    );

  /*C051*/ const otherSupplementaryItems_details_relatedToCash_cryptocurrenciesEndOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToCash.cryptocurrenciesEndOfPeriod.weightedAverageCost",
      contractInstance,
    );

  /*C052*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.ETH.amount",
      contractInstance,
    );
  /*C053*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C054*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.BTC.amount",
      contractInstance,
    );
  /*C055*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C056*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.ETH.amount",
      contractInstance,
    );
  /*C057*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C058*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.BTC.amount",
      contractInstance,
    );
  /*C059*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.ETH.amount",
      contractInstance,
    );
  /*C060*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.weightedAverageCost",
      contractInstance,
    );
  /*C061*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C062*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.BTC.amount",
      contractInstance,
    );
  /*C063*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C064*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.USDT.amount",
      contractInstance,
    );
  /*C065*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C066*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.ETH.amount",
      contractInstance,
    );
  /*C067*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C068*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.BTC.amount",
      contractInstance,
    );
  /*C069*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C070*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.USDT.amount",
      contractInstance,
    );
  /*C071*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C072*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.ETH.amount",
      contractInstance,
    );
  /*C073*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C074*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.BTC.amount",
      contractInstance,
    );
  /*C075*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C088*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.ETH.amount",
      contractInstance,
    );
  /*C089*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C090*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.BTC.amount",
      contractInstance,
    );
  /*C091*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C092*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.USDT.amount",
      contractInstance,
    );
  /*C093*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C094*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.ETH.amount",
      contractInstance,
    );
  /*C095*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.ETH.weightedAverageCost",
      contractInstance,
    );
  /*C096*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.BTC.amount",
      contractInstance,
    );
  /*C097*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C098*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.USDT.amount",
      contractInstance,
    );
  /*C099*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C106*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.USDT.amount",
      contractInstance,
    );
  /*C107*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.USDT.weightedAverageCost",
      contractInstance,
    );
  /*C108*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.BTC.amount",
      contractInstance,
    );
  /*C109*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      " supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.BTC.weightedAverageCost",
      contractInstance,
    );
  /*C134*/ const operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashDepositedByCustomers.breakdown.USD.amount",
      contractInstance,
    );
  /*C135*/ const operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashDepositedByCustomers.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*C136*/ const operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashReceivedFromCustomersAsTransactionFee.breakdown.USD.amount",
      contractInstance,
    );
  /*C137*/ const operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashReceivedFromCustomersAsTransactionFee.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*C138*/ const operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashPaidToSuppliersForExpenses.breakdown.USD.amount",
      contractInstance,
    );
  /*C139*/ const operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashPaidToSuppliersForExpenses.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*C140*/ const operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashWithdrawnByCustomers.breakdown.USD.amount",
      contractInstance,
    );
  /*C141*/ const operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashWithdrawnByCustomers.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*C142*/ const operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.purchaseOfCryptocurrencies.breakdown.USD.amount",
      contractInstance,
    );
  /*C143*/ const operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.purchaseOfCryptocurrencies.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*C144*/ const operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.disposalOfCryptocurrencies.breakdown.USD.amount",
      contractInstance,
    );
  /*C145*/ const operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.disposalOfCryptocurrencies.breakdown.USD.weightedAverageCost",
      contractInstance,
    );
  /*C146*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToCustomersForPerpetualContractProfits_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToCustomersForPerpetualContractProfits.weightedAverageCost",
      contractInstance,
    );
  const balanceSheet = {
    reportID: reportId,
    reportName: reportName,
    assetsDetailsCryptocurrencyTotalAmountFairValue:
      assets_details_cryptocurrency_totalAmountFairValue,
    assets_details_cryptocurrency_breakdown_USDT_amount:
      assets_details_cryptocurrency_breakdown_USDT_amount,
    assets_details_cryptocurrency_breakdown_USDT_fairValue:
      assets_details_cryptocurrency_breakdown_USDT_fairValue,
    assets_totalAmountFairValue: assets_totalAmountFairValue,
    totalAssetsFairValue: totalAssetsFairValue,
    liabilities_details_userDeposit_totalAmountFairValue:
      liabilities_details_userDeposit_totalAmountFairValue,
    liabilities_details_userDeposit_breakdown_USDT_amount:
      liabilities_details_userDeposit_breakdown_USDT_amount,
    liabilities_details_userDeposit_breakdown_USDT_fairValue:
      liabilities_details_userDeposit_breakdown_USDT_fairValue,
    liabilities_totalAmountFairValue: liabilities_totalAmountFairValue,
    equity_details_retainedEarnings_totalAmountFairValue:
      equity_details_retainedEarnings_totalAmountFairValue,
    equity_details_retainedEarnings_breakdown_USDT_amount:
      equity_details_retainedEarnings_breakdown_USDT_amount,
    equity_details_retainedEarnings_breakdown_USDT_fairValue:
      equity_details_retainedEarnings_breakdown_USDT_fairValue,
    equity_totalAmountFairValue: equity_totalAmountFairValue,
    totalLiabilitiesAndEquityFairValue: totalLiabilitiesAndEquityFairValue,
    assets_details_cryptocurrency_breakdown_ETH_amount:
      assets_details_cryptocurrency_breakdown_ETH_amount,
    assets_details_cryptocurrency_breakdown_ETH_fairValue:
      assets_details_cryptocurrency_breakdown_ETH_fairValue,
    equity_details_retainedEarnings_breakdown_ETH_amount:
      equity_details_retainedEarnings_breakdown_ETH_amount,
    equity_details_retainedEarnings_breakdown_ETH_fairValue:
      equity_details_retainedEarnings_breakdown_ETH_fairValue,
    assets_details_cashAndCashEquivalent_totalAmountFairValue:
      assets_details_cashAndCashEquivalent_totalAmountFairValue,
    assets_details_accountsReceivable_totalAmountFairValue:
      assets_details_accountsReceivable_totalAmountFairValue,
    assets_details_accountsReceivable_breakdown_USDT_amount:
      assets_details_accountsReceivable_breakdown_USDT_amount,
    assets_details_accountsReceivable_breakdown_USDT_fairValue:
      assets_details_accountsReceivable_breakdown_USDT_fairValue,
    assets_details_accountsReceivable_breakdown_BTC_amount:
      assets_details_accountsReceivable_breakdown_BTC_amount,
    assets_details_accountsReceivable_breakdown_BTC_fairValue:
      assets_details_accountsReceivable_breakdown_BTC_fairValue,
    assets_details_accountsReceivable_breakdown_ETH_amount:
      assets_details_accountsReceivable_breakdown_ETH_amount,
    assets_details_accountsReceivable_breakdown_ETH_fairValue:
      assets_details_accountsReceivable_breakdown_ETH_fairValue,
    liabilities_details_accountsPayable_totalAmountFairValue:
      liabilities_details_accountsPayable_totalAmountFairValue,
    liabilities_details_accountsPayable_breakdown_USD_amount:
      liabilities_details_accountsPayable_breakdown_USD_amount,
    liabilities_details_accountsPayable_breakdown_USD_fairValue:
      liabilities_details_accountsPayable_breakdown_USD_fairValue,
    liabilities_details_accountsPayable_breakdown_USDT_amount:
      liabilities_details_accountsPayable_breakdown_USDT_amount,
    liabilities_details_accountsPayable_breakdown_USDT_fairValue:
      liabilities_details_accountsPayable_breakdown_USDT_fairValue,
    liabilities_details_accountsPayable_breakdown_BTC_amount:
      liabilities_details_accountsPayable_breakdown_BTC_amount,
    liabilities_details_accountsPayable_breakdown_BTC_fairValue:
      liabilities_details_accountsPayable_breakdown_BTC_fairValue,
    liabilities_details_accountsPayable_breakdown_ETH_amount:
      liabilities_details_accountsPayable_breakdown_ETH_amount,
    liabilities_details_accountsPayable_breakdown_ETH_fairValue:
      liabilities_details_accountsPayable_breakdown_ETH_fairValue,
    liabilities_details_userDeposit_breakdown_USD_amount:
      liabilities_details_userDeposit_breakdown_USD_amount,
    liabilities_details_userDeposit_breakdown_USD_fairValue:
      liabilities_details_userDeposit_breakdown_USD_fairValue,
    liabilities_details_userDeposit_breakdown_ETH_amount:
      liabilities_details_userDeposit_breakdown_ETH_amount,
    liabilities_details_userDeposit_breakdown_ETH_fairValue:
      liabilities_details_userDeposit_breakdown_ETH_fairValue,
    liabilities_details_userDeposit_breakdown_BTC_amount:
      liabilities_details_userDeposit_breakdown_BTC_amount,
    liabilities_details_userDeposit_breakdown_BTC_airValue:
      liabilities_details_userDeposit_breakdown_BTC_airValue,
    assets_details_cryptocurrency_breakdown_BTC_amount:
      assets_details_cryptocurrency_breakdown_BTC_amount,
    assets_details_cryptocurrency_breakdown_BTC_fairValue:
      assets_details_cryptocurrency_breakdown_BTC_fairValue,
    equity_details_retainedEarnings_breakdown_BTC_amount:
      equity_details_retainedEarnings_breakdown_BTC_amount,
    equity_details_retainedEarnings_breakdown_BTC_fairValue:
      equity_details_retainedEarnings_breakdown_BTC_fairValue,
    equity_details_retainedEarnings_breakdown_USD_amount:
      equity_details_retainedEarnings_breakdown_USD_amount,
    equity_details_retainedEarnings_breakdown_USD_fairValue:
      equity_details_retainedEarnings_breakdown_USD_fairValue,
    equity_details_otherCapitalReserve_fairValue:
      equity_details_otherCapitalReserve_fairValue,
    equity_details_otherCapitalReserve_breakdown_USD_amount:
      equity_details_otherCapitalReserve_breakdown_USD_amount,
    equity_details_otherCapitalReserve_breakdown_USD_fairValue:
      equity_details_otherCapitalReserve_breakdown_USD_fairValue,
    equity_details_otherCapitalReserve_breakdown_USDT_amount:
      equity_details_otherCapitalReserve_breakdown_USDT_amount,
    equity_details_otherCapitalReserve_breakdown_USDT_fairValue:
      equity_details_otherCapitalReserve_breakdown_USDT_fairValue,
    equity_details_otherCapitalReserve_breakdown_ETH_amount:
      equity_details_otherCapitalReserve_breakdown_ETH_amount,
    equity_details_otherCapitalReserve_breakdown_ETH_fairValue:
      equity_details_otherCapitalReserve_breakdown_ETH_fairValue,
    equity_details_otherCapitalReserve_breakdown_BTC_amount:
      equity_details_otherCapitalReserve_breakdown_BTC_amount,
    equity_details_otherCapitalReserve_breakdown_BTC_fairValue:
      equity_details_otherCapitalReserve_breakdown_BTC_fairValue,
    assets_details_cashAndCashEquivalent_breakdown_USD_amount:
      assets_details_cashAndCashEquivalent_breakdown_USD_amount,
    assets_details_cashAndCashEquivalent_breakdown_USD_fairValue:
      assets_details_cashAndCashEquivalent_breakdown_USD_fairValue,
    startTime: startTime,
    endTime: endTime,
  };
  const comprehensiveIncome = {
    reportID: reportId,
    reportName: reportName,
    income_details_depositFee_weightedAverageCost:
      income_details_depositFee_weightedAverageCost,
    income_details_depositFee_breakdown_USDT_amount:
      income_details_depositFee_breakdown_USDT_amount,
    income_details_depositFee_breakdown_USDT_weightedAverageCost:
      income_details_depositFee_breakdown_USDT_weightedAverageCost,
    netProfit: netProfit,
    income_details_withdrawalFee_weightedAverageCost:
      income_details_withdrawalFee_weightedAverageCost,
    income_details_withdrawalFee_breakdown_USDT_amount:
      income_details_withdrawalFee_breakdown_USDT_amount,
    income_details_withdrawalFee_breakdown_USDT_weightedAverageCost:
      income_details_withdrawalFee_breakdown_USDT_weightedAverageCost,
    costs_details_technicalProviderFee_weightedAverageCost:
      costs_details_technicalProviderFee_weightedAverageCost,
    costs_details_technicalProviderFee_breakdown_ETH_amount:
      costs_details_technicalProviderFee_breakdown_ETH_amount,
    costs_details_technicalProviderFee_breakdown_ETH_fairValue:
      costs_details_technicalProviderFee_breakdown_ETH_fairValue,
    income_details_transactionFee_weightedAverageCost:
      income_details_transactionFee_weightedAverageCost,
    income_details_spreadFee_weightedAverageCost:
      income_details_spreadFee_weightedAverageCost,
    income_details_liquidationFee_weightedAverageCost:
      income_details_liquidationFee_weightedAverageCost,
    income_details_guaranteedStopFee_weightedAverageCost:
      income_details_guaranteedStopFee_weightedAverageCost,
    costs_details_marketDataProviderFee_weightedAverageCost:
      costs_details_marketDataProviderFee_weightedAverageCost,
    costs_details_newCoinListingCost_weightedAverageCost:
      costs_details_newCoinListingCost_weightedAverageCost,
    operatingExpenses_details_salaries: operatingExpenses_details_salaries,
    operatingExpenses_details_rent: operatingExpenses_details_rent,
    operatingExpenses_details_marketing: operatingExpenses_details_marketing,
    operatingExpenses_details_rebateExpenses_weightedAverageCost:
      operatingExpenses_details_rebateExpenses_weightedAverageCost,
    financialCosts_details_interestExpense:
      financialCosts_details_interestExpense,
    financialCosts_details_cryptocurrencyForexLosses:
      financialCosts_details_cryptocurrencyForexLosses,
    financialCosts_details_fiatToCryptocurrencyConversionLosses:
      financialCosts_details_fiatToCryptocurrencyConversionLosses,
    financialCosts_details_cryptocurrencyToFiatConversionLosses:
      financialCosts_details_cryptocurrencyToFiatConversionLosses,
    financialCosts_details_fiatToFiatConversionLosses:
      financialCosts_details_fiatToFiatConversionLosses,
    otherGainsLosses_details_investmentGains:
      otherGainsLosses_details_investmentGains,
    otherGainsLosses_details_forexGains: otherGainsLosses_details_forexGains,
    otherGainsLosses_details_cryptocurrencyGains_weightedAverageCosts:
      otherGainsLosses_details_cryptocurrencyGains_weightedAverageCosts,
    income_weightedAverageCost: income_weightedAverageCost,
    costs_weightedAverageCost: costs_weightedAverageCost,
    operatingExpenses_weightedAverageCost:
      operatingExpenses_weightedAverageCost,
    financialCosts_weightedAverageCost: financialCosts_weightedAverageCost,
    otherGainsLosses_weightedAverageCost: otherGainsLosses_weightedAverageCost,
    income_details_depositFee_breakdown_ETH_amount:
      income_details_depositFee_breakdown_ETH_amount,
    income_details_depositFee_breakdown_ETH_weightedAverageCost:
      income_details_depositFee_breakdown_ETH_weightedAverageCost,
    income_details_depositFee_breakdown_BTC_amount:
      income_details_depositFee_breakdown_BTC_amount,
    income_details_depositFee_breakdown_BTC_weightedAverageCost:
      income_details_depositFee_breakdown_BTC_weightedAverageCost,
    income_details_depositFee_breakdown_USD_amount:
      income_details_depositFee_breakdown_USD_amount,
    income_details_depositFee_breakdown_USD_weightedAverageCost:
      income_details_depositFee_breakdown_USD_weightedAverageCost,
    income_details_withdrawalFee_breakdown_ETH_amount:
      income_details_withdrawalFee_breakdown_ETH_amount,
    income_details_withdrawalFee_breakdown_ETH_weightedAverageCost:
      income_details_withdrawalFee_breakdown_ETH_weightedAverageCost,
    income_details_withdrawalFee_breakdown_BTC_amount:
      income_details_withdrawalFee_breakdown_BTC_amount,
    income_details_withdrawalFee_breakdown_BTC_weightedAverageCost:
      income_details_withdrawalFee_breakdown_BTC_weightedAverageCost,
    income_details_withdrawalFee_breakdown_USD_amount:
      income_details_withdrawalFee_breakdown_USD_amount,
    income_details_withdrawalFee_breakdown_USD_weightedAverageCost:
      income_details_withdrawalFee_breakdown_USD_weightedAverageCost,
    income_details_transactionFee_breakdown_ETH_amount:
      income_details_transactionFee_breakdown_ETH_amount,
    income_details_transactionFee_breakdown_ETH_weightedAverageCost:
      income_details_transactionFee_breakdown_ETH_weightedAverageCost,
    income_details_transactionFee_breakdown_BTC_amount:
      income_details_transactionFee_breakdown_BTC_amount,
    income_details_transactionFee_breakdown_BTC_weightedAverageCost:
      income_details_transactionFee_breakdown_BTC_weightedAverageCost,
    income_details_transactionFee_breakdown_USDT_amount:
      income_details_transactionFee_breakdown_USDT_amount,
    income_details_transactionFee_breakdown_USDT_weightedAverageCost:
      income_details_transactionFee_breakdown_USDT_weightedAverageCost,
    income_details_transactionFee_breakdown_USD_amount:
      income_details_transactionFee_breakdown_USD_amount,
    income_details_transactionFee_breakdown_USD_weightedAverageCost:
      income_details_transactionFee_breakdown_USD_weightedAverageCost,
    income_details_spreadFee_breakdown_ETH_amount:
      income_details_spreadFee_breakdown_ETH_amount,
    income_details_spreadFee_breakdown_ETH_weightedAverageCost:
      income_details_spreadFee_breakdown_ETH_weightedAverageCost,
    income_details_spreadFee_breakdown_BTC_amount:
      income_details_spreadFee_breakdown_BTC_amount,
    income_details_spreadFee_breakdown_BTC_weightedAverageCost:
      income_details_spreadFee_breakdown_BTC_weightedAverageCost,
    income_details_spreadFee_breakdown_USDT_amount:
      income_details_spreadFee_breakdown_USDT_amount,
    income_details_spreadFee_breakdown_USDT_weightedAverageCost:
      income_details_spreadFee_breakdown_USDT_weightedAverageCost,
    income_details_spreadFee_breakdown_USD_amount:
      income_details_spreadFee_breakdown_USD_amount,
    income_details_spreadFee_breakdown_USD_weightedAverageCost:
      income_details_spreadFee_breakdown_USD_weightedAverageCost,
    income_details_liquidationFee_breakdown_ETH_amount:
      income_details_liquidationFee_breakdown_ETH_amount,
    income_details_liquidationFee_breakdown_ETH_weightedAverageCost:
      income_details_liquidationFee_breakdown_ETH_weightedAverageCost,
    income_details_liquidationFee_breakdown_BTC_amount:
      income_details_liquidationFee_breakdown_BTC_amount,
    income_details_liquidationFee_breakdown_BTC_weightedAverageCost:
      income_details_liquidationFee_breakdown_BTC_weightedAverageCost,
    income_details_liquidationFee_breakdown_USDT_amount:
      income_details_liquidationFee_breakdown_USDT_amount,
    income_details_liquidationFee_breakdown_USDT_weightedAverageCost:
      income_details_liquidationFee_breakdown_USDT_weightedAverageCost,
    income_details_liquidationFee_breakdown_USD_amount:
      income_details_liquidationFee_breakdown_USD_amount,
    income_details_liquidationFee_breakdown_USD_weightedAverageCost:
      income_details_liquidationFee_breakdown_USD_weightedAverageCost,
    income_details_guaranteedStopFee_breakdown_ETH_amount:
      income_details_guaranteedStopFee_breakdown_ETH_amount,
    income_details_guaranteedStopFee_breakdown_ETH_weightedAverageCost:
      income_details_guaranteedStopFee_breakdown_ETH_weightedAverageCost,
    income_details_guaranteedStopFee_breakdown_BTC_amount:
      income_details_guaranteedStopFee_breakdown_BTC_amount,
    income_details_guaranteedStopFee_breakdown_BTC_weightedAverageCost:
      income_details_guaranteedStopFee_breakdown_BTC_weightedAverageCost,
    income_details_guaranteedStopFee_breakdown_USDT_amount:
      income_details_guaranteedStopFee_breakdown_USDT_amount,
    income_details_guaranteedStopFee_breakdown_USDT_weightedAverageCost:
      income_details_guaranteedStopFee_breakdown_USDT_weightedAverageCost,
    income_details_guaranteedStopFee_breakdown_USD_amount:
      income_details_guaranteedStopFee_breakdown_USD_amount,
    income_details_guaranteedStopFee_breakdown_USD_weightedAverageCost:
      income_details_guaranteedStopFee_breakdown_USD_weightedAverageCost,
    operatingExpenses_details_rebateExpenses_breakdown_ETH_amount:
      operatingExpenses_details_rebateExpenses_breakdown_ETH_amount,
    operatingExpenses_details_rebateExpenses_breakdown_ETH_weightedAverageCost:
      operatingExpenses_details_rebateExpenses_breakdown_ETH_weightedAverageCost,
    operatingExpenses_details_rebateExpenses_breakdown_BTC_amount:
      operatingExpenses_details_rebateExpenses_breakdown_BTC_amount,
    operatingExpenses_details_rebateExpenses_breakdown_BTC_weightedAverageCost:
      operatingExpenses_details_rebateExpenses_breakdown_BTC_weightedAverageCost,
    operatingExpenses_details_rebateExpenses_breakdown_USDT_amount:
      operatingExpenses_details_rebateExpenses_breakdown_USDT_amount,
    operatingExpenses_details_rebateExpenses_breakdown_USDT_weightedAverageCost:
      operatingExpenses_details_rebateExpenses_breakdown_USDT_weightedAverageCost,
    operatingExpenses_details_rebateExpenses_breakdown_USD_amount:
      operatingExpenses_details_rebateExpenses_breakdown_USD_amount,
    operatingExpenses_details_rebateExpenses_breakdown_USD_weightedAverageCost:
      operatingExpenses_details_rebateExpenses_breakdown_USD_weightedAverageCost,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_amount:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_amount,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_weightedAverageCost:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_weightedAverageCost,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_amount:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_amount,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_weightedAverageCost:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_weightedAverageCost,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_amount:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_amount,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_weightedAverageCost:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_weightedAverageCost,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_amount:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_amount,
    financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_weightedAverageCost:
      financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_weightedAverageCost,
    costs_details_technicalProviderFee_breakdown_BTC_amount:
      costs_details_technicalProviderFee_breakdown_BTC_amount,
    costs_details_technicalProviderFee_breakdown_BTC_weightedAverageCost:
      costs_details_technicalProviderFee_breakdown_BTC_weightedAverageCost,
    costs_details_technicalProviderFee_breakdown_USDT_amount:
      costs_details_technicalProviderFee_breakdown_USDT_amount,
    costs_details_technicalProviderFee_breakdown_USDT_weightedAverageCost:
      costs_details_technicalProviderFee_breakdown_USDT_weightedAverageCost,
    costs_details_technicalProviderFee_breakdown_USD_amount:
      costs_details_technicalProviderFee_breakdown_USD_amount,
    costs_details_technicalProviderFee_breakdown_USD_weightedAverageCost:
      costs_details_technicalProviderFee_breakdown_USD_weightedAverageCost,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_amount:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_amount,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_weightedAverageCost:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_weightedAverageCost,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_amount:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_amount,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_weightedAverageCost:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_weightedAverageCost,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_amount:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_amount,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_weightedAverageCost:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_weightedAverageCost,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_amount:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_amount,
    otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_weightedAverageCost:
      otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_weightedAverageCost,
    startTime: startTime,
    endTime: endTime,
  };
  const cashFlow = {
    reportID: reportId,
    reportName: reportName,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_weightedAverageCost,
    otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesEndOfPeriod_weightedAverageCost:
      otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesEndOfPeriod_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_weightedAverageCost,
    otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost:
      otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost,
    operatingActivities_details_cashDepositedByCustomers_weightedAverageCost:
      operatingActivities_details_cashDepositedByCustomers_weightedAverageCost,
    operatingActivities_details_cashWithdrawnByCustomers_weightedAverageCost:
      operatingActivities_details_cashWithdrawnByCustomers_weightedAverageCost,
    operatingActivities_details_purchaseOfCryptocurrencies_weightedAverageCost:
      operatingActivities_details_purchaseOfCryptocurrencies_weightedAverageCost,
    operatingActivities_details_disposalOfCryptocurrencies_weightedAverageCost:
      operatingActivities_details_disposalOfCryptocurrencies_weightedAverageCost,
    operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_weightedAverageCost:
      operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_weightedAverageCost,
    operatingActivities_details_cashPaidToSuppliersForExpenses_weightedAverageCost:
      operatingActivities_details_cashPaidToSuppliersForExpenses_weightedAverageCost,
    operatingActivities_details_insuranceFundForPerpetualContracts_weightedAverageCost:
      operatingActivities_details_insuranceFundForPerpetualContracts_weightedAverageCost,
    operatingActivities_weightedAverageCost:
      operatingActivities_weightedAverageCost,
    investingActivities_weightedAverageCost:
      investingActivities_weightedAverageCost,
    financingActivities_details_proceedsFromIssuanceOfCommonStock_weightedAverageCost:
      financingActivities_details_proceedsFromIssuanceOfCommonStock_weightedAverageCost,
    financingActivities_details_longTermDebt_weightedAverageCost:
      financingActivities_details_longTermDebt_weightedAverageCost,
    financingActivities_details_shortTermBorrowings_weightedAverageCost:
      financingActivities_details_shortTermBorrowings_weightedAverageCost,
    financingActivities_details_paymentsOfDividends_weightedAverageCost:
      financingActivities_details_paymentsOfDividends_weightedAverageCost,
    financingActivities_details_treasuryStock_weightedAverageCost:
      financingActivities_details_treasuryStock_weightedAverageCost,
    financingActivities_weightedAverageCost:
      financingActivities_weightedAverageCost,
    otherSupplementaryItems_details_relatedToCash_netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash_weightedAverageCost:
      otherSupplementaryItems_details_relatedToCash_netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash_weightedAverageCost,
    otherSupplementaryItems_details_relatedToCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost:
      otherSupplementaryItems_details_relatedToCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost,
    otherSupplementaryItems_details_relatedToCash_cryptocurrenciesEndOfPeriod_weightedAverageCost:
      otherSupplementaryItems_details_relatedToCash_cryptocurrenciesEndOfPeriod_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_amount:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_amount,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_weightedAverageCost,
    operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount:
      operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount,
    operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost:
      operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost,
    operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_amount:
      operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_amount,
    operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_weightedAverageCost:
      operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_weightedAverageCost,
    operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_amount:
      operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_amount,
    operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_weightedAverageCost:
      operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_weightedAverageCost,
    operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_amount:
      operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_amount,
    operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_weightedAverageCost:
      operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_weightedAverageCost,
    operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_amount:
      operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_amount,
    operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_weightedAverageCost:
      operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_weightedAverageCost,
    operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_amount:
      operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_amount,
    operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_weightedAverageCost:
      operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_weightedAverageCost,
    supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToCustomersForPerpetualContractProfits_weightedAverageCost:
      supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToCustomersForPerpetualContractProfits_weightedAverageCost,
    startTime: startTime,
    endTime: endTime,
  };
  // reportData
  const reportData = {
    balanceSheet: {
      reportID: balanceSheet.reportID,
      reportName: balanceSheet.reportName,
      reportStartTime: parseFloat(balanceSheet.startTime) * 10 ** 18,
      reportEndTime: parseFloat(balanceSheet.endTime) * 10 ** 18,
      reportType: "balance sheet",
      totalAssetsFairValue: balanceSheet.totalAssetsFairValue, //A005
      totalLiabilitiesAndEquityFairValue:
        balanceSheet.totalLiabilitiesAndEquityFairValue, //A014
      assets: {
        fairValue: balanceSheet.assets_totalAmountFairValue, //A004
        details: {
          cryptocurrency: {
            fairValue:
              balanceSheet.assetsDetailsCryptocurrencyTotalAmountFairValue, //A001
            breakdown: {
              USDT: {
                amount:
                  balanceSheet.assets_details_cryptocurrency_breakdown_USDT_amount, //A002
                fairValue:
                  balanceSheet.assets_details_cryptocurrency_breakdown_USDT_fairValue, //A003
              },
              ETH: {
                amount:
                  balanceSheet.assets_details_cryptocurrency_breakdown_ETH_amount, //A015
                fairValue:
                  balanceSheet.assets_details_cryptocurrency_breakdown_ETH_fairValue, //A016
              },
              BTC: {
                amount:
                  balanceSheet.assets_details_cryptocurrency_breakdown_BTC_amount, //A046
                fairValue:
                  balanceSheet.assets_details_cryptocurrency_breakdown_BTC_fairValue, //A047
              },
            },
          },
          cashAndCashEquivalent: {
            fairValue:
              balanceSheet.assets_details_cashAndCashEquivalent_totalAmountFairValue, //A019
            breakdown: {
              USD: {
                amount:
                  balanceSheet.assets_details_cashAndCashEquivalent_breakdown_USD_amount, //A061
                fairValue:
                  balanceSheet.assets_details_cashAndCashEquivalent_breakdown_USD_fairValue, //A062
              },
            },
          },
          accountsReceivable: {
            fairValue:
              balanceSheet.assets_details_accountsReceivable_totalAmountFairValue, //A020
            breakdown: {
              USDT: {
                amount:
                  balanceSheet.assets_details_accountsReceivable_breakdown_USDT_amount, //A025
                fairValue:
                  balanceSheet.assets_details_accountsReceivable_breakdown_USDT_fairValue, //A026
              },
              BTC: {
                amount:
                  balanceSheet.assets_details_accountsReceivable_breakdown_BTC_amount, //A027
                fairValue:
                  balanceSheet.assets_details_accountsReceivable_breakdown_BTC_fairValue, //A028
              },
              ETH: {
                amount:
                  balanceSheet.assets_details_accountsReceivable_breakdown_ETH_amount, //A029
                fairValue:
                  balanceSheet.assets_details_accountsReceivable_breakdown_ETH_fairValue, //A030
              },
            },
          },
        },
      },
      liabilities: {
        fairValue: balanceSheet.liabilities_totalAmountFairValue, //A009
        details: {
          userDeposit: {
            fairValue:
              balanceSheet.liabilities_details_userDeposit_totalAmountFairValue, //A006
            breakdown: {
              USDT: {
                amount:
                  balanceSheet.liabilities_details_userDeposit_breakdown_USDT_amount, //A007
                fairValue:
                  balanceSheet.liabilities_details_userDeposit_breakdown_USDT_fairValue, //A008
              },
              USD: {
                amount:
                  balanceSheet.liabilities_details_userDeposit_breakdown_USD_amount, //A040
                fairValue:
                  balanceSheet.liabilities_details_userDeposit_breakdown_USD_fairValue, //A041
              },
              ETH: {
                amount:
                  balanceSheet.liabilities_details_userDeposit_breakdown_ETH_amount, //A042
                fairValue:
                  balanceSheet.liabilities_details_userDeposit_breakdown_ETH_fairValue, //A043
              },
              BTC: {
                amount:
                  balanceSheet.liabilities_details_userDeposit_breakdown_BTC_amount, //A044
                fairValue:
                  balanceSheet.liabilities_details_userDeposit_breakdown_BTC_airValue, //A045
              },
            },
          },
          accountsPayable: {
            fairValue:
              balanceSheet.liabilities_details_accountsPayable_totalAmountFairValue, //A021
            breakdown: {
              USDT: {
                amount:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_USDT_amount, //A034
                fairValue:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_USDT_fairValue, //A035
              },
              USD: {
                amount:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_USD_amount, //A032
                fairValue:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_USD_fairValue, //A033
              },
              BTC: {
                amount:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_BTC_amount, //A036
                fairValue:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_BTC_fairValue, //A037
              },
              ETH: {
                amount:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_ETH_amount, //A038
                fairValue:
                  balanceSheet.liabilities_details_accountsPayable_breakdown_ETH_fairValue, //A039
              },
            },
          },
        },
      },
      equity: {
        fairValue: balanceSheet.equity_totalAmountFairValue, //A013
        details: {
          retainedEarning: {
            fairValue:
              balanceSheet.equity_details_retainedEarnings_totalAmountFairValue, //A010
            breakdown: {
              USDT: {
                amount:
                  balanceSheet.equity_details_retainedEarnings_breakdown_USDT_amount, //A011
                fairValue:
                  balanceSheet.equity_details_retainedEarnings_breakdown_USDT_fairValue, //A012
              },
              ETH: {
                amount:
                  balanceSheet.equity_details_retainedEarnings_breakdown_ETH_amount, //A017
                fairValue:
                  balanceSheet.equity_details_retainedEarnings_breakdown_ETH_fairValue, //A018
              },
              BTC: {
                amount:
                  balanceSheet.equity_details_retainedEarnings_breakdown_BTC_amount, //A048
                fairValue:
                  balanceSheet.equity_details_retainedEarnings_breakdown_BTC_fairValue, //A049
              },
              USD: {
                amount:
                  balanceSheet.equity_details_retainedEarnings_breakdown_USD_amount, //A050
                fairValue:
                  balanceSheet.equity_details_retainedEarnings_breakdown_USD_fairValue, //A051
              },
            },
          },
          otherCapitalReserve: {
            fairValue:
              balanceSheet.equity_details_otherCapitalReserve_fairValue, //A052
            breakdown: {
              USD: {
                amount:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_USD_amount, //A053
                fairValue:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_USD_fairValue, //A054
              },
              USDT: {
                amount:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_USDT_amount, //A055
                fairValue:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_USDT_fairValue, //A056
              },
              ETH: {
                amount:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_ETH_amount, //A057
                fairValue:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_ETH_fairValue, //A058
              },
              BTC: {
                amount:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_BTC_amount, //A059
                fairValue:
                  balanceSheet.equity_details_otherCapitalReserve_breakdown_BTC_fairValue, //A060
              },
            },
          },
        },
      },
    },
    comprehensiveIncome: {
      reportType: "comprehensive income",
      reportID: comprehensiveIncome.reportID,
      reportName: comprehensiveIncome.reportName,
      reportStartTime: parseFloat(comprehensiveIncome.startTime) * 10 ** 18,
      reportEndTime: parseFloat(comprehensiveIncome.endTime) * 10 ** 18,
      netProfit: comprehensiveIncome.netProfit, //B004
      income: {
        weightedAverageCost: comprehensiveIncome.income_weightedAverageCost, //B029
        details: {
          depositFee: {
            weightedAverageCost:
              comprehensiveIncome.income_details_depositFee_weightedAverageCost, //B001
            breakdown: {
              USDT: {
                amount:
                  comprehensiveIncome.income_details_depositFee_breakdown_USDT_amount, //B002
                weightedAverageCost:
                  comprehensiveIncome.income_details_depositFee_breakdown_USDT_weightedAverageCost, //B003
              },
              ETH: {
                amount:
                  comprehensiveIncome.income_details_depositFee_breakdown_ETH_amount, //B034
                weightedAverageCost:
                  comprehensiveIncome.income_details_depositFee_breakdown_ETH_weightedAverageCost, //B035
              },
              BTC: {
                amount:
                  comprehensiveIncome.income_details_depositFee_breakdown_BTC_amount, //B036
                weightedAverageCost:
                  comprehensiveIncome.income_details_depositFee_breakdown_BTC_weightedAverageCost, //B037
              },
              USD: {
                amount:
                  comprehensiveIncome.income_details_depositFee_breakdown_USD_amount, //B038
                weightedAverageCost:
                  comprehensiveIncome.income_details_depositFee_breakdown_USD_weightedAverageCost, //B039
              },
            },
          },
          withdrawalFee: {
            weightedAverageCost:
              comprehensiveIncome.income_details_withdrawalFee_weightedAverageCost, //B005
            breakdown: {
              USDT: {
                amount:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_USDT_amount, //B006
                weightedAverageCost:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_USDT_weightedAverageCost, //B007
              },
              ETH: {
                amount:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_ETH_amount, //B040
                weightedAverageCost:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_ETH_weightedAverageCost, //B041
              },
              BTC: {
                amount:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_BTC_amount, //B042
                weightedAverageCost:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_BTC_weightedAverageCost, //B043
              },
              USD: {
                amount:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_USD_amount, //B044
                weightedAverageCost:
                  comprehensiveIncome.income_details_withdrawalFee_breakdown_USD_weightedAverageCost, //B045
              },
            },
          },
          tradingFee: {
            weightedAverageCost:
              comprehensiveIncome.income_details_transactionFee_weightedAverageCost, //B011
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.income_details_transactionFee_breakdown_ETH_amount, //B046
                weightedAverageCost:
                  comprehensiveIncome.income_details_transactionFee_breakdown_ETH_weightedAverageCost, //B047
              },
              BTC: {
                amount:
                  comprehensiveIncome.income_details_transactionFee_breakdown_BTC_amount, //B048
                weightedAverageCost:
                  comprehensiveIncome.income_details_transactionFee_breakdown_BTC_weightedAverageCost, //B049
              },
              USDT: {
                amount:
                  comprehensiveIncome.income_details_transactionFee_breakdown_USDT_amount, //B050
                weightedAverageCost:
                  comprehensiveIncome.income_details_transactionFee_breakdown_USDT_weightedAverageCost, //B051
              },
              USD: {
                amount:
                  comprehensiveIncome.income_details_transactionFee_breakdown_USD_amount, //B052
                weightedAverageCost:
                  comprehensiveIncome.income_details_transactionFee_breakdown_USD_weightedAverageCost, //B053
              },
            },
          },
          spreadFee: {
            weightedAverageCost:
              comprehensiveIncome.income_details_spreadFee_weightedAverageCost, //B012
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.income_details_spreadFee_breakdown_ETH_amount, //B054
                weightedAverageCost:
                  comprehensiveIncome.income_details_spreadFee_breakdown_ETH_weightedAverageCost, //B055
              },
              BTC: {
                amount:
                  comprehensiveIncome.income_details_spreadFee_breakdown_BTC_amount, //B056
                weightedAverageCost:
                  comprehensiveIncome.income_details_spreadFee_breakdown_BTC_weightedAverageCost, //B057
              },
              USDT: {
                amount:
                  comprehensiveIncome.income_details_spreadFee_breakdown_USDT_amount, //B058
                weightedAverageCost:
                  comprehensiveIncome.income_details_spreadFee_breakdown_USDT_weightedAverageCost, //B059
              },
              USD: {
                amount:
                  comprehensiveIncome.income_details_spreadFee_breakdown_USD_amount, //B060
                weightedAverageCost:
                  comprehensiveIncome.income_details_spreadFee_breakdown_USD_weightedAverageCost, //B061
              },
            },
          },
          liquidationFee: {
            weightedAverageCost:
              comprehensiveIncome.income_details_liquidationFee_weightedAverageCost, //B013
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_ETH_amount, //B062
                weightedAverageCost:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_ETH_weightedAverageCost, //B063
              },
              BTC: {
                amount:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_BTC_amount, //B064
                weightedAverageCost:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_BTC_weightedAverageCost, //B065
              },
              USDT: {
                amount:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_USDT_amount, //B066
                weightedAverageCost:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_USDT_weightedAverageCost, //B067
              },
              USD: {
                amount:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_USD_amount, //B068
                weightedAverageCost:
                  comprehensiveIncome.income_details_liquidationFee_breakdown_USD_weightedAverageCost, //B069
              },
            },
          },
          guaranteedStopLossFee: {
            weightedAverageCost:
              comprehensiveIncome.income_details_guaranteedStopFee_weightedAverageCost, //B014
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_ETH_amount, //B070
                weightedAverageCost:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_ETH_weightedAverageCost, //B071
              },
              BTC: {
                amount:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_BTC_amount, //B072
                weightedAverageCost:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_BTC_weightedAverageCost, //B073
              },
              USDT: {
                amount:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_USDT_amount, //B074
                weightedAverageCost:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_USDT_weightedAverageCost, //B075
              },
              USD: {
                amount:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_USD_amount, //B076
                weightedAverageCost:
                  comprehensiveIncome.income_details_guaranteedStopFee_breakdown_USD_weightedAverageCost, //B077
              },
            },
          },
        },
      },
      costs: {
        weightedAverageCost: comprehensiveIncome.costs_weightedAverageCost, //B030
        details: {
          technicalProviderFee: {
            weightedAverageCost:
              comprehensiveIncome.costs_details_technicalProviderFee_weightedAverageCost, //B008
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_ETH_amount, //B009
                weightedAverageCost:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_ETH_fairValue, //B010
              },
              BTC: {
                amount:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_BTC_amount, //B094
                weightedAverageCost:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_BTC_weightedAverageCost, //B095
              },
              USDT: {
                amount:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_USDT_amount, //B096
                weightedAverageCost:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_USDT_weightedAverageCost, //B097
              },
              USD: {
                amount:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_USD_amount, //B098
                weightedAverageCost:
                  comprehensiveIncome.costs_details_technicalProviderFee_breakdown_USD_weightedAverageCost, //B099
              },
            },
          },
          marketDataProviderFee: {
            weightedAverageCost:
              comprehensiveIncome.costs_details_marketDataProviderFee_weightedAverageCost, //B015
          },
          newCoinListingCost: {
            weightedAverageCost:
              comprehensiveIncome.costs_details_newCoinListingCost_weightedAverageCost, //B016
          },
        },
      },

      operatingExpenses: {
        weightedAverageCost:
          comprehensiveIncome.operatingExpenses_weightedAverageCost, //B031
        details: {
          salaries: comprehensiveIncome.operatingExpenses_details_salaries, //B017
          rent: comprehensiveIncome.operatingExpenses_details_rent, //B018
          marketing: comprehensiveIncome.operatingExpenses_details_marketing, //B019
          rebateExpenses: {
            weightedAverageCost:
              comprehensiveIncome.operatingExpenses_details_rebateExpenses_weightedAverageCost, //B020
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_ETH_amount, //B078
                weightedAverageCost:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_ETH_weightedAverageCost, //B079
              },
              BTC: {
                amount:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_BTC_amount, //B080
                weightedAverageCost:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_BTC_weightedAverageCost, //B081
              },
              USDT: {
                amount:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_USDT_amount, //B082
                weightedAverageCost:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_USDT_weightedAverageCost, //B083
              },
              USD: {
                amount:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_USD_amount, //B084
                weightedAverageCost:
                  comprehensiveIncome.operatingExpenses_details_rebateExpenses_breakdown_USD_weightedAverageCost, //B085
              },
            },
          },
        },
      },

      financialCosts: {
        weightedAverageCost:
          comprehensiveIncome.financialCosts_weightedAverageCost, //B032
        details: {
          interestExpense:
            comprehensiveIncome.financialCosts_details_interestExpense, //B021
          cryptocurrencyForexLosses: {
            weightedAverageCost:
              comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses, //B022
            breakdown: {
              ETH: {
                amount:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_amount,
                weightedAverageCost:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_weightedAverageCost,
              },
              BTC: {
                amount:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_amount,
                weightedAverageCost:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_weightedAverageCost,
              },
              USDT: {
                amount:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_amount,
                weightedAverageCost:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_weightedAverageCost,
              },
              USD: {
                amount:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_amount,
                weightedAverageCost:
                  comprehensiveIncome.financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_weightedAverageCost,
              },
            },
          },
          fiatToCryptocurrencyConversionLosses:
            comprehensiveIncome.financialCosts_details_fiatToCryptocurrencyConversionLosses, //B023
          cryptocurrencyToFiatConversionLosses:
            comprehensiveIncome.financialCosts_details_cryptocurrencyToFiatConversionLosses, //B024
          fiatToFiatConversionLosses:
            comprehensiveIncome.financialCosts_details_fiatToFiatConversionLosses, //B025
        },
      },

      otherGainLosses: {
        weightedAverageCost:
          comprehensiveIncome.otherGainsLosses_weightedAverageCost, //B033
        details: {
          investmentGains:
            comprehensiveIncome.otherGainsLosses_details_investmentGains, //B026
          forexGains: comprehensiveIncome.otherGainsLosses_details_forexGains, //B027
          cryptocurrencyGains: {
            weightedAverageCost:
              comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_weightedAverageCosts,
            breakdown: {
              USDT: {
                amount:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_amount, //B100
                weightedAverageCost:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_weightedAverageCost, //B101
              },
              ETH: {
                amount:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_amount, //B102
                weightedAverageCost:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_weightedAverageCost, //B103
              },
              BTC: {
                amount:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_amount, //B104
                weightedAverageCost:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_weightedAverageCost, //B105
              },
              USD: {
                amount:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_amount,
                weightedAverageCost:
                  comprehensiveIncome.otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_weightedAverageCost,
              },
            },
          },
        },
      },
    },
    cashFlow: {
      reportType: "cash flow sheet",
      reportID: cashFlow.reportID,
      reportName: cashFlow.reportName,
      reportStartTime: parseFloat(cashFlow.startTime) * 10 ** 18,
      reportEndTime: parseFloat(cashFlow.endTime) * 10 ** 18,
      supplementalScheduleOfNonCashOperatingActivities: {
        weightedAverageCost:
          cashFlow.supplementalScheduleOfNonCashOperatingActivities_weightedAverageCost, //C007
        details: {
          cryptocurrenciesPaidToCustomersForPerpetualContractProfits: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToCustomersForPerpetualContractProfits_weightedAverageCost,
          },
          cryptocurrenciesDepositedByCustomers: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_weightedAverageCost, //C001
            breakdown: {
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_amount, //C002
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_weightedAverageCost, //C003
              },
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_amount, //C052
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_weightedAverageCost, //C053
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_amount, //C054
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_weightedAverageCost, //C055
              },
            },
          },
          cryptocurrenciesWithdrawnByCustomers: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_weightedAverageCost, //C009
            breakdown: {
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_amount, //C010
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_weightedAverageCost, //C011
              },
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_amount, //C056
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_weightedAverageCost, //C057
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_amount, //C058
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_weightedAverageCost, //C059
              },
            },
          },
          cryptocurrenciesPaidToSuppliersForExpenses: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_weightedAverageCost, //C012
            breakdown: {
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_amount, //C013
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_weightedAverageCost, //C014
              },
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_amount, //C106
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_weightedAverageCost, //C107
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_amount, //C108
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_weightedAverageCost, //C109
              },
            },
          },
          cryptocurrencyInflows: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_weightedAverageCost, //C015
            breakdown: {
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_amount, //C060
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_weightedAverageCost, //C061
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_amount, //C062
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_weightedAverageCost, //C063
              },
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_amount, //C064
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_weightedAverageCost, //C065
              },
            },
          },
          cryptocurrencyOutflows: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_weightedAverageCost, //C016
            breakdown: {
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_amount, //C066
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_weightedAverageCost, //C067
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_amount, //C068
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_weightedAverageCost, //C069
              },
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_amount, //C070
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_weightedAverageCost, //C071
              },
            },
          },
          purchaseOfCryptocurrenciesWithNonCashConsideration: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_weightedAverageCost, //C023
            breakdown: {
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount, //C088
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost, //C089
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount, //C090
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost, //C091
              },
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount, //C092
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_weightedAverageCost, //C093
              },
            },
          },
          disposalOfCryptocurrenciesForNonCashConsideration: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_weightedAverageCost, //C024
            breakdown: {
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_amount, //C094
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_weightedAverageCost, //C095
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_amount, //C096
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_weightedAverageCost, //C097
              },
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_amount, //C098
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_weightedAverageCost, //C099
              },
            },
          },
          cryptocurrenciesReceivedFromCustomersAsTransactionFees: {
            weightedAverageCost:
              cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_weightedAverageCost, //C025
            breakdown: {
              USDT: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount, //C072
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost, //C073
              },
              ETH: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount, //C074
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost, //C075
              },
              BTC: {
                amount:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount, //C076
                weightedAverageCost:
                  cashFlow.supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost, //C077
              },
            },
          },
        },
      },

      otherSupplementaryItems: {
        details: {
          relatedToNonCash: {
            cryptocurrenciesEndOfPeriod: {
              weightedAverageCost:
                cashFlow.otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesEndOfPeriod_weightedAverageCost, //C051
            },
            cryptocurrenciesBeginningOfPeriod: {
              weightedAverageCost:
                cashFlow.otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost, //C050
            },
          },
          relatedToCash: {
            netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: {
              weightedAverageCost:
                cashFlow.otherSupplementaryItems_details_relatedToCash_netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash_weightedAverageCost, //C049
            },
            cryptocurrenciesBeginningOfPeriod: {
              weightedAverageCost:
                cashFlow.otherSupplementaryItems_details_relatedToCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost, //C051
            },
            cryptocurrenciesEndOfPeriod: {
              weightedAverageCost:
                cashFlow.otherSupplementaryItems_details_relatedToCash_cryptocurrenciesEndOfPeriod_weightedAverageCost, //C052
            },
          },
        },
      },

      operatingActivities: {
        weightedAverageCost: cashFlow.operatingActivities_weightedAverageCost, //C041
        details: {
          cashDepositedByCustomers: {
            weightedAverageCost:
              cashFlow.operatingActivities_details_cashDepositedByCustomers_weightedAverageCost, //C027
            breakdown: {
              USD: {
                amount:
                  cashFlow.operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount, //C134
                weightedAverageCost:
                  cashFlow.operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost, //C135
              },
            },
          },
          cashWithdrawnByCustomers: {
            weightedAverageCost:
              cashFlow.operatingActivities_details_cashWithdrawnByCustomers_weightedAverageCost, //C028
            breakdown: {
              USD: {
                amount:
                  cashFlow.operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount, //C136
                weightedAverageCost:
                  cashFlow.operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost, //C137
              },
            },
          },
          purchaseOfCryptocurrencies: {
            weightedAverageCost:
              cashFlow.operatingActivities_details_purchaseOfCryptocurrencies_weightedAverageCost, //C029
          },
          disposalOfCryptocurrencies: {
            weightedAverageCost:
              cashFlow.operatingActivities_details_disposalOfCryptocurrencies_weightedAverageCost, //C030
          },
          cashReceivedFromCustomersAsTransactionFee: {
            weightedAverageCost:
              cashFlow.operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_weightedAverageCost, //C031
            breakdown: {
              USD: {
                amount:
                  cashFlow.operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_amount, //C138
                weightedAverageCost:
                  cashFlow.operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_weightedAverageCost, //C139
              },
            },
          },
          cashPaidToSuppliersForExpenses: {
            weightedAverageCost:
              cashFlow.operatingActivities_details_cashPaidToSuppliersForExpenses_weightedAverageCost, //C034
            breakdown: {
              USD: {
                amount:
                  cashFlow.operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_amount, //C140
                weightedAverageCost:
                  cashFlow.operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_weightedAverageCost, //C141
              },
            },
          },
        },
      },

      investingActivities: {
        weightedAverageCost: cashFlow.investingActivities_weightedAverageCost, //C042
      },

      financingActivities: {
        weightedAverageCost: cashFlow.financingActivities_weightedAverageCost, //C048
        details: {
          proceedsFromIssuanceOfCommonStock: {
            weightedAverageCost:
              cashFlow.financingActivities_details_proceedsFromIssuanceOfCommonStock_weightedAverageCost, //C043
          },
          longTermDebt: {
            weightedAverageCost:
              cashFlow.financingActivities_details_longTermDebt_weightedAverageCost, //C044
          },
          shortTermBorrowings: {
            weightedAverageCost:
              cashFlow.financingActivities_details_shortTermBorrowings_weightedAverageCost, //C045
          },
          paymentsOfDividends: {
            weightedAverageCost:
              cashFlow.financingActivities_details_paymentsOfDividends_weightedAverageCost, //C046
          },
          treasuryStock: {
            weightedAverageCost:
              cashFlow.financingActivities_details_treasuryStock_weightedAverageCost, //C047
          },
        },
      },
    },
  };
  // validate bs
  const validateBalanceSheet = BalanceSheetsNeoSchema.safeParse(
    reportData.balanceSheet,
  );
  if (validateBalanceSheet.success === false) {
    // eslint-disable-next-line no-console
    console.log("validateBalanceSheet.error", validateBalanceSheet.error);
  } else {
    // eslint-disable-next-line no-console
    console.log("Validation success for balanceSheet");
  }
  // validate ci
  const validateComprehensiveIncome = ComprehensiveIncomeNeoSchema.safeParse(
    reportData.comprehensiveIncome,
  );
  if (validateComprehensiveIncome.success === false) {
    // eslint-disable-next-line no-console
    console.log(
      "validateComprehensiveIncome.error",
      validateComprehensiveIncome.error,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log("Validation success for comprehensiveIncome");
  }
  // validate cf
  const validateCashFlow = CashFlowNeoSchema.safeParse(reportData.cashFlow);
  if (validateCashFlow.success === false) {
    // eslint-disable-next-line no-console
    console.log("validateCashFlow.error", validateCashFlow.error);
  } else {
    // eslint-disable-next-line no-console
    console.log("Validation success for cashFlow");
  }
  console.log("complete crawling report, report id", reportId);
  return JSON.stringify(reportData);
}

async function schedulePutReport() {
  while (true) {
    // if having report address but no content
    const lackReportEvidences = await prisma.evidences.findMany({
      where: {
        OR: [
          {
            content: null,
          },
          {
            content: "",
          },
        ],
        report_address: {
          not: null,
        },
      },
    });
    if (lackReportEvidences.length > 0) {
      await putReport(lackReportEvidences);
    } else {
      console.log("No report to put");
    }
    // set time interval 3 mins
    await new Promise((resolve) => setTimeout(resolve, 180000));
    console.log("schedule put report end");
  }
}

export { schedulePutReport };
