/**
 * Dutch Tax Box 3 Calculator Library
 * @module dutch-tax-box3-calculator
 */

/**
 * User input for Box 3 tax calculation
 */
export interface Box3Input {
  /** Bank balance amount in euros */
  bankBalance?: number;
  /** Investment assets amount in euros */
  investmentAssets?: number;
  /** Debts amount in euros */
  debts?: number;
  /** Whether the user has a tax partner */
  hasTaxPartner?: boolean;
}

/**
 * Default configuration values for Box 3 calculation
 */
export interface Box3Defaults {
  /** Threshold values for tax-free assets and debts */
  thresholds?: {
    /** Tax-free assets per individual in euros */
    taxFreeAssetsPerIndividual?: number;
    /** Debts threshold per individual in euros */
    debtsThresholdPerIndividual?: number;
  };
  /** Tax rate applied to income from savings and investments */
  taxRate?: number;
  /** Assumed return rates for different asset types */
  assumedReturnRates?: {
    /** Return rate for bank balance */
    bankBalance?: number;
    /** Return rate for investment assets */
    investmentAssets?: number;
    /** Return rate for debts */
    debts?: number;
  };
}

/**
 * Breakdown item for detailed calculation steps
 */
export interface BreakdownItem {
  /** Description of the calculation step */
  description: string;
  /** Calculated amount in euros */
  amount: number;
}

/**
 * Result of Box 3 tax calculation
 */
export interface Box3Result {
  /** Taxable base (basis for savings & investments) */
  taxableBase: number;
  /** Estimated Box 3 tax amount */
  estimatedTax: number;
  /** Detailed breakdown of calculation steps */
  breakdown: BreakdownItem[];
}

/**
 * Calculate Dutch Box 3 tax (wealth tax) based on savings and investments
 * 
 * @param inputs - User's financial data (bank balance, investments, debts, tax partner status)
 * @param defaults - Configuration values (thresholds, tax rate, assumed return rates)
 * @returns Box 3 calculation result with taxable base, estimated tax, and breakdown
 * 
 * @example
 * ```typescript
 * const result = calculateBox3Tax(
 *   {
 *     bankBalance: 50000,
 *     investmentAssets: 30000,
 *     debts: 10000,
 *     hasTaxPartner: false
 *   },
 *   {
 *     thresholds: {
 *       taxFreeAssetsPerIndividual: 57000,
 *       debtsThresholdPerIndividual: 3700
 *     },
 *     taxRate: 0.36,
 *     assumedReturnRates: {
 *       bankBalance: 0.0092,
 *       investmentAssets: 0.0592,
 *       debts: 0.0292
 *     }
 *   }
 * );
 * ```
 */
export function calculateBox3Tax(
  inputs: Box3Input,
  defaults: Box3Defaults
): Box3Result {
  const { bankBalance = 0, investmentAssets = 0, debts = 0, hasTaxPartner = false } = inputs ?? {};
  const { thresholds, taxRate, assumedReturnRates } = defaults ?? {};
  const { taxFreeAssetsPerIndividual = 0, debtsThresholdPerIndividual = 0 } = thresholds ?? {};

  // Step 1: taxable returns calculation
  const multiplier = hasTaxPartner ? 2 : 1;
  const totalTaxFreeAllowance = multiplier * taxFreeAssetsPerIndividual;
  const totalDebtsThreshold = multiplier * debtsThresholdPerIndividual;

  const returnsOnBankBalance = bankBalance * (assumedReturnRates?.bankBalance ?? 0);
  const returnsOnInvestmentAssets = investmentAssets * (assumedReturnRates?.investmentAssets ?? 0);
  const debtAfterDeductible = Math.max(0, debts - totalDebtsThreshold);
  const totalCosts = debtAfterDeductible * (assumedReturnRates?.debts ?? 0);
  const totalReturns = returnsOnBankBalance + returnsOnInvestmentAssets;
  const taxableReturns = Math.max(0, totalReturns - totalCosts);

  // Step 2: capital yield tax base
  const capitalYieldTaxBase = bankBalance + investmentAssets - debtAfterDeductible;

  // Step 3: basis for savings & investments
  const basisForSavingsAndInvestments = Math.max(0, capitalYieldTaxBase - totalTaxFreeAllowance);

  // Step 4: share in capital yield tax base
  const shareInCapitalYieldTaxBase =
    capitalYieldTaxBase > 0 ? basisForSavingsAndInvestments / capitalYieldTaxBase : 0;

  // Step 5: income from savings and investments
  const incomeFromSavingsAndInvestments = taxableReturns * shareInCapitalYieldTaxBase;

  // Step 6: estimated Box 3 tax
  const estimatedBox3Tax = incomeFromSavingsAndInvestments * (taxRate ?? 0);

  return {
    taxableBase: basisForSavingsAndInvestments,
    estimatedTax: estimatedBox3Tax,
    breakdown: [
      {
        description: 'Total returns',
        amount: totalReturns,
      },
      {
        description: 'Total costs',
        amount: totalCosts,
      },
      {
        description: 'Taxable returns',
        amount: taxableReturns,
      },
      {
        description: 'Capital yield tax base',
        amount: capitalYieldTaxBase,
      },
      {
        description: 'Basis for savings & investments',
        amount: basisForSavingsAndInvestments,
      },
      {
        description: 'Income from savings and investments',
        amount: incomeFromSavingsAndInvestments,
      },
    ],
  };
}

// Export constants
export {
  BOX3_DEFAULTS_BY_YEAR,
  BOX3_DEFAULTS,
  AVAILABLE_YEARS,
  DEFAULT_YEAR,
  getDefaultsForYear,
} from './constants.js';

export default { calculateBox3Tax };
