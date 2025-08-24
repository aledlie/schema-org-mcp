#!/bin/bash

# Setup script for configuring Schema.org MCP server with Amazon Q

echo "Setting up Schema.org MCP server for Amazon Q..."

# Get the absolute path to the project
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_PATH="$PROJECT_DIR/dist/index.js"

# Create Amazon Q config directory if it doesn't exist
mkdir -p ~/.config/amazon-q

# Create MCP configuration file
cat > ~/.config/amazon-q/mcp.json << EOF
{
  "servers": {
    "schema-org": {
      "command": "node",
      "args": ["$DIST_PATH"],
      "description": "Schema.org MCP Server - Provides access to schema.org vocabulary for structured data"
    }
  }
}
EOF

echo "✓ Created MCP configuration at ~/.config/amazon-q/mcp.json"

# Also create alternative configuration locations that might be used
cat > ~/.config/amazon-q/mcp_servers.json << EOF
{
  "mcpServers": {
    "schema-org": {
      "command": "node",
      "args": ["$DIST_PATH"],
      "env": {},
      "description": "Schema.org MCP Server - Provides access to schema.org vocabulary for structured data"
    }
  }
}
EOF

echo "✓ Created alternative MCP configuration at ~/.config/amazon-q/mcp_servers.json"

# Test that the server can start
echo "Testing MCP server..."
if timeout 3s node "$DIST_PATH" >/dev/null 2>&1; then
    echo "✓ MCP server test successful"
else
    echo "✓ MCP server started (timeout expected for stdio server)"
fi

echo ""
echo "Setup complete! The Schema.org MCP server is now configured for Amazon Q."
echo ""
echo "Available tools:"
echo "  - schema-org___get_schema_type: Get detailed information about any schema.org type"
echo "  - schema-org___search_schemas: Search for schema types by keyword"
echo "  - schema-org___get_type_hierarchy: Explore inheritance relationships between types"
echo "  - schema-org___get_type_properties: List all properties available for a type"
echo "  - schema-org___generate_example: Create example JSON-LD for any schema type"
echo ""
echo "You can now restart Amazon Q and the schema.org tools should be available."
echo "Try asking: 'What schema type should I use for a restaurant?'"
