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
import { MetadataGenerator } from './metadata-generator.js';
import { PerformanceClient } from './performance-client.js';

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
const metadataGenerator = new MetadataGenerator();
const performanceClient = new PerformanceClient();

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
      {
        name: 'get_server_metadata',
        description: 'Get structured metadata about this MCP server using schema.org types',
        inputSchema: {
          type: 'object',
          properties: {
            metadataType: {
              type: 'string',
              description: 'Type of metadata to generate (softwareApplication, sourceCode, apiReference, dataset, dataCatalog, webAPI, project, all)',
              enum: ['softwareApplication', 'sourceCode', 'apiReference', 'dataset', 'dataCatalog', 'webAPI', 'project', 'all'],
              default: 'all',
            },
          },
        },
      },
      {
        name: 'generate_search_action',
        description: 'Generate a SearchAction schema.org object for a search query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search query',
            },
            results: {
              type: 'array',
              description: 'Optional search results to include in the action',
              items: {
                type: 'object',
                additionalProperties: true,
              },
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'generate_create_action',
        description: 'Generate a CreateAction schema.org object for example generation',
        inputSchema: {
          type: 'object',
          properties: {
            typeName: {
              type: 'string',
              description: 'The schema.org type name',
            },
            result: {
              type: 'object',
              description: 'Optional generated result to include in the action',
              additionalProperties: true,
            },
          },
          required: ['typeName'],
        },
      },
      {
        name: 'run_performance_test',
        description: 'Run a performance test on a website URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to test',
            },
            testType: {
              type: 'string',
              description: 'Type of performance test to run',
              enum: ['core-web-vitals', 'load-test', 'stress-test', 'soak-test', 'scalability-test', 'schema-impact'],
            },
            options: {
              type: 'object',
              description: 'Test-specific options',
              additionalProperties: true,
            },
          },
          required: ['url', 'testType'],
        },
      },
      {
        name: 'run_comprehensive_test_suite',
        description: 'Run a comprehensive performance test suite on a website',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to test',
            },
            suiteType: {
              type: 'string',
              description: 'Type of test suite to run',
              enum: ['quick', 'comprehensive', 'endurance'],
              default: 'comprehensive',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'compare_performance_results',
        description: 'Compare two performance test results to analyze before/after impact',
        inputSchema: {
          type: 'object',
          properties: {
            beforeResult: {
              type: 'object',
              description: 'Performance test result from before changes',
              additionalProperties: true,
            },
            afterResult: {
              type: 'object',
              description: 'Performance test result from after changes',
              additionalProperties: true,
            },
          },
          required: ['beforeResult', 'afterResult'],
        },
      },
      {
        name: 'generate_performance_report',
        description: 'Generate a structured performance report with schema.org markup',
        inputSchema: {
          type: 'object',
          properties: {
            testResult: {
              type: 'object',
              description: 'Performance test result to generate report for',
              additionalProperties: true,
            },
          },
          required: ['testResult'],
        },
      },
      {
        name: 'analyze_schema_impact',
        description: 'Analyze the impact of schema.org implementation on SEO, LLM, and performance metrics',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'The URL to analyze for schema.org impact',
            },
            options: {
              type: 'object',
              description: 'Analysis options',
              additionalProperties: true,
            },
          },
          required: ['url'],
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

      case 'get_server_metadata': {
        const metadataType = toolArgs.metadataType || 'all';
        let result;

        if (metadataType === 'all') {
          result = metadataGenerator.generateAllMetadata();
        } else {
          switch (metadataType) {
            case 'softwareApplication':
              result = metadataGenerator.generateSoftwareApplication();
              break;
            case 'sourceCode':
              result = metadataGenerator.generateSoftwareSourceCode();
              break;
            case 'apiReference':
              result = metadataGenerator.generateAPIReference();
              break;
            case 'dataset':
              result = metadataGenerator.generateDataset();
              break;
            case 'dataCatalog':
              result = metadataGenerator.generateDataCatalog();
              break;
            case 'webAPI':
              result = metadataGenerator.generateWebAPI();
              break;
            case 'project':
              result = metadataGenerator.generateProject();
              break;
            default:
              throw new McpError(
                ErrorCode.InvalidRequest,
                `Unknown metadata type: ${metadataType}`
              );
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_search_action': {
        if (typeof toolArgs.query !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'query must be a string'
          );
        }
        const results = Array.isArray(toolArgs.results) ? toolArgs.results : undefined;
        const result = metadataGenerator.generateSearchAction(toolArgs.query, results);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_create_action': {
        if (typeof toolArgs.typeName !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'typeName must be a string'
          );
        }
        const result = metadataGenerator.generateCreateAction(
          toolArgs.typeName,
          toolArgs.result && typeof toolArgs.result === 'object' ? toolArgs.result : undefined
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'run_performance_test': {
        if (typeof toolArgs.url !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'url must be a string'
          );
        }
        if (typeof toolArgs.testType !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'testType must be a string'
          );
        }

        await performanceClient.initializeReportsDirectory();
        
        let result;
        const options = toolArgs.options || {};

        switch (toolArgs.testType) {
          case 'core-web-vitals':
            result = await performanceClient.runCoreWebVitals(toolArgs.url, options);
            break;
          case 'load-test':
            result = await performanceClient.runLoadTest(toolArgs.url, options);
            break;
          case 'stress-test':
            result = await performanceClient.runStressTest(toolArgs.url, options);
            break;
          case 'soak-test':
            result = await performanceClient.runSoakTest(toolArgs.url, options);
            break;
          case 'scalability-test':
            result = await performanceClient.runScalabilityTest(toolArgs.url, options);
            break;
          case 'schema-impact':
            result = await performanceClient.runSchemaImpactTest(toolArgs.url, options);
            break;
          default:
            throw new McpError(
              ErrorCode.InvalidRequest,
              `Unknown test type: ${toolArgs.testType}`
            );
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'run_comprehensive_test_suite': {
        if (typeof toolArgs.url !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'url must be a string'
          );
        }

        const suiteType = toolArgs.suiteType || 'comprehensive';
        await performanceClient.initializeReportsDirectory();
        
        const result = await performanceClient.runComprehensiveTestSuite(
          toolArgs.url, 
          suiteType as any
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'compare_performance_results': {
        if (!toolArgs.beforeResult || typeof toolArgs.beforeResult !== 'object') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'beforeResult must be an object'
          );
        }
        if (!toolArgs.afterResult || typeof toolArgs.afterResult !== 'object') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'afterResult must be an object'
          );
        }

        const result = await performanceClient.comparePerformance(
          toolArgs.beforeResult as any,
          toolArgs.afterResult as any
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_performance_report': {
        if (!toolArgs.testResult || typeof toolArgs.testResult !== 'object') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'testResult must be an object'
          );
        }

        const result = await performanceClient.generatePerformanceReport(
          toolArgs.testResult as any
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'analyze_schema_impact': {
        if (typeof toolArgs.url !== 'string') {
          throw new McpError(
            ErrorCode.InvalidRequest,
            'url must be a string'
          );
        }

        await performanceClient.initializeReportsDirectory();
        const options = toolArgs.options || {};
        
        const result = await performanceClient.runSchemaImpactTest(toolArgs.url, options);

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
