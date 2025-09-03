#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { SchemaOrgClient } from './schema-org-client.js';

const server = new Server(
  {
    name: 'schema-org-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const schemaClient = new SchemaOrgClient();

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_schema_type',
        description: 'Get detailed information about a schema.org type',
        inputSchema: {
          type: 'object',
          properties: {
            typeName: {
              type: 'string',
              description: 'The name of the schema.org type (e.g., "Person", "Organization", "Article")',
            },
          },
          required: ['typeName'],
        },
      },
      {
        name: 'search_schemas',
        description: 'Search for schema.org types by keyword',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to find relevant schema types',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_type_hierarchy',
        description: 'Get the inheritance hierarchy for a schema.org type',
        inputSchema: {
          type: 'object',
          properties: {
            typeName: {
              type: 'string',
              description: 'The name of the schema.org type',
            },
          },
          required: ['typeName'],
        },
      },
      {
        name: 'get_type_properties',
        description: 'Get all properties available for a schema.org type',
        inputSchema: {
          type: 'object',
          properties: {
            typeName: {
              type: 'string',
              description: 'The name of the schema.org type',
            },
            includeInherited: {
              type: 'boolean',
              description: 'Include properties inherited from parent types (default: true)',
              default: true,
            },
          },
          required: ['typeName'],
        },
      },
      {
        name: 'generate_example',
        description: 'Generate an example JSON-LD for a schema.org type',
        inputSchema: {
          type: 'object',
          properties: {
            typeName: {
              type: 'string',
              description: 'The name of the schema.org type',
            },
            properties: {
              type: 'object',
              description: 'Optional properties to include in the example',
              additionalProperties: true,
            },
          },
          required: ['typeName'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `No arguments provided for tool: ${name}`
    );
  }

  // TypeScript now knows args is defined
  const toolArgs = args;

  try {
    switch (name) {
      case 'get_schema_type': {
        if (typeof toolArgs.typeName !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'typeName must be a string'
          );
        }
        const result = await schemaClient.getSchemaType(toolArgs.typeName);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_schemas': {
        if (typeof toolArgs.query !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'query must be a string'
          );
        }
        const limit = toolArgs.limit !== undefined ? 
          (typeof toolArgs.limit === 'number' ? toolArgs.limit : 10) : 10;
        const result = await schemaClient.searchSchemas(toolArgs.query, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_type_hierarchy': {
        if (typeof toolArgs.typeName !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'typeName must be a string'
          );
        }
        const result = await schemaClient.getTypeHierarchy(toolArgs.typeName);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_type_properties': {
        if (typeof toolArgs.typeName !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'typeName must be a string'
          );
        }
        const includeInherited = toolArgs.includeInherited !== false;
        const result = await schemaClient.getTypeProperties(toolArgs.typeName, includeInherited);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_example': {
        if (typeof toolArgs.typeName !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'typeName must be a string'
          );
        }
        const properties = toolArgs.properties && typeof toolArgs.properties === 'object' 
          ? toolArgs.properties as Record<string, any>
          : undefined;
        const result = await schemaClient.generateExample(toolArgs.typeName, properties);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${error}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Schema.org MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
