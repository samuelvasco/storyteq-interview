# Back-end Challenge

## Project setup

In order to run the project, you need to install the dependencies:

```bash
npm install
```

Run the tests with:

```bash
npm run test
```

## Decisions

### Sliding window approach

The sliding window approach is used to keep track of the trades for each company within a 60-second window. This is efficient because it allows us to slide the window across the trades and update the total number of trades and cancellations in linear time, O(n) instead of quadratic time O(n^2), as it would be if we were to process each trade individually.

### To improve

- Switch to TypeScript for type safety.
- If this class belongs to a bigger project, consider using dependency injection to instantiate it.
- Consider using a data processing library like Python pandas to handle the CSV file in a more efficient way.
- If the data is larger, consider using a data processing framework like Apache Spark to handle larger datasets and distribute the computations.
