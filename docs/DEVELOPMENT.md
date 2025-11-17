# Development Guide

## Project Structure

```
schema-org-mcp/
├── src/                          # TypeScript source files
│   ├── index.ts                  # Main MCP server entry point
│   ├── schema-org-client.ts      # Schema.org API client
│   ├── schema-types.ts           # TypeScript type definitions
│   ├── metadata-generator.ts     # Metadata generation utilities
│   ├── performance-client.ts     # Performance testing client
│   └── performance-types.ts      # Performance test type definitions
├── dist/                         # Compiled JavaScript (generated)
├── tests/                        # Test files
│   └── schema-org-client.test.ts
├── examples/                     # Usage examples
│   ├── client-example.ts
│   ├── claude-desktop-config.json
│   └── structured-data-examples.json
├── docs/                         # Documentation
│   ├── EXAMPLES.md
│   └── DEVELOPMENT.md (this file)
├── performance-suite/            # Separate performance testing subproject
│   ├── core-web-vitals.js
│   ├── load-testing.js
│   ├── stress-testing.js
│   ├── soak-testing.js
│   ├── scalability-testing.js
│   ├── schema-impact-test.js
│   ├── master-performance-suite.js
│   ├── performance-reports/
│   └── README.md
├── package.json
├── tsconfig.json
├── jest.config.cjs
└── README.md
```

## Setup

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Development Workflow

### Watch Mode

Run TypeScript compiler in watch mode for active development:

```bash
npm run dev
```

### Building

Build the project for production:

```bash
npm run build
```

This compiles TypeScript files from `src/` to `dist/`.

### Testing

Run the test suite:

```bash
npm test
```

Tests are located in the `tests/` directory and use Jest.

## Code Organization

### Main Server (`src/index.ts`)

The main MCP server that:
- Registers all available tools
- Handles tool calls from Claude
- Manages schema.org data fetching and caching
- Integrates with the performance suite

### Schema.org Client (`src/schema-org-client.ts`)

Client for interacting with schema.org:
- Fetches schema.org vocabulary in JSON-LD format
- Indexes types and properties
- Provides search functionality
- Generates examples

### Performance Client (`src/performance-client.ts`)

Integration with the performance-suite:
- Spawns performance test processes
- Collects and formats results
- Provides analysis and comparison tools

### Type Definitions

- `src/schema-types.ts`: Schema.org type definitions
- `src/performance-types.ts`: Performance test type definitions

## Adding New Features

### Adding a New MCP Tool

1. Add the tool definition in `src/index.ts`:

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ... existing tools
    {
      name: "your_new_tool",
      description: "What your tool does",
      inputSchema: {
        type: "object",
        properties: {
          // Define input parameters
        },
        required: ["param1", "param2"]
      }
    }
  ]
}));
```

2. Add the handler in `src/index.ts`:

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // ... existing handlers

  if (request.params.name === "your_new_tool") {
    // Implement your tool logic
    return {
      content: [{ type: "text", text: result }]
    };
  }
});
```

### Adding New Performance Tests

1. Create a new test file in `performance-suite/`
2. Follow the existing pattern from other test files
3. Export results with schema.org markup
4. Add npm script to `performance-suite/package.json`
5. Integrate with `master-performance-suite.js` if needed

## Performance Suite Development

The performance suite is a separate subproject with its own:
- `package.json`
- `node_modules/`
- Dependencies
- Documentation

See [performance-suite/README.md](../performance-suite/README.md) for details.

## Best Practices

### TypeScript

- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` types where possible

### Schema.org Integration

- Always use official schema.org types
- Include `@context` in generated JSON-LD
- Validate generated examples

### Performance Testing

- Use realistic test scenarios
- Document all metrics
- Provide context for results
- Include schema.org markup in reports

### Error Handling

- Provide clear error messages
- Include troubleshooting hints
- Log errors appropriately

## Git Workflow

### .gitignore

The project ignores:
- `node_modules/`
- `dist/` (generated code)
- `repomix-output.xml` files
- Auto-generated `README_ENHANCED.md` files
- Performance suite `package-lock.json`
- Most `*.json` reports (except specific ones)

### Committing

Before committing:
1. Build the project: `npm run build`
2. Run tests: `npm test`
3. Check that examples work
4. Update documentation if needed

## Deployment

### Running the MCP Server

```bash
# Start the server
npm start
```

The server communicates via stdio with the MCP client (like Claude Desktop).

### Claude Desktop Integration

1. Build the project
2. Update Claude Desktop config with the path to `dist/index.js`
3. Restart Claude Desktop

## Troubleshooting

### Build Errors

- Ensure you're using Node.js >= 14.0.0
- Delete `node_modules/` and reinstall
- Check TypeScript version compatibility

### Performance Suite Issues

- Ensure Puppeteer is properly installed
- Check that test URLs are accessible
- Verify sufficient system resources for load tests

### MCP Connection Issues

- Check Claude Desktop config path
- Verify the server starts without errors
- Check Claude Desktop logs

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Schema.org Documentation](https://schema.org/)
- [Puppeteer Documentation](https://pptr.dev/)
- [Jest Documentation](https://jestjs.io/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## License

MIT - See [LICENSE](../LICENSE) for details.
