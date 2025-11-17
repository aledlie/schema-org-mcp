# Examples

This directory contains usage examples for the Schema.org MCP server.

## Files

- **`client-example.ts`** - TypeScript example showing how to create an MCP client that connects to the schema-org server
- **`claude-desktop-config.json`** - Example configuration for integrating with Claude Desktop
- **`structured-data-examples.json`** - Collection of schema.org JSON-LD examples for common types

## Using the Examples

### Client Example

The client example demonstrates:
- Connecting to the MCP server
- Listing available tools
- Calling tools with parameters
- Processing responses

Run it with:
```bash
# Build the main project first
cd ..
npm run build

# Then run the example
npx tsx examples/client-example.ts
```

### Claude Desktop Configuration

To use the schema-org MCP server with Claude Desktop:

1. Build the project:
   ```bash
   npm run build
   ```

2. Copy the config structure from `claude-desktop-config.json`

3. Update the path in the config to point to your `dist/index.js`

4. Add to your Claude Desktop config at:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

5. Restart Claude Desktop

### Structured Data Examples

The `structured-data-examples.json` file contains ready-to-use JSON-LD examples for:
- Person
- Organization
- Article/BlogPosting
- Product
- Recipe
- Event
- CreativeWork
- And more...

Copy and customize these for your website's structured data.

## More Documentation

- [Main README](../README.md)
- [Full Examples Guide](../docs/EXAMPLES.md)
- [Development Guide](../docs/DEVELOPMENT.md)
