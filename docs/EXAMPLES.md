# Schema.org MCP Examples

This document contains usage examples for the Schema.org MCP server.

## Client Example

See [`examples/client-example.ts`](../examples/client-example.ts) for a full TypeScript client implementation.

## Configuration Examples

### Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "schema-org": {
      "command": "node",
      "args": ["/path/to/schema-org-mcp/dist/index.js"]
    }
  }
}
```

See [`examples/claude-desktop-config.json`](../examples/claude-desktop-config.json) for a complete example.

## Structured Data Examples

See [`examples/structured-data-examples.json`](../examples/structured-data-examples.json) for various schema.org JSON-LD examples including:

- Person
- Organization
- Article
- Product
- Recipe
- Event
- And more...

## Usage Examples

### Get Information About a Schema Type

```
User: "Tell me about the Person schema type"

Claude uses: get_schema_type with typeName: "Person"
```

### Search for Schema Types

```
User: "What schema types are available for recipes?"

Claude uses: search_schemas with query: "recipe"
```

### Generate JSON-LD Example

```
User: "Create a JSON-LD example for a blog post"

Claude uses: generate_example for "BlogPosting" type
```

### Performance Testing

```
User: "Test the performance of example.com"

Claude uses: run_performance_test with url: "https://example.com"
```

## Integration Patterns

### Website Schema Recommendations

1. User describes their website
2. Claude searches for relevant schema types
3. Claude gets type properties
4. Claude generates example JSON-LD
5. User implements on their site

### Performance Impact Analysis

1. User provides website URL
2. Claude runs performance tests before schema implementation
3. User adds schema.org markup
4. Claude runs tests again
5. Claude compares results and analyzes impact

## More Information

- [Main README](../README.md)
- [Performance Suite Documentation](../performance-suite/README.md)
- [Metrics Documentation](../performance-suite/METRICS-DOCUMENTATION.md)
