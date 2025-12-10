/**
 * Example usage of dutch-tax-box3-calculator
 */

import {
  calculateBox3Tax,
  BOX3_DEFAULTS,
  AVAILABLE_YEARS,
  getDefaultsForYear,
} from './dist/index.js';

console.log('=== Dutch Tax Box 3 Calculator Examples ===\n');

// Example 1: Using current year (2025) defaults
console.log('Example 1: Using 2025 defaults (BOX3_DEFAULTS)');
const result2025 = calculateBox3Tax(
  {
    bankBalance: 100000,
    investmentAssets: 50000,
    debts: 10000,
    hasTaxPartner: false,
  },
  BOX3_DEFAULTS
);
console.log(`Taxable Base: €${result2025.taxableBase.toFixed(2)}`);
console.log(`Estimated Tax: €${result2025.estimatedTax.toFixed(2)}`);
console.log();

// Example 2: Compare across different years
console.log('Example 2: Tax comparison across years');
const inputs = {
  bankBalance: 75000,
  investmentAssets: 25000,
  debts: 5000,
  hasTaxPartner: false,
};

AVAILABLE_YEARS.forEach((year) => {
  const result = calculateBox3Tax(inputs, getDefaultsForYear(year));
  console.log(`${year}: Taxable Base: €${result.taxableBase.toFixed(2)}, Tax: €${result.estimatedTax.toFixed(2)}`);
});
console.log();

// Example 3: With tax partner
console.log('Example 3: With tax partner (doubles thresholds)');
const resultWithPartner = calculateBox3Tax(
  {
    bankBalance: 150000,
    investmentAssets: 0,
    debts: 0,
    hasTaxPartner: true,
  },
  getDefaultsForYear(2024)
);
console.log(`Taxable Base: €${resultWithPartner.taxableBase.toFixed(2)}`);
console.log(`Estimated Tax: €${resultWithPartner.estimatedTax.toFixed(2)}`);
console.log();

// Example 4: View calculation breakdown
console.log('Example 4: Detailed breakdown');
const detailedResult = calculateBox3Tax(
  {
    bankBalance: 60000,
    investmentAssets: 40000,
    debts: 15000,
    hasTaxPartner: false,
  },
  getDefaultsForYear(2024)
);
console.log('Breakdown:');
detailedResult.breakdown.forEach((item) => {
  console.log(`  ${item.description}: €${item.amount.toFixed(2)}`);
});
console.log(`\nFinal Tax: €${detailedResult.estimatedTax.toFixed(2)}`);
