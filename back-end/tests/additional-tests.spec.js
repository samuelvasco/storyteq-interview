import { ExcessiveCancellationsChecker } from "../excessive-cancellations-checker.js";
import fs from "fs/promises";

describe("Given ExcessiveCancellationsChecker class", () => {
  let checker;
  const testFilePath = "./data/test-trades.csv";

  beforeEach(() => {
    checker = new ExcessiveCancellationsChecker(testFilePath);
  });

  afterEach(async () => {
    try {
      await fs.unlink(testFilePath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  const writeTestFile = async (content) => {
    await fs.writeFile(testFilePath, content);
  };

  describe("When using companiesInvolvedInExcessiveCancellations method", () => {
    it("Then it should return an empty array when no companies are involved in excessive cancellations", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,D,100
        2023-01-01 10:00:30,Company A,F,10
        2023-01-01 10:01:00,Company B,D,200
        2023-01-01 10:01:30,Company B,F,20
      `);

      // Act
      const result = await checker.companiesInvolvedInExcessiveCancellations();

      // Assert
      expect(result).toEqual([]);
    });

    it("Then it should correctly identify companies involved in excessive cancellations", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,D,100
        2023-01-01 10:00:30,Company A,F,40
        2023-01-01 10:01:00,Company B,D,100
        2023-01-01 10:01:30,Company B,F,50
        2023-01-01 10:02:00,Company C,D,100
        2023-01-01 10:02:30,Company C,F,10
      `);

      // Act
      const result = await checker.companiesInvolvedInExcessiveCancellations();

      // Assert
      expect(result).toEqual(["Company A", "Company B"]);
    });

    it("Then it should handle edge case where cancellations occur without any new orders", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,F,10
        2023-01-01 10:00:30,Company B,D,100
        2023-01-01 10:01:00,Company B,F,10
      `);

      // Act
      const result = await checker.companiesInvolvedInExcessiveCancellations();

      // Assert
      expect(result).toEqual(["Company A"]);
    });

    it("Then it should consider the 60-second window correctly", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,F,2
        2023-01-01 10:00:30,Company A,D,10
        2023-01-01 10:01:01,Company A,F,2
      `);

      // Act
      const result = await checker.companiesInvolvedInExcessiveCancellations();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("When using totalNumberOfWellBehavedCompanies method", () => {
    it("Then it should return the correct number of well-behaved companies", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,D,100
        2023-01-01 10:00:30,Company A,F,20
        2023-01-01 10:01:00,Company B,D,100
        2023-01-01 10:01:30,Company B,F,50
        2023-01-01 10:02:00,Company C,D,100
        2023-01-01 10:02:30,Company C,F,10
      `);

      // Act
      const result = await checker.totalNumberOfWellBehavedCompanies();

      // Assert
      expect(result).toBe(2);
    });

    it("Then it should return 0 when all companies are involved in excessive cancellations", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,D,100
        2023-01-01 10:00:30,Company A,F,40
        2023-01-01 10:01:00,Company B,D,100
        2023-01-01 10:01:30,Company B,F,50
      `);

      // Act
      const result = await checker.totalNumberOfWellBehavedCompanies();

      // Assert
      expect(result).toBe(0);
    });

    it("Then it should handle edge case with no trades", async () => {
      // Arrange
      await writeTestFile(``);

      // Act
      const result = await checker.totalNumberOfWellBehavedCompanies();

      // Assert
      expect(result).toBe(0);
    });
  });

  describe("When handling invalid file", () => {
    it("Then it should throw an error when the file does not exist", async () => {
      // Arrange
      const invalidChecker = new ExcessiveCancellationsChecker(
        "./non-existent-file.csv"
      );
      // Act & Assert
      await expect(
        invalidChecker.companiesInvolvedInExcessiveCancellations()
      ).rejects.toThrow();
    });

    it("Then it should ignore malformed lines in the CSV", async () => {
      // Arrange
      await writeTestFile(`
        2023-01-01 10:00:00,Company A,D,100
        Invalid line
        2023-01-01 10:00:30,Company A,F,20
        Another invalid line
        2023-01-01 10:01:00,Company B,D,100
      `);

      // Act
      const result = await checker.companiesInvolvedInExcessiveCancellations();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("Performance", () => {
    it("Then it should handle large datasets efficiently", async () => {
      // Arrange
      const generateLargeDataset = () => {
        let data = "";
        for (let i = 0; i < 100000; i++) {
          const time = new Date(2023, 0, 1, 10, 0, 0).getTime() + i * 1000;
          const company = `Company${i % 100}`;
          const orderType = i % 3 === 0 ? "F" : "D";
          const quantity = Math.floor(Math.random() * 1000) + 1;
          data += `${new Date(
            time
          ).toISOString()},${company},${orderType},${quantity}\n`;
        }
        return data;
      };

      await writeTestFile(generateLargeDataset());

      // Act
      const startTime = Date.now();
      await checker.companiesInvolvedInExcessiveCancellations();
      const endTime = Date.now();

      // Assert
      expect(endTime - startTime).toBeLessThan(5000); // Assuming it should complete within 5 seconds
    });
  });
});
