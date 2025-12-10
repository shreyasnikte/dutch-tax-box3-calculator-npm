/**
 * Box 3 defaults configuration by year
 */

import { Box3Defaults } from './index.js';

/**
 * Year-specific Box 3 tax configuration
 */
export const BOX3_DEFAULTS_BY_YEAR: Record<number, Box3Defaults> = {
  2023: {
    thresholds: {
      taxFreeAssetsPerIndividual: 57000,
      debtsThresholdPerIndividual: 3400,
    },
    taxRate: 32 / 100,
    assumedReturnRates: {
      bankBalance: 0.92 / 100,
      investmentAssets: 6.17 / 100,
      debts: 2.46 / 100,
    },
  },
  2024: {
    thresholds: {
      taxFreeAssetsPerIndividual: 57000,
      debtsThresholdPerIndividual: 3700,
    },
    taxRate: 36 / 100,
    assumedReturnRates: {
      bankBalance: 1.44 / 100,
      investmentAssets: 6.04 / 100,
      debts: 2.61 / 100,
    },
  },
  2025: {
    thresholds: {
      taxFreeAssetsPerIndividual: 57684,
      debtsThresholdPerIndividual: 3800,
    },
    taxRate: 36 / 100,
    assumedReturnRates: {
      bankBalance: 1.44 / 100,
      investmentAssets: 5.88 / 100,
      debts: 2.62 / 100,
    },
  },
};

/**
 * List of available years, sorted in descending order
 */
export const AVAILABLE_YEARS = Object.keys(BOX3_DEFAULTS_BY_YEAR)
  .map(Number)
  .sort((a, b) => b - a);

/**
 * Default year for calculations
 */
export const DEFAULT_YEAR = 2025;

/**
 * Get Box 3 defaults for a specific year
 * @param year - The tax year
 * @returns Box 3 defaults configuration for the year, or defaults for DEFAULT_YEAR if not found
 */
export function getDefaultsForYear(year: number): Box3Defaults {
  return BOX3_DEFAULTS_BY_YEAR[year] ?? BOX3_DEFAULTS_BY_YEAR[DEFAULT_YEAR];
}

/**
 * Current year Box 3 defaults (for backward compatibility)
 */
export const BOX3_DEFAULTS: Box3Defaults = BOX3_DEFAULTS_BY_YEAR[DEFAULT_YEAR];
