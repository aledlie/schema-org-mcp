# Comprehensive Performance Test Suite

Industry-standard performance testing suite for web applications, integrated with the schema-org-mcp server.

## Features

- **Core Web Vitals Testing**: LCP, FID, CLS, TTFB, FCP, INP
- **Beyond Core Web Vitals**: Advanced metrics like Time to Interactive, Total Blocking Time
- **Load Testing**: Measure performance under expected traffic
- **Stress Testing**: Find breaking points under extreme load
- **Soak Testing**: Long-running endurance tests
- **Scalability Testing**: Assess performance across different load levels
- **Schema Impact Analysis**: Measure SEO, LLM, and performance impact of schema.org markup

## Installation

```bash
cd performance-suite
npm install
```

## Usage

### Quick Test Suite (5-10 minutes)
```bash
npm run test:quick
```

### Comprehensive Test Suite (30-60 minutes)
```bash
npm test
# or
npm run test:comprehensive
```

### Endurance Test Suite (2-4 hours)
```bash
npm run test:endurance
```

### Individual Tests

```bash
# Core Web Vitals
npm run test:core-web-vitals

# Beyond Core Web Vitals
npm run test:beyond-core-web-vitals

# Load Testing
npm run test:load

# Stress Testing
npm run test:stress

# Soak Testing (long-running)
npm run test:soak

# Scalability Testing
npm run test:scalability

# Schema.org Impact Analysis
npm run schema-test
```

## Test Configuration

Edit test scripts to configure:
- Target URLs
- Iteration counts
- Concurrent users
- Duration thresholds
- Performance budgets

## Reports

All test results are saved to `performance-reports/` with schema.org markup for better SEO and LLM understanding.

## Integration with MCP Server

This suite is integrated with the schema-org-mcp server, allowing Claude to:
- Run performance tests on websites
- Analyze schema.org impact
- Compare before/after results
- Generate performance reports with structured data

## Documentation

- [Metrics Documentation](./METRICS-DOCUMENTATION.md) - Detailed explanation of all metrics
- [Test Scripts](./run-tests.sh) - Shell script for batch testing

## Requirements

- Node.js >= 14.0.0
- Puppeteer (included in dependencies)

## License

MIT
