import Web3 from "web3";
import { PrismaClient } from "@prisma/client";

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
  ],

const prisma = new PrismaClient();

const web3 = new Web3("https://isuncoin.baifa.io");

// 從命令行參數獲取路由合約地址?
const reportAddress = "0xB2599dB0e9b295b82AE9A1693e38ee5Ea89D5c3b";

// 創建智能合約實例
const contractInstance = new web3.eth.Contract(abi, reportAddress);

// console.log("reportAddress", reportAddress);

async function getContractValue(reportName, reportType, reportColumn) {
  try {
    // 假設getValue是合約中的一個方法
    const value = await contractInstance.methods
      .getValue(reportName, reportType, reportColumn)
      .call();
    // console.log("value", value);

    // 格式化數值
    let formattedValue = web3.utils.fromWei(value, "ether");
    if (formattedValue === "0.") {
      formattedValue = "0.0";
    }
    return formattedValue;
    // console.log("formattedValue", formattedValue);
  } catch (error) {
    console.error(error);
  }
}

async function crawlReport(reportAddress, reportId, reportName) {

}
// 使用示例
(async () => {
  // await getContractValue('first_report', 'balanceSheet', 'assets.details.cryptocurrency.totalAmountFairValue');
  const reportID = "1";
  const reportName = "first_report";
  /*startTime*/ const startTime = await getContractValue(
    reportName,
    "time",
    "startTime",
  );
  /*endTime*/ const endTime = await getContractValue(
    reportName,
    "time",
    "endTime",
  );
  /*A001*/ const assets_details_cryptocurrency_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.totalAmountFairValue",
    );
  /*A002*/ const assets_details_cryptocurrency_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.USDT.amount",
    );
  /*A003*/ const assets_details_cryptocurrency_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.USDT.fairValue",
    );
  /*A004*/ const assets_totalAmountFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "assets.totalAmountFairValue",
  );
  /*A005*/ const totalAssetsFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "totalAssetsFairValue",
  );
  /*A006*/ const liabilities_details_userDeposit_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.totalAmountFairValue",
    );
  /*A007*/ const liabilities_details_userDeposit_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USDT.amount",
    );
  /*A008*/ const liabilities_details_userDeposit_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USDT.fairValue",
    );
  /*A009*/ const liabilities_totalAmountFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "liabilities.totalAmountFairValue",
  );
  /*A010*/ const equity_details_retainedEarnings_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.totalAmountFairValue",
    );
  /*A011*/ const equity_details_retainedEarnings_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USDT.amount",
    );
  /*A012*/ const equity_details_retainedEarnings_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USDT.fairValue",
    );
  /*A013*/ const equity_totalAmountFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "equity.totalAmountFairValue",
  );
  /*A014*/ const totalLiabilitiesAndEquityFairValue = await getContractValue(
    reportName,
    "balanceSheet",
    "totalLiabilitiesAndEquityFairValue",
  );
  /*A015*/ const assets_details_cryptocurrency_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.ETH.amount",
    );
  /*A016*/ const assets_details_cryptocurrency_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.ETH.fairValue",
    );
  /*A017*/ const equity_details_retainedEarnings_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.ETH.amount",
    );
  /*A018*/ const equity_details_retainedEarnings_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.ETH.fairValue",
    );
  /*A019*/ const assets_details_cashAndCashEquivalent_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cashAndCashEquivalent.totalAmountFairValue",
    );
  /*A020*/ const assets_details_accountsReceivable_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.totalAmountFairValue",
    );

  /*A022*/

  /*A025*/ const assets_details_accountsReceivable_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.USDT.amount",
    );
  /*A026*/ const assets_details_accountsReceivable_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.USDT.fairValue",
    );
  /*A027*/ const assets_details_accountsReceivable_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.BTC.amount",
    );
  /*A028*/ const assets_details_accountsReceivable_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.BTC.fairValue",
    );
  /*A029*/ const assets_details_accountsReceivable_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.ETH.amount",
    );
  /*A030*/ const assets_details_accountsReceivable_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.accountsReceivable.breakdown.ETH.fairValue",
    );
  /*A031*/ const liabilities_details_accountsPayable_totalAmountFairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.totalAmountFairValue",
    );
  /*A032*/ const liabilities_details_accountsPayable_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      " liabilities.details.accountsPayable.breakdown.USD.amount",
    );
  /*A033*/ const liabilities_details_accountsPayable_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.USD.fairValue",
    );
  /*A034*/ const liabilities_details_accountsPayable_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.USDT.amount",
    );
  /*A035*/ const liabilities_details_accountsPayable_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.USDT.fairValue",
    );
  /*A036*/ const liabilities_details_accountsPayable_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.BTC.amount",
    );
  /*A037*/ const liabilities_details_accountsPayable_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.BTC.fairValue",
    );
  /*A038*/ const liabilities_details_accountsPayable_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.ETH.amount",
    );
  /*A039*/ const liabilities_details_accountsPayable_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.accountsPayable.breakdown.ETH.fairValue",
    );
  /*A040*/ const liabilities_details_userDeposit_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USD.amount",
    );
  /*A041*/ const liabilities_details_userDeposit_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.USD.fairValue",
    );
  /*A042*/ const liabilities_details_userDeposit_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.ETH.amount",
    );
  /*A043*/ const liabilities_details_userDeposit_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.ETH.fairValue",
    );
  /*A044*/ const liabilities_details_userDeposit_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.BTC.amount",
    );
  /*A045*/ const liabilities_details_userDeposit_breakdown_BTC_airValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "liabilities.details.userDeposit.breakdown.BTC.fairValue",
    );
  /*A046*/ const assets_details_cryptocurrency_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.BTC.amount",
    );
  /*A047*/ const assets_details_cryptocurrency_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cryptocurrency.breakdown.BTC.fairValue",
    );
  /*A048*/ const equity_details_retainedEarnings_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.BTC.amount",
    );
  /*A049*/ const equity_details_retainedEarnings_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.BTC.fairValue",
    );
  /*A050*/ const equity_details_retainedEarnings_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USD.amount",
    );
  /*A051*/ const equity_details_retainedEarnings_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.retainedEarnings.breakdown.USD.fairValue",
    );
  /*A052*/ const equity_details_otherCapitalReserve_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.fairValue",
    );
  /*A053*/ const equity_details_otherCapitalReserve_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USD.amount",
    );
  /*A054*/ const equity_details_otherCapitalReserve_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USD.fairValue",
    );
  /*A055*/ const equity_details_otherCapitalReserve_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USDT.amount",
    );
  /*A056*/ const equity_details_otherCapitalReserve_breakdown_USDT_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.USDT.fairValue",
    );
  /*A057*/ const equity_details_otherCapitalReserve_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.ETH.amount",
    );
  /*A058*/ const equity_details_otherCapitalReserve_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.ETH.fairValue",
    );
  /*A059*/ const equity_details_otherCapitalReserve_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.BTC.amount",
    );
  /*A060*/ const equity_details_otherCapitalReserve_breakdown_BTC_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "equity.details.otherCapitalReserve.breakdown.BTC.fairValue",
    );
  /*A061*/ const assets_details_cashAndCashEquivalent_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cashAndCashEquivalent.breakdown.USD.amount",
    );
  /*A062*/ const assets_details_cashAndCashEquivalent_breakdown_USD_fairValue =
    await getContractValue(
      reportName,
      "balanceSheet",
      "assets.details.cashAndCashEquivalent.breakdown.USD.fairValue",
    );
  /*B001*/ const income_details_depositFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.weightedAverageCost",
    );
  /*B002*/ const income_details_depositFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USDT.amount",
    );
  /*B003*/ const income_details_depositFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USDT.weightedAverageCost",
    );
  /*B004*/ const netProfit = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "netProfit",
  );
  /*B005*/ const income_details_withdrawalFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.weightedAverageCost",
    );
  /*B006*/ const income_details_withdrawalFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USDT.amount",
    );
  /*B007*/ const income_details_withdrawalFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USDT.weightedAverageCost",
    );
  /*B008*/ const costs_details_technicalProviderFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.weightedAverageCost",
    );
  /*B009*/ const costs_details_technicalProviderFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.ETH.amount",
    );
  /*B010*/ const costs_details_technicalProviderFee_breakdown_ETH_fairValue =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.ETH.fairValue",
    );
  /*B011*/ const income_details_transactionFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.weightedAverageCost",
    );
  /*B012*/ const income_details_spreadFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.weightedAverageCost",
    );
  /*B013*/ const income_details_liquidationFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.weightedAverageCost",
    );
  /*B014*/ const income_details_guaranteedStopFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.weightedAverageCost",
    );
  /*B015*/ const costs_details_marketDataProviderFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.marketDataProviderFee.weightedAverageCost",
    );
  /*B016*/ const costs_details_newCoinListingCost_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.newCoinListingCost.weightedAverageCost",
    );
  /*B017*/ const operatingExpenses_details_salaries = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.details.salaries",
  );
  /*B018*/ const operatingExpenses_details_rent = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.details.rent",
  );
  /*B019*/ const operatingExpenses_details_marketing = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.details.marketing",
  );
  /*B020*/ const operatingExpenses_details_rebateExpenses_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.weightedAverageCost",
    );

  /*B021*/ const financialCosts_details_interestExpense =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.interestExpense",
    );
  /*B022*/ const financialCosts_details_cryptocurrencyForexLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses",
    );
  /*B023*/ const financialCosts_details_fiatToCryptocurrencyConversionLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.fiatToCryptocurrencyConversionLosses",
    );
  /*B024*/ const financialCosts_details_cryptocurrencyToFiatConversionLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyToFiatConversionLosses",
    );
  /*B025*/ const financialCosts_details_fiatToFiatConversionLosses =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.fiatToFiatConversionLosses",
    );
  /*B026*/ const otherGainsLosses_details_investmentGains =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.investmentGains",
    );
  /*B027*/ const otherGainsLosses_details_forexGains = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "otherGainsLosses.details.forexGains",
  );
  /*B028*/ const otherGainsLosses_details_cryptocurrencyGains_weightedAverageCosts =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.weightedAverageCosts",
    );

  /*B029*/ const income_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "income.weightedAverageCost",
  );
  /*B030*/ const costs_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "costs.weightedAverageCost",
  );
  /*B031*/ const operatingExpenses_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "operatingExpenses.weightedAverageCost",
  );
  /*B032*/ const financialCosts_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "financialCosts.weightedAverageCost",
  );
  /*B033*/ const otherGainsLosses_weightedAverageCost = await getContractValue(
    reportName,
    "comprehensiveIncome",
    "otherGainsLosses.weightedAverageCost",
  );
  /*B034*/ const income_details_depositFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.ETH.amount",
    );
  /*B035*/ const income_details_depositFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.ETH.weightedAverageCost",
    );
  /*B036*/ const income_details_depositFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.BTC.amount",
    );
  /*B037*/ const income_details_depositFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.BTC.weightedAverageCost",
    );
  /*B038*/ const income_details_depositFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USD.amount",
    );
  /*B039*/ const income_details_depositFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.depositFee.breakdown.USD.weightedAverageCost",
    );
  /*B040*/ const income_details_withdrawalFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.ETH.amount",
    );
  /*B041*/ const income_details_withdrawalFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.ETH.weightedAverageCost",
    );
  /*B042*/ const income_details_withdrawalFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.BTC.amount",
    );
  /*B043*/ const income_details_withdrawalFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.BTC.weightedAverageCost",
    );
  /*B044*/ const income_details_withdrawalFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USD.amount",
    );
  /*B045*/ const income_details_withdrawalFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.withdrawalFee.breakdown.USD.weightedAverageCost",
    );
  /*B046*/ const income_details_transactionFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.ETH.amount",
    );
  /*B047*/ const income_details_transactionFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.ETH.weightedAverageCost",
    );
  /*B048*/ const income_details_transactionFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.BTC.amount",
    );
  /*B049*/ const income_details_transactionFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.BTC.weightedAverageCost",
    );
  /*B050*/ const income_details_transactionFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USDT.amount",
    );
  /*B051*/ const income_details_transactionFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USDT.weightedAverageCost",
    );
  /*B052*/ const income_details_transactionFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USD.amount",
    );
  /*B053*/ const income_details_transactionFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.transactionFee.breakdown.USD.weightedAverageCost",
    );
  /*B054*/ const income_details_spreadFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      " income.details.spreadFee.breakdown.ETH.amount",
    );
  /*B055*/ const income_details_spreadFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.ETH.weightedAverageCost",
    );
  /*B056*/ const income_details_spreadFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.BTC.amount",
    );
  /*B057*/ const income_details_spreadFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.BTC.weightedAverageCost",
    );
  /*B058*/ const income_details_spreadFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USDT.amount",
    );
  /*B059*/ const income_details_spreadFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USDT.weightedAverageCost",
    );
  /*B060*/ const income_details_spreadFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USD.amount",
    );
  /*B061*/ const income_details_spreadFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.spreadFee.breakdown.USD.weightedAverageCost",
    );
  /*B062*/ const income_details_liquidationFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.ETH.amount",
    );
  /*B063*/ const income_details_liquidationFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.ETH.weightedAverageCost",
    );
  /*B064*/ const income_details_liquidationFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.BTC.amount",
    );
  /*B065*/ const income_details_liquidationFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.BTC.weightedAverageCost",
    );
  /*B066*/ const income_details_liquidationFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.USDT.amount",
    );
  /*B067*/ const income_details_liquidationFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      " income.details.liquidationFee.breakdown.USDT.weightedAverageCost",
    );
  /*B068*/ const income_details_liquidationFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.USD.amount",
    );
  /*B069*/ const income_details_liquidationFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.liquidationFee.breakdown.USD.weightedAverageCost",
    );
  /*B070*/ const income_details_guaranteedStopFee_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.ETH.amount",
    );
  /*B071*/ const income_details_guaranteedStopFee_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.ETH.weightedAverageCost",
    );
  /*B072*/ const income_details_guaranteedStopFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.BTC.amount",
    );
  /*B073*/ const income_details_guaranteedStopFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.BTC.weightedAverageCost",
    );
  /*B074*/ const income_details_guaranteedStopFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      " income.details.guaranteedStopFee.breakdown.USDT.amount",
    );
  /*B075*/ const income_details_guaranteedStopFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.USDT.weightedAverageCost",
    );
  /*B076*/ const income_details_guaranteedStopFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.USD.amount",
    );
  /*B077*/ const income_details_guaranteedStopFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "income.details.guaranteedStopFee.breakdown.USD.weightedAverageCost",
    );
  /*B078*/ const operatingExpenses_details_rebateExpenses_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.ETH.amount",
    );
  /*B079*/ const operatingExpenses_details_rebateExpenses_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.ETH.weightedAverageCost",
    );
  /*B080*/ const operatingExpenses_details_rebateExpenses_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.BTC.amount",
    );
  /*B081*/ const operatingExpenses_details_rebateExpenses_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.BTC.weightedAverageCost",
    );
  /*B082*/ const operatingExpenses_details_rebateExpenses_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USDT.amount",
    );
  /*B083*/ const operatingExpenses_details_rebateExpenses_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USDT.weightedAverageCost",
    );
  /*B084*/ const operatingExpenses_details_rebateExpenses_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USD.amount",
    );
  /*B085*/ const operatingExpenses_details_rebateExpenses_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "operatingExpenses.details.rebateExpenses.breakdown.USD.weightedAverageCost",
    );
  /*B086*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.ETH.amount",
    );
  /*B087*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.ETH.weightedAverageCost",
    );
  /*B088*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.BTC.amount",
    );
  /*B089*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.BTC.weightedAverageCost,",
    );
  /*B090*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USDT.amount",
    );
  /*B091*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USDT.weightedAverageCost",
    );
  /*B092*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USD.amount",
    );
  /*B093*/ const financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "financialCosts.details.cryptocurrencyForexLosses.breakdown.USD.weightedAverageCost",
    );
  /*B094*/ const costs_details_technicalProviderFee_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.BTC.amount",
    );
  /*B095*/ const costs_details_technicalProviderFee_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.BTC.weightedAverageCost",
    );
  /*B096*/ const costs_details_technicalProviderFee_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USDT.amount",
    );
  /*B097*/ const costs_details_technicalProviderFee_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USDT.weightedAverageCost",
    );
  /*B098*/ const costs_details_technicalProviderFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USD.amount",
    );
  /*B099*/ const costs_details_technicalProviderFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "costs.details.technicalProviderFee.breakdown.USD.weightedAverageCost",
    );
  /*B100*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USDT.amount",
    );
  /*B101*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USDT.weightedAverageCost",
    );
  /*B102*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.ETH.amount",
    );
  /*B103*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.ETH.weightedAverageCost",
    );
  /*B104*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.BTC.amount",
    );
  /*B105*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.BTC.weightedAverageCost",
    );
  /*B106*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USD.amount",
    );
  /*B107*/ const otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "comprehensiveIncome",
      "otherGainsLosses.details.cryptocurrencyGains.breakdown.USD.weightedAverageCost",
    );

  /*C001*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.weightedAverageCost",
    );
  /*C002*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.USDT.amount",
    );
  /*C003*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.USDT.weightedAverageCost",
    );
  /*C004*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.weightedAverageCost",
    );
  /*C005*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.USDT.amount",
    );
  /*C006*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.USDT.weightedAverageCost",
    );
  /*C007*/ const supplementalScheduleOfNonCashOperatingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.weightedAverageCost",
    );
  /*C008*/ const otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesEndOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesEndOfPeriod.weightedAverageCost",
    );
  /*C009*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      " supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.weightedAverageCost",
    );
  /*C010*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.USDT.amount",
    );
  /*C011*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.USDT.weightedAverageCost",
    );
  /*C012*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.weightedAverageCost",
    );
  /*C013*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.ETH.amount",
    );
  /*C014*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.ETH.weightedAverageCost",
    );
  /*C015*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.weightedAverageCost",
    );
  /*C016*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.weightedAverageCost",
    );
  /*C023*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.weightedAverageCost",
    );
  /*C024*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.weightedAverageCost",
    );
  /*C025*/ const otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToNonCash.cryptocurrenciesBeginningOfPeriod.weightedAverageCost",
    );
  /*C027*/ const operatingActivities_details_cashDepositedByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashDepositedByCustomers.weightedAverageCost",
    );
  /*C028*/ const operatingActivities_details_cashWithdrawnByCustomers_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashWithdrawnByCustomers.weightedAverageCost",
    );
  /*C029*/ const operatingActivities_details_purchaseOfCryptocurrencies_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.purchaseOfCryptocurrencies.weightedAverageCost",
    );
  /*C030*/ const operatingActivities_details_disposalOfCryptocurrencies_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.disposalOfCryptocurrencies.weightedAverageCost",
    );
  /*C031*/ const operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashReceivedFromCustomersAsTransactionFee.weightedAverageCost",
    );
  /*C034*/ const operatingActivities_details_cashPaidToSuppliersForExpenses_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashPaidToSuppliersForExpenses.weightedAverageCost",
    );
  /*C037*/ const operatingActivities_details_insuranceFundForPerpetualContracts_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.insuranceFundForPerpetualContracts.weightedAverageCost",
    );
  /*C041*/ const operatingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.weightedAverageCost",
    );
  /*C042*/ const investingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "investingActivities.weightedAverageCost",
    );
  /*C043*/ const financingActivities_details_proceedsFromIssuanceOfCommonStock_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.proceedsFromIssuanceOfCommonStock.weightedAverageCost",
    );
  /*C044*/ const financingActivities_details_longTermDebt_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.longTermDebt.weightedAverageCost",
    );
  /*C045*/ const financingActivities_details_shortTermBorrowings_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.shortTermBorrowings.weightedAverageCost",
    );
  /*C046*/ const financingActivities_details_paymentsOfDividends_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.paymentsOfDividends.weightedAverageCost",
    );
  /*C047*/ const financingActivities_details_treasuryStock_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.details.treasuryStock.weightedAverageCost",
    );
  /*C048*/ const financingActivities_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "financingActivities.weightedAverageCost",
    );
  /*C049*/ const otherSupplementaryItems_details_relatedToCash_netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToCash.netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash.weightedAverageCost",
    );
  /*C050*/ const otherSupplementaryItems_details_relatedToCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToCash.cryptocurrenciesBeginningOfPeriod.weightedAverageCost",
    );

  /*C051*/ const otherSupplementaryItems_details_relatedToCash_cryptocurrenciesEndOfPeriod_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "otherSupplementaryItems.details.relatedToCash.cryptocurrenciesEndOfPeriod.weightedAverageCost",
    );

  /*C052*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.ETH.amount",
    );
  /*C053*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.ETH.weightedAverageCost",
    );
  /*C054*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.BTC.amount",
    );
  /*C055*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesDepositedByCustomers.breakdown.BTC.weightedAverageCost",
    );
  /*C056*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.ETH.amount",
    );
  /*C057*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.ETH.weightedAverageCost",
    );
  /*C058*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesWithdrawnByCustomers.breakdown.BTC.amount",
    );
  /*C059*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.ETH.amount",
    );
  /*C060*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.weightedAverageCost",
    );
  /*C061*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.ETH.weightedAverageCost",
    );
  /*C062*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.BTC.amount",
    );
  /*C063*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.BTC.weightedAverageCost",
    );
  /*C064*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.USDT.amount",
    );
  /*C065*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyInflows.breakdown.USDT.weightedAverageCost",
    );
  /*C066*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.ETH.amount",
    );
  /*C067*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.ETH.weightedAverageCost",
    );
  /*C068*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.BTC.amount",
    );
  /*C069*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.BTC.weightedAverageCost",
    );
  /*C070*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.USDT.amount",
    );
  /*C071*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrencyOutflows.breakdown.USDT.weightedAverageCost",
    );
  /*C072*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.ETH.amount",
    );
  /*C073*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.ETH.weightedAverageCost",
    );
  /*C074*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.BTC.amount",
    );
  /*C075*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesReceivedFromCustomersAsTransactionFees.breakdown.BTC.weightedAverageCost",
    );
  /*C088*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.ETH.amount",
    );
  /*C089*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.ETH.weightedAverageCost",
    );
  /*C090*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.BTC.amount",
    );
  /*C091*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.BTC.weightedAverageCost",
    );
  /*C092*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.USDT.amount",
    );
  /*C093*/ const supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.purchaseOfCryptocurrenciesWithNonCashConsideration.breakdown.USDT.weightedAverageCost",
    );
  /*C094*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.ETH.amount",
    );
  /*C095*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.ETH.weightedAverageCost",
    );
  /*C096*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.BTC.amount",
    );
  /*C097*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.BTC.weightedAverageCost",
    );
  /*C098*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.USDT.amount",
    );
  /*C099*/ const supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.disposalOfCryptocurrenciesForNonCashConsideration.breakdown.USDT.weightedAverageCost",
    );
  /*C106*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.USDT.amount",
    );
  /*C107*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.USDT.weightedAverageCost",
    );
  /*C108*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.BTC.amount",
    );
  /*C109*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      " supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToSuppliersForExpenses.breakdown.BTC.weightedAverageCost",
    );
  /*C134*/ const operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashDepositedByCustomers.breakdown.USD.amount",
    );
  /*C135*/ const operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashDepositedByCustomers.breakdown.USD.weightedAverageCost",
    );
  /*C136*/ const operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashReceivedFromCustomersAsTransactionFee.breakdown.USD.amount",
    );
  /*C137*/ const operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashReceivedFromCustomersAsTransactionFee.breakdown.USD.weightedAverageCost",
    );
  /*C138*/ const operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashPaidToSuppliersForExpenses.breakdown.USD.amount",
    );
  /*C139*/ const operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashPaidToSuppliersForExpenses.breakdown.USD.weightedAverageCost",
    );
  /*C140*/ const operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashWithdrawnByCustomers.breakdown.USD.amount",
    );
  /*C141*/ const operatingActivities_details_cashWithdrawnByCustomers_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.cashWithdrawnByCustomers.breakdown.USD.weightedAverageCost",
    );
  /*C142*/ const operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.purchaseOfCryptocurrencies.breakdown.USD.amount",
    );
  /*C143*/ const operatingActivities_details_purchaseOfCryptocurrencies_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.purchaseOfCryptocurrencies.breakdown.USD.weightedAverageCost",
    );
  /*C144*/ const operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_amount =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.disposalOfCryptocurrencies.breakdown.USD.amount",
    );
  /*C145*/ const operatingActivities_details_disposalOfCryptocurrencies_breakdown_USD_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "operatingActivities.details.disposalOfCryptocurrencies.breakdown.USD.weightedAverageCost",
    );
  /*C146*/ const supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToCustomersForPerpetualContractProfits_weightedAverageCost =
    await getContractValue(
      reportName,
      "cashFlow",
      "supplementalScheduleOfNonCashOperatingActivities.details.cryptocurrenciesPaidToCustomersForPerpetualContractProfits.weightedAverageCost",
    );
  //original
  const balanceSheet = {
    reportID: reportID,
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
    reportID: reportID,
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
    reportID: reportID,
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
  // const content = {
  //   bs, is, cf
  // }
  const data = {
    balanceSheet: {
      reportID: balanceSheet.reportID,
      reportName: balanceSheet.reportName,
      reportStartTime: balanceSheet.startTime * 10 ** 18,
      reportEndTime: balanceSheet.endTime * 10 ** 18,
      reportType: "balance sheet",
      totalAssetsFairValue: balanceSheet.totalAssetsFairValue, //A005
      totalLiabilitiesAndEquityFairValue:
        balanceSheet.totalLiabilitiesAndEquityFairValue, //A014
      assets: {
        totalAmountFairValue: balanceSheet.assets_totalAmountFairValue, //A004
        details: {
          cryptocurrency: {
            totalAmountFairValue:
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
            totalAmountFairValue:
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
            totalAmountFairValue:
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
        totalAmountFairValue: balanceSheet.liabilities_totalAmountFairValue, //A009
        details: {
          userDeposit: {
            totalAmountFairValue:
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
            totalAmountFairValue:
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
        totalAmountFairValue: balanceSheet.equity_totalAmountFairValue, //A013
        details: {
          retainedEarning: {
            totalAmountFairValue:
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
      reportStartTime: comprehensiveIncome.startTime * 10 ** 18,
      reportEndTime: comprehensiveIncome.endTime * 10 ** 18,
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
      reportStartTime: cashFlow.startTime * 10 ** 18,
      reportEndTime: cashFlow.endTime * 10 ** 18,
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
  // const data2 = {
  //   balanceSheet: {
  //     reportID: reportID,
  //     reportName: reportName,
  //     reportStartTime: startTime * 10 ** 18,
  //     reportEndTime: endTime * 10 ** 18,
  //     reportType: 'balance sheet',
  //     totalAssetsFairValue: totalAssetsFairValue, //A005
  //     totalLiabilitiesAndEquityFairValue:
  //       totalLiabilitiesAndEquityFairValue, //A014
  //     assets: {
  //       totalAmountFairValue: assets_totalAmountFairValue, //A004
  //       details: {
  //         cryptocurrency: {
  //           totalAmountFairValue:
  //             assetsDetailsCryptocurrencyTotalAmountFairValue, //A001
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 assets_details_cryptocurrency_breakdown_USDT_amount, //A002
  //               fairValue:
  //                 assets_details_cryptocurrency_breakdown_USDT_fairValue, //A003
  //             },
  //             ETH: {
  //               amount:
  //                 assets_details_cryptocurrency_breakdown_ETH_amount, //A015
  //               fairValue:
  //                 assets_details_cryptocurrency_breakdown_ETH_fairValue, //A016
  //             },
  //             BTC: {
  //               amount:
  //                 assets_details_cryptocurrency_breakdown_BTC_amount, //A046
  //               fairValue:
  //                 assets_details_cryptocurrency_breakdown_BTC_fairValue, //A047
  //             },
  //           },
  //         },
  //         cashAndCashEquivalent: {
  //           totalAmountFairValue:
  //             assets_details_cashAndCashEquivalent_totalAmountFairValue, //A019
  //           breakdown: {
  //             USD: {
  //               amount:
  //                 assets_details_cashAndCashEquivalent_breakdown_USD_amount, //A061
  //               fairValue:
  //                 assets_details_cashAndCashEquivalent_breakdown_USD_fairValue, //A062
  //             },
  //           },
  //         },
  //         accountsReceivable: {
  //           totalAmountFairValue:
  //             assets_details_accountsReceivable_totalAmountFairValue, //A020
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 assets_details_accountsReceivable_breakdown_USDT_amount, //A025
  //               fairValue:
  //                 assets_details_accountsReceivable_breakdown_USDT_fairValue, //A026
  //             },
  //             BTC: {
  //               amount:
  //                 assets_details_accountsReceivable_breakdown_BTC_amount, //A027
  //               fairValue:
  //                 assets_details_accountsReceivable_breakdown_BTC_fairValue, //A028
  //             },
  //             ETH: {
  //               amount:
  //                 assets_details_accountsReceivable_breakdown_ETH_amount, //A029
  //               fairValue:
  //                 assets_details_accountsReceivable_breakdown_ETH_fairValue, //A030
  //             },
  //           },
  //         },
  //       },
  //     },
  //     liabilities: {
  //       totalAmountFairValue: liabilities_totalAmountFairValue, //A009
  //       details: {
  //         userDeposit: {
  //           totalAmountFairValue:
  //             liabilities_details_userDeposit_totalAmountFairValue, //A006
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 liabilities_details_userDeposit_breakdown_USDT_amount, //A007
  //               fairValue:
  //                 liabilities_details_userDeposit_breakdown_USDT_fairValue, //A008
  //             },
  //             USD: {
  //               amount:
  //                 liabilities_details_userDeposit_breakdown_USD_amount, //A040
  //               fairValue:
  //                 liabilities_details_userDeposit_breakdown_USD_fairValue, //A041
  //             },
  //             ETH: {
  //               amount:
  //                 liabilities_details_userDeposit_breakdown_ETH_amount, //A042
  //               fairValue:
  //                 liabilities_details_userDeposit_breakdown_ETH_fairValue, //A043
  //             },
  //             BTC: {
  //               amount:
  //                 liabilities_details_userDeposit_breakdown_BTC_amount, //A044
  //               fairValue:
  //                 liabilities_details_userDeposit_breakdown_BTC_airValue, //A045
  //             },
  //           },
  //         },
  //         accountsPayable: {
  //           totalAmountFairValue:
  //             liabilities_details_accountsPayable_totalAmountFairValue, //A021
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 liabilities_details_accountsPayable_breakdown_USDT_amount, //A034
  //               fairValue:
  //                 liabilities_details_accountsPayable_breakdown_USDT_fairValue, //A035
  //             },
  //             USD: {
  //               amount:
  //                 liabilities_details_accountsPayable_breakdown_USD_amount, //A032
  //               fairValue:
  //                 liabilities_details_accountsPayable_breakdown_USD_fairValue, //A033
  //             },
  //             BTC: {
  //               amount:
  //                 liabilities_details_accountsPayable_breakdown_BTC_amount, //A036
  //               fairValue:
  //                 liabilities_details_accountsPayable_breakdown_BTC_fairValue, //A037
  //             },
  //             ETH: {
  //               amount:
  //                 liabilities_details_accountsPayable_breakdown_ETH_amount, //A038
  //               fairValue:
  //                 liabilities_details_accountsPayable_breakdown_ETH_fairValue, //A039
  //             },
  //           },
  //         },
  //       },
  //     },
  //     equity: {
  //       totalAmountFairValue: equity_totalAmountFairValue, //A013
  //       details: {
  //         retainedEarning: {
  //           totalAmountFairValue:
  //             equity_details_retainedEarnings_totalAmountFairValue, //A010
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 equity_details_retainedEarnings_breakdown_USDT_amount, //A011
  //               fairValue:
  //                 equity_details_retainedEarnings_breakdown_USDT_fairValue, //A012
  //             },
  //             ETH: {
  //               amount:
  //                 equity_details_retainedEarnings_breakdown_ETH_amount, //A017
  //               fairValue:
  //                 equity_details_retainedEarnings_breakdown_ETH_fairValue, //A018
  //             },
  //             BTC: {
  //               amount:
  //                 equity_details_retainedEarnings_breakdown_BTC_amount, //A048
  //               fairValue:
  //                 equity_details_retainedEarnings_breakdown_BTC_fairValue, //A049
  //             },
  //             USD: {
  //               amount:
  //                 equity_details_retainedEarnings_breakdown_USD_amount, //A050
  //               fairValue:
  //                 equity_details_retainedEarnings_breakdown_USD_fairValue, //A051
  //             },
  //           },
  //         },
  //         otherCapitalReserve: {
  //           fairValue:
  //             equity_details_otherCapitalReserve_fairValue, //A052
  //           breakdown: {
  //             USD: {
  //               amount:
  //                 equity_details_otherCapitalReserve_breakdown_USD_amount, //A053
  //               fairValue:
  //                 equity_details_otherCapitalReserve_breakdown_USD_fairValue, //A054
  //             },
  //             USDT: {
  //               amount:
  //                 equity_details_otherCapitalReserve_breakdown_USDT_amount, //A055
  //               fairValue:
  //                 equity_details_otherCapitalReserve_breakdown_USDT_fairValue, //A056
  //             },
  //             ETH: {
  //               amount:
  //                 equity_details_otherCapitalReserve_breakdown_ETH_amount, //A057
  //               fairValue:
  //                 equity_details_otherCapitalReserve_breakdown_ETH_fairValue, //A058
  //             },
  //             BTC: {
  //               amount:
  //                 equity_details_otherCapitalReserve_breakdown_BTC_amount, //A059
  //               fairValue:
  //                 equity_details_otherCapitalReserve_breakdown_BTC_fairValue, //A060
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   comprehensiveIncome: {
  //     reportType: 'comprehensive income',
  //     reportID: reportID,
  //     reportName: reportName,
  //     reportStartTime: startTime * 10 ** 18,
  //     reportEndTime: endTime * 10 ** 18,
  //     netProfit: netProfit, //B004
  //     income: {
  //       weightedAverageCost: income_weightedAverageCost, //B029
  //       details: {
  //         depositFee: {
  //           weightedAverageCost:
  //             income_details_depositFee_weightedAverageCost, //B001
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 income_details_depositFee_breakdown_USDT_amount, //B002
  //               weightedAverageCost:
  //                 income_details_depositFee_breakdown_USDT_weightedAverageCost, //B003
  //             },
  //             ETH: {
  //               amount:
  //                 income_details_depositFee_breakdown_ETH_amount, //B034
  //               weightedAverageCost:
  //                 income_details_depositFee_breakdown_ETH_weightedAverageCost, //B035
  //             },
  //             BTC: {
  //               amount:
  //                 income_details_depositFee_breakdown_BTC_amount, //B036
  //               weightedAverageCost:
  //                 income_details_depositFee_breakdown_BTC_weightedAverageCost, //B037
  //             },
  //             USD: {
  //               amount:
  //                 income_details_depositFee_breakdown_USD_amount, //B038
  //               weightedAverageCost:
  //                 income_details_depositFee_breakdown_USD_weightedAverageCost, //B039
  //             },
  //           },
  //         },
  //         withdrawalFee: {
  //           weightedAverageCost:
  //             income_details_withdrawalFee_weightedAverageCost, //B005
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 income_details_withdrawalFee_breakdown_USDT_amount, //B006
  //               weightedAverageCost:
  //                 income_details_withdrawalFee_breakdown_USDT_weightedAverageCost, //B007
  //             },
  //             ETH: {
  //               amount:
  //                 income_details_withdrawalFee_breakdown_ETH_amount, //B040
  //               weightedAverageCost:
  //                 income_details_withdrawalFee_breakdown_ETH_weightedAverageCost, //B041
  //             },
  //             BTC: {
  //               amount:
  //                 income_details_withdrawalFee_breakdown_BTC_amount, //B042
  //               weightedAverageCost:
  //                 income_details_withdrawalFee_breakdown_BTC_weightedAverageCost, //B043
  //             },
  //             USD: {
  //               amount:
  //                 income_details_withdrawalFee_breakdown_USD_amount, //B044
  //               weightedAverageCost:
  //                 income_details_withdrawalFee_breakdown_USD_weightedAverageCost, //B045
  //             },
  //           },
  //         },
  //         tradingFee: {
  //           weightedAverageCost:
  //             income_details_transactionFee_weightedAverageCost, //B011
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 income_details_transactionFee_breakdown_ETH_amount, //B046
  //               weightedAverageCost:
  //                 income_details_transactionFee_breakdown_ETH_weightedAverageCost, //B047
  //             },
  //             BTC: {
  //               amount:
  //                 income_details_transactionFee_breakdown_BTC_amount, //B048
  //               weightedAverageCost:
  //                 income_details_transactionFee_breakdown_BTC_weightedAverageCost, //B049
  //             },
  //             USDT: {
  //               amount:
  //                 income_details_transactionFee_breakdown_USDT_amount, //B050
  //               weightedAverageCost:
  //                 income_details_transactionFee_breakdown_USDT_weightedAverageCost, //B051
  //             },
  //             USD: {
  //               amount:
  //                 income_details_transactionFee_breakdown_USD_amount, //B052
  //               weightedAverageCost:
  //                 income_details_transactionFee_breakdown_USD_weightedAverageCost, //B053
  //             },
  //           },
  //         },
  //       },
  //       spreadFee: {
  //         weightedAverageCost:
  //           income_details_spreadFee_weightedAverageCost, //B012
  //         breakdown: {
  //           ETH: {
  //             amount:
  //               income_details_spreadFee_breakdown_ETH_amount, //B054
  //             weightedAverageCost:
  //               income_details_spreadFee_breakdown_ETH_weightedAverageCost, //B055
  //           },
  //           BTC: {
  //             amount:
  //               income_details_spreadFee_breakdown_BTC_amount, //B056
  //             weightedAverageCost:
  //               income_details_spreadFee_breakdown_BTC_weightedAverageCost, //B057
  //           },
  //           USDT: {
  //             amount:
  //               income_details_spreadFee_breakdown_USDT_amount, //B058
  //             weightedAverageCost:
  //               income_details_spreadFee_breakdown_USDT_weightedAverageCost, //B059
  //           },
  //           USD: {
  //             amount:
  //               income_details_spreadFee_breakdown_USD_amount, //B060
  //             weightedAverageCost:
  //               income_details_spreadFee_breakdown_USD_weightedAverageCost, //B061
  //           },
  //         },
  //       },
  //       liquidationFee: {
  //         weightedAverageCost:
  //           income_details_liquidationFee_weightedAverageCost, //B013
  //         breakdown: {
  //           ETH: {
  //             amount:
  //               income_details_liquidationFee_breakdown_ETH_amount, //B062
  //             weightedAverageCost:
  //               income_details_liquidationFee_breakdown_ETH_weightedAverageCost, //B063
  //           },
  //           BTC: {
  //             amount:
  //               income_details_liquidationFee_breakdown_BTC_amount, //B064
  //             weightedAverageCost:
  //               income_details_liquidationFee_breakdown_BTC_weightedAverageCost, //B065
  //           },
  //           USDT: {
  //             amount:
  //               income_details_liquidationFee_breakdown_USDT_amount, //B066
  //             weightedAverageCost:
  //               income_details_liquidationFee_breakdown_USDT_weightedAverageCost, //B067
  //           },
  //           USD: {
  //             amount:
  //               income_details_liquidationFee_breakdown_USD_amount, //B068
  //             weightedAverageCost:
  //               income_details_liquidationFee_breakdown_USD_weightedAverageCost, //B069
  //           },
  //         },
  //       },
  //       guaranteedStopLossFee: {
  //         weightedAverageCost:
  //           income_details_guaranteedStopFee_weightedAverageCost, //B014
  //         breakdown: {
  //           ETH: {
  //             amount:
  //               income_details_guaranteedStopFee_breakdown_ETH_amount, //B070
  //             weightedAverageCost:
  //               income_details_guaranteedStopFee_breakdown_ETH_weightedAverageCost, //B071
  //           },
  //           BTC: {
  //             amount:
  //               income_details_guaranteedStopFee_breakdown_BTC_amount, //B072
  //             weightedAverageCost:
  //               income_details_guaranteedStopFee_breakdown_BTC_weightedAverageCost, //B073
  //           },
  //           USDT: {
  //             amount:
  //               income_details_guaranteedStopFee_breakdown_USDT_amount, //B074
  //             weightedAverageCost:
  //               income_details_guaranteedStopFee_breakdown_USDT_weightedAverageCost, //B075
  //           },
  //           USD: {
  //             amount:
  //               income_details_guaranteedStopFee_breakdown_USD_amount, //B076
  //             weightedAverageCost:
  //               income_details_guaranteedStopFee_breakdown_USD_weightedAverageCost, //B077
  //           },
  //         },
  //       },
  //     },

  //     costs: {
  //       weightedAverageCost: costs_weightedAverageCost, //B030
  //       details: {
  //         technicalProviderFee: {
  //           weightedAverageCost:
  //             costs_details_technicalProviderFee_weightedAverageCost, //B008
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 costs_details_technicalProviderFee_breakdown_ETH_amount, //B009
  //               weightedAverageCost:
  //                 costs_details_technicalProviderFee_breakdown_ETH_fairValue, //B010
  //             },
  //             BTC: {
  //               amount:
  //                 costs_details_technicalProviderFee_breakdown_BTC_amount, //B094
  //               weightedAverageCost:
  //                 costs_details_technicalProviderFee_breakdown_BTC_weightedAverageCost, //B095
  //             },
  //             USDT: {
  //               amount:
  //                 costs_details_technicalProviderFee_breakdown_USDT_amount, //B096
  //               weightedAverageCost:
  //                 costs_details_technicalProviderFee_breakdown_USDT_weightedAverageCost, //B097
  //             },
  //             USD: {
  //               amount:
  //                 costs_details_technicalProviderFee_breakdown_USD_amount, //B098
  //               weightedAverageCost:
  //                 costs_details_technicalProviderFee_breakdown_USD_weightedAverageCost, //B099
  //             },
  //           },
  //         },
  //         marketDataProviderFee: {
  //           weightedAverageCost:
  //             costs_details_marketDataProviderFee_weightedAverageCost, //B015
  //         },
  //         newCoinListingCost: {
  //           weightedAverageCost:
  //             costs_details_newCoinListingCost_weightedAverageCost, //B016
  //         },
  //       },
  //     },

  //     operatingExpenses: {
  //       weightedAverageCost:
  //         operatingExpenses_weightedAverageCost, //B031
  //       details: {
  //         salaries: operatingExpenses_details_salaries, //B017
  //         rent: operatingExpenses_details_rent, //B018
  //         marketing:
  //           operatingExpenses_details_marketing, //B019
  //         rebateExpenses: {
  //           weightedAverageCost:
  //             operatingExpenses_details_rebateExpenses_weightedAverageCost, //B020
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 operatingExpenses_details_rebateExpenses_breakdown_ETH_amount, //B078
  //               weightedAverageCost:
  //                 operatingExpenses_details_rebateExpenses_breakdown_ETH_weightedAverageCost, //B079
  //             },
  //             BTC: {
  //               amount:
  //                 operatingExpenses_details_rebateExpenses_breakdown_BTC_amount, //B080
  //               weightedAverageCost:
  //                 operatingExpenses_details_rebateExpenses_breakdown_BTC_weightedAverageCost, //B081
  //             },
  //             USDT: {
  //               amount:
  //                 operatingExpenses_details_rebateExpenses_breakdown_USDT_amount, //B082
  //               weightedAverageCost:
  //                 operatingExpenses_details_rebateExpenses_breakdown_USDT_weightedAverageCost, //B083
  //             },
  //             USD: {
  //               amount:
  //                 operatingExpenses_details_rebateExpenses_breakdown_USD_amount, //B084
  //               weightedAverageCost:
  //                 operatingExpenses_details_rebateExpenses_breakdown_USD_weightedAverageCost, //B085
  //             },
  //           },
  //         },
  //       },
  //     },

  //     financialCosts: {
  //       weightedAverageCost:
  //         financialCosts_weightedAverageCost, //B032
  //       details: {
  //         interestExpense:
  //           financialCosts_details_interestExpense, //B021
  //         cryptocurrencyForexLosses: {
  //           weightedAverageCost:
  //             financialCosts_details_cryptocurrencyForexLosses, //B022
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_amount,
  //               weightedAverageCost:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_ETH_weightedAverageCost,
  //             },
  //             BTC: {
  //               amount:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_amount,
  //               weightedAverageCost:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_BTC_weightedAverageCost,
  //             },
  //             USDT: {
  //               amount:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_amount,
  //               weightedAverageCost:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_USDT_weightedAverageCost,
  //             },
  //             USD: {
  //               amount:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_amount,
  //               weightedAverageCost:
  //                 financialCosts_details_cryptocurrencyForexLosses_breakdown_USD_weightedAverageCost,
  //             },
  //           },
  //         },
  //         fiatToCryptocurrencyConversionLosses:
  //           financialCosts_details_fiatToCryptocurrencyConversionLosses, //B023
  //         cryptocurrencyToFiatConversionLosses:
  //           financialCosts_details_cryptocurrencyToFiatConversionLosses, //B024
  //         fiatToFiatConversionLosses:
  //           financialCosts_details_fiatToFiatConversionLosses, //B025
  //       },
  //     },

  //     otherGainLosses: {
  //       weightedAverageCost:
  //         otherGainsLosses_weightedAverageCost, //B033
  //       details: {
  //         investmentGains:
  //           otherGainsLosses_details_investmentGains, //B026
  //         forexGains:
  //           otherGainsLosses_details_forexGains, //B027
  //         cryptocurrencyGains: {
  //           weightedAverageCost:
  //             otherGainsLosses_details_cryptocurrencyGains_weightedAverageCosts,
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_amount, //B100
  //               weightedAverageCost:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_USDT_weightedAverageCost, //B101
  //             },
  //             ETH: {
  //               amount:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_amount, //B102
  //               weightedAverageCost:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_ETH_weightedAverageCost, //B103
  //             },
  //             BTC: {
  //               amount:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_amount, //B104
  //               weightedAverageCost:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_BTC_weightedAverageCost, //B105
  //             },
  //             USD: {
  //               amount:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_amount,
  //               weightedAverageCost:
  //                 otherGainsLosses_details_cryptocurrencyGains_breakdown_USD_weightedAverageCost,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   cashFlow: {
  //     reportType: 'cash flow sheet',
  //     reportID: reportID,
  //     reportName: reportName,
  //     reportStartTime: startTime * 10 ** 18,
  //     reportEndTime: endTime * 10 ** 18,
  //     supplementalScheduleOfNonCashOperatingActivities: {
  //       weightedAverageCost:
  //         supplementalScheduleOfNonCashOperatingActivities_weightedAverageCost, //C007
  //       details: {
  //         cryptocurrenciesPaidToCustomersForPerpetualContractProfits: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToCustomersForPerpetualContractProfits_weightedAverageCost,
  //         },
  //         cryptocurrenciesDepositedByCustomers: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_weightedAverageCost, //C001
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_amount, //C002
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_USDT_weightedAverageCost, //C003
  //             },
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_amount, //C052
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_ETH_weightedAverageCost, //C053
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_amount, //C054
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesDepositedByCustomers_breakdown_BTC_weightedAverageCost, //C055
  //             },
  //           },
  //         },
  //         cryptocurrenciesWithdrawnByCustomers: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_weightedAverageCost, //C009
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_amount, //C010
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_USDT_weightedAverageCost, //C011
  //             },
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_amount, //C056
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_ETH_weightedAverageCost, //C057
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_amount, //C058
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesWithdrawnByCustomers_breakdown_BTC_weightedAverageCost, //C059
  //             },
  //           },
  //         },
  //         cryptocurrenciesPaidToSuppliersForExpenses: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_weightedAverageCost, //C012
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_amount, //C013
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_ETH_weightedAverageCost, //C014
  //             },
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_amount, //C106
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_USDT_weightedAverageCost, //C107
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_amount, //C108
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesPaidToSuppliersForExpenses_breakdown_BTC_weightedAverageCost, //C109
  //             },
  //           },
  //         },
  //         cryptocurrencyInflows: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_weightedAverageCost, //C015
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_amount, //C060
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_ETH_weightedAverageCost, //C061
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_amount, //C062
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_BTC_weightedAverageCost, //C063
  //             },
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_amount, //C064
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyInflows_breakdown_USDT_weightedAverageCost, //C065
  //             },
  //           },
  //         },
  //         cryptocurrencyOutflows: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_weightedAverageCost, //C016
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_amount, //C066
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_ETH_weightedAverageCost, //C067
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_amount, //C068
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_BTC_weightedAverageCost, //C069
  //             },
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_amount, //C070
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrencyOutflows_breakdown_USDT_weightedAverageCost, //C071
  //             },
  //           },
  //         },
  //         purchaseOfCryptocurrenciesWithNonCashConsideration: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_weightedAverageCost, //C023
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount, //C088
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost, //C089
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount, //C090
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost, //C091
  //             },
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount, //C092
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_weightedAverageCost, //C093
  //             },
  //           },
  //         },
  //         disposalOfCryptocurrenciesForNonCashConsideration: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_weightedAverageCost, //C024
  //           breakdown: {
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_amount, //C094
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_ETH_weightedAverageCost, //C095
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_amount, //C096
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_BTC_weightedAverageCost, //C097
  //             },
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_amount, //C098
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_disposalOfCryptocurrenciesForNonCashConsideration_breakdown_USDT_weightedAverageCost, //C099
  //             },
  //           },
  //         },
  //         cryptocurrenciesReceivedFromCustomersAsTransactionFees: {
  //           weightedAverageCost:
  //             supplementalScheduleOfNonCashOperatingActivities_details_cryptocurrenciesReceivedFromCustomersAsTransactionFees_weightedAverageCost, //C025
  //           breakdown: {
  //             USDT: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_USDT_amount, //C072
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost, //C073
  //             },
  //             ETH: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_amount, //C074
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_ETH_weightedAverageCost, //C075
  //             },
  //             BTC: {
  //               amount:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_amount, //C076
  //               weightedAverageCost:
  //                 supplementalScheduleOfNonCashOperatingActivities_details_purchaseOfCryptocurrenciesWithNonCashConsideration_breakdown_BTC_weightedAverageCost, //C077
  //             },
  //           },
  //         },
  //       },
  //     },

  //     otherSupplementaryItems: {
  //       details: {
  //         relatedToNonCash: {
  //           cryptocurrenciesEndOfPeriod: {
  //             weightedAverageCost:
  //               otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesEndOfPeriod_weightedAverageCost, //C051
  //           },
  //           cryptocurrenciesBeginningOfPeriod: {
  //             weightedAverageCost:
  //               otherSupplementaryItems_details_relatedToNonCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost, //C050
  //           },
  //         },
  //         relatedToCash: {
  //           netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash: {
  //             weightedAverageCost:
  //               otherSupplementaryItems_details_relatedToCash_netIncreaseDecreaseInCashCashEquivalentsAndRestrictedCash_weightedAverageCost, //C049
  //           },
  //           cryptocurrenciesBeginningOfPeriod: {
  //             weightedAverageCost:
  //               otherSupplementaryItems_details_relatedToCash_cryptocurrenciesBeginningOfPeriod_weightedAverageCost, //C051
  //           },
  //           cryptocurrenciesEndOfPeriod: {
  //             weightedAverageCost:
  //               otherSupplementaryItems_details_relatedToCash_cryptocurrenciesEndOfPeriod_weightedAverageCost, //C052
  //           },
  //         },
  //       },
  //     },

  //     operatingActivities: {
  //       weightedAverageCost:
  //         operatingActivities_weightedAverageCost, //C041
  //       details: {
  //         cashDepositedByCustomers: {
  //           weightedAverageCost:
  //             operatingActivities_details_cashDepositedByCustomers_weightedAverageCost, //C027
  //           breakdown: {
  //             USD: {
  //               amount:
  //                 operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount, //C134
  //               weightedAverageCost:
  //                 operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost, //C135
  //             },
  //           },
  //         },
  //         cashWithdrawnByCustomers: {
  //           weightedAverageCost:
  //             operatingActivities_details_cashWithdrawnByCustomers_weightedAverageCost, //C028
  //           breakdown: {
  //             USD: {
  //               amount:
  //                 operatingActivities_details_cashDepositedByCustomers_breakdown_USD_amount, //C136
  //               weightedAverageCost:
  //                 operatingActivities_details_cashDepositedByCustomers_breakdown_USD_weightedAverageCost, //C137
  //             },
  //           },
  //         },
  //         purchaseOfCryptocurrencies: {
  //           weightedAverageCost:
  //             operatingActivities_details_purchaseOfCryptocurrencies_weightedAverageCost, //C029
  //         },
  //         disposalOfCryptocurrencies: {
  //           weightedAverageCost:
  //             operatingActivities_details_disposalOfCryptocurrencies_weightedAverageCost, //C030
  //         },
  //         cashReceivedFromCustomersAsTransactionFee: {
  //           weightedAverageCost:
  //             operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_weightedAverageCost, //C031
  //           breakdown: {
  //             USD: {
  //               amount:
  //                 operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_amount, //C138
  //               weightedAverageCost:
  //                 operatingActivities_details_cashReceivedFromCustomersAsTransactionFee_breakdown_USD_weightedAverageCost, //C139
  //             },
  //           },
  //         },
  //         cashPaidToSuppliersForExpenses: {
  //           weightedAverageCost:
  //             operatingActivities_details_cashPaidToSuppliersForExpenses_weightedAverageCost, //C034
  //           breakdown: {
  //             USD: {
  //               amount:
  //                 operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_amount, //C140
  //               weightedAverageCost:
  //                 operatingActivities_details_cashPaidToSuppliersForExpenses_breakdown_USD_weightedAverageCost, //C141
  //             },
  //           },
  //         },
  //       },
  //     },

  //     investingActivities: {
  //       weightedAverageCost:
  //         investingActivities_weightedAverageCost, //C042
  //     },

  //     financingActivities: {
  //       weightedAverageCost:
  //         financingActivities_weightedAverageCost, //C048
  //       details: {
  //         proceedsFromIssuanceOfCommonStock: {
  //           weightedAverageCost:
  //             financingActivities_details_proceedsFromIssuanceOfCommonStock_weightedAverageCost, //C043
  //         },
  //         longTermDebt: {
  //           weightedAverageCost:
  //             financingActivities_details_longTermDebt_weightedAverageCost, //C044
  //         },
  //         shortTermBorrowings: {
  //           weightedAverageCost:
  //             financingActivities_details_shortTermBorrowings_weightedAverageCost, //C045
  //         },
  //         paymentsOfDividends: {
  //           weightedAverageCost:
  //             financingActivities_details_paymentsOfDividends_weightedAverageCost, //C046
  //         },
  //         treasuryStock: {
  //           weightedAverageCost:
  //             financingActivities_details_treasuryStock_weightedAverageCost, //C047
  //         },
  //       },
  //     },
  //   },
  // };
  console.log(JSON.stringify(data, null, 2));
})();
