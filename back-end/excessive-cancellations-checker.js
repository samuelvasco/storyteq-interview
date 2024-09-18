import fs from "fs/promises";
import { parse } from "csv-parse/sync";

export class ExcessiveCancellationsChecker {
  /**
   * Constructor for the ExcessiveCancellationsChecker class.
   * @param {string} filePath - The path to the CSV file containing the trades data.
   */
  constructor(filePath) {
    this.filePath = filePath;
  }

  /**
   * Returns the list of companies that are involved in excessive cancelling.
   * Note this should always resolve an array or throw error.
   * @returns {Promise<Company[]>} - A promise that resolves to an array of companies involved in excessive cancelling.
   */
  async companiesInvolvedInExcessiveCancellations() {
    const result = await this._processTradesData();
    return result.excessiveCompanies;
  }

  /**
   * Returns the total number of companies that are not involved in any excessive cancelling.
   * Note this should always resolve a number or throw error.
   * @returns {Promise<number>} - A promise that resolves to the total number of well-behaved companies.
   */
  async totalNumberOfWellBehavedCompanies() {
    const result = await this._processTradesData();
    return result.wellBehavedCompanies;
  }

  /**
   * Private method to read and parse the CSV file.
   * @returns {Promise<unknown[]>} - A promise that resolves to an array of trade objects.
   */
  async _readAndParseCSV() {
    const fileContent = await fs.readFile(this.filePath, "utf-8");
    return parse(fileContent, {
      columns: ["time", "company", "orderType", "quantity"],
      skip_empty_lines: true,
      relax_column_count: true,
      on_record: (record, { lines }) => {
        if (Object.keys(record).length !== 4) {
          return null;
        }
        record.time = new Date(record.time).getTime();
        return record;
      },
      cast: (value, context) => {
        if (context.column === "quantity") return parseInt(value, 10);
        return value;
      },
    });
  }

  /**
   * Private method to process the trades data to find companies involved in excessive cancelling.
   * @returns {Promise<Object>} - A promise that resolves to an object containing the list of excessive companies and the total number of well-behaved companies.
   */
  async _processTradesData() {
    // Read and parse the CSV file
    const trades = await this._readAndParseCSV();

    // Group trades by company and sort them by time
    const tradesByCompany = trades.reduce((acc, trade) => {
      if (!(trade.company in acc)) acc[trade.company] = [];
      acc[trade.company].push(trade);
      return acc;
    }, {});

    // Initialize a set to store companies involved in excessive cancelling
    const excessiveCancellingCompanies = new Set();

    // Iterate over each company
    for (const [company, companyTrades] of Object.entries(tradesByCompany)) {
      // Sort company trades by time
      companyTrades.sort((a, b) => a.time - b.time);

      let windowStart = 0,
        windowEnd = 0;
      const tradeTotals = {
        D: 0, // New order
        F: 0, // Cancel order
      };

      // Use a sliding window approach
      while (windowEnd < companyTrades.length) {
        const currentTime = companyTrades[windowEnd].time;

        // Expand the window to the right
        while (
          windowEnd < companyTrades.length &&
          companyTrades[windowEnd].time - currentTime < 60000
        ) {
          const trade = companyTrades[windowEnd];
          tradeTotals[trade.orderType] += trade.quantity;
          windowEnd++;
        }

        // Shrink the window from the left
        while (currentTime - companyTrades[windowStart].time > 60000) {
          const startTrade = companyTrades[windowStart];
          tradeTotals[startTrade.orderType] -= startTrade.quantity;
          windowStart++;
        }

        // Check for excessive cancellations
        if (
          (tradeTotals.D === 0 && tradeTotals.F > 0) ||
          tradeTotals.F / tradeTotals.D > 1 / 3
        ) {
          excessiveCancellingCompanies.add(company);
          break; // No need to check further for this company
        }
      }
    }

    // Get set of companies
    const companies = new Set(trades.map((trade) => trade.company));

    return {
      excessiveCompanies: Array.from(excessiveCancellingCompanies),
      wellBehavedCompanies: companies.size - excessiveCancellingCompanies.size,
    };
  }
}
