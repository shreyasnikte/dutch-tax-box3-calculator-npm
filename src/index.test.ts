import { test } from 'node:test';
import assert from 'node:assert';
import {
  calculateBox3Tax,
  BOX3_DEFAULTS,
  BOX3_DEFAULTS_BY_YEAR,
  AVAILABLE_YEARS,
  DEFAULT_YEAR,
  getDefaultsForYear,
} from '../dist/index.js';

test('calculateBox3Tax with basic input', () => {
  const result = calculateBox3Tax(
    {
      bankBalance: 50000,
      investmentAssets: 30000,
      debts: 0,
      hasTaxPartner: false,
    },
    {
      thresholds: {
        taxFreeAssetsPerIndividual: 57000,
        debtsThresholdPerIndividual: 3700,
      },
      taxRate: 0.36,
      assumedReturnRates: {
        bankBalance: 0.0092,
        investmentAssets: 0.0592,
        debts: 0.0292,
      },
    }
  );

  assert.ok(result.taxableBase >= 0);
  assert.ok(result.estimatedTax >= 0);
  assert.equal(result.breakdown.length, 6);
});

test('calculateBox3Tax with assets below threshold', () => {
  const result = calculateBox3Tax(
    {
      bankBalance: 30000,
      investmentAssets: 0,
      debts: 0,
      hasTaxPartner: false,
    },
    {
      thresholds: {
        taxFreeAssetsPerIndividual: 57000,
        debtsThresholdPerIndividual: 3700,
      },
      taxRate: 0.36,
      assumedReturnRates: {
        bankBalance: 0.0092,
        investmentAssets: 0.0592,
        debts: 0.0292,
      },
    }
  );

  assert.equal(result.taxableBase, 0);
  assert.equal(result.estimatedTax, 0);
});

test('calculateBox3Tax with tax partner doubles thresholds', () => {
  const result = calculateBox3Tax(
    {
      bankBalance: 100000,
      investmentAssets: 0,
      debts: 0,
      hasTaxPartner: true,
    },
    {
      thresholds: {
        taxFreeAssetsPerIndividual: 57000,
        debtsThresholdPerIndividual: 3700,
      },
      taxRate: 0.36,
      assumedReturnRates: {
        bankBalance: 0.0092,
        investmentAssets: 0.0592,
        debts: 0.0292,
      },
    }
  );

  // With tax partner: 100000 - (57000 * 2) = -14000 -> 0
  assert.equal(result.taxableBase, 0);
});

test('calculateBox3Tax with debts reduces taxable base', () => {
  const result = calculateBox3Tax(
    {
      bankBalance: 100000,
      investmentAssets: 0,
      debts: 50000,
      hasTaxPartner: false,
    },
    {
      thresholds: {
        taxFreeAssetsPerIndividual: 57000,
        debtsThresholdPerIndividual: 3700,
      },
      taxRate: 0.36,
      assumedReturnRates: {
        bankBalance: 0.0092,
        investmentAssets: 0.0592,
        debts: 0.0292,
      },
    }
  );

  // Capital yield base: 100000 - (50000 - 3700) = 53700
  // Taxable base: 53700 - 57000 = 0
  assert.equal(result.taxableBase, 0);
});

test('calculateBox3Tax handles default values', () => {
  const result = calculateBox3Tax({}, {});

  assert.equal(result.taxableBase, 0);
  assert.equal(result.estimatedTax, 0);
  assert.ok(Array.isArray(result.breakdown));
});

test('BOX3_DEFAULTS contains current year defaults', () => {
  assert.ok(BOX3_DEFAULTS);
  assert.ok(BOX3_DEFAULTS.thresholds);
  assert.ok(BOX3_DEFAULTS.taxRate);
  assert.ok(BOX3_DEFAULTS.assumedReturnRates);
});

test('BOX3_DEFAULTS_BY_YEAR contains all years', () => {
  assert.ok(BOX3_DEFAULTS_BY_YEAR[2023]);
  assert.ok(BOX3_DEFAULTS_BY_YEAR[2024]);
  assert.ok(BOX3_DEFAULTS_BY_YEAR[2025]);
});

test('AVAILABLE_YEARS is sorted in descending order', () => {
  assert.ok(Array.isArray(AVAILABLE_YEARS));
  assert.ok(AVAILABLE_YEARS.length >= 3);
  assert.equal(AVAILABLE_YEARS[0], 2025);
  assert.equal(AVAILABLE_YEARS[1], 2024);
  assert.equal(AVAILABLE_YEARS[2], 2023);
});

test('DEFAULT_YEAR is 2025', () => {
  assert.equal(DEFAULT_YEAR, 2025);
});

test('getDefaultsForYear returns correct defaults', () => {
  const defaults2024 = getDefaultsForYear(2024);
  assert.equal(defaults2024.thresholds?.taxFreeAssetsPerIndividual, 57000);
  assert.equal(defaults2024.thresholds?.debtsThresholdPerIndividual, 3700);
  assert.equal(defaults2024.taxRate, 0.36);
});

test('getDefaultsForYear falls back to default year for unknown year', () => {
  const defaults = getDefaultsForYear(9999);
  assert.deepEqual(defaults, BOX3_DEFAULTS_BY_YEAR[DEFAULT_YEAR]);
});

test('calculateBox3Tax with 2024 defaults', () => {
  const result = calculateBox3Tax(
    {
      bankBalance: 100000,
      investmentAssets: 50000,
      debts: 10000,
      hasTaxPartner: false,
    },
    getDefaultsForYear(2024)
  );

  assert.ok(result.taxableBase > 0);
  assert.ok(result.estimatedTax > 0);
  assert.equal(result.breakdown.length, 6);
});

