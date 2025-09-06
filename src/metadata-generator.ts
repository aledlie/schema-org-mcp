import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  SoftwareApplication,
  SoftwareSourceCode,
  APIReference,
  Dataset,
  DataCatalog,
  WebAPI,
  Project,
  SearchAction,
  CreateAction,
  Person,
  Organization
} from './schema-types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MetadataGenerator {
  private packageJson: any;

  constructor() {
    try {
      const packagePath = join(__dirname, '..', 'package.json');
      this.packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    } catch (error) {
      console.error('Error reading package.json:', error);
      this.packageJson = {};
    }
  }

  generateSoftwareApplication(): SoftwareApplication {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: this.packageJson.name || "schema-org-mcp",
      version: this.packageJson.version || "0.1.0",
      description: this.packageJson.description || "MCP server for schema.org vocabulary",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform",
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js",
      codeRepository: "https://github.com/yourusername/schema-org-mcp",
      license: this.packageJson.license || "MIT",
      author: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Developer"
      },
      potentialAction: [
        {
          "@context": "https://schema.org",
          "@type": "SearchAction",
          name: "search_schemas",
          description: "Search for schema.org types by keyword",
          target: {
            "@context": "https://schema.org",
            "@type": "EntryPoint",
            name: "Schema Search API",
            actionPlatform: ["MCP"]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "CreateAction", 
          name: "generate_example",
          description: "Generate example JSON-LD for schema types",
          target: {
            "@context": "https://schema.org",
            "@type": "EntryPoint",
            name: "Example Generation API",
            actionPlatform: ["MCP"]
          }
        }
      ]
    };
  }

  generateSoftwareSourceCode(): SoftwareSourceCode {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: "Schema.org MCP Server Source",
      description: "Source code for the Model Context Protocol server providing schema.org vocabulary access",
      codeRepository: "https://github.com/yourusername/schema-org-mcp",
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js",
      targetProduct: this.generateSoftwareApplication(),
      license: this.packageJson.license || "MIT",
      author: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Developer"
      },
      dateCreated: new Date().toISOString().split('T')[0]
    };
  }

  generateAPIReference(): APIReference {
    return {
      "@context": "https://schema.org",
      "@type": "APIReference",
      name: "Schema.org MCP API",
      description: "Model Context Protocol API for accessing schema.org vocabulary",
      programmingModel: "Model Context Protocol",
      executableLibraryName: "@modelcontextprotocol/sdk",
      operatingSystem: "Cross-platform",
      programmingLanguage: "TypeScript",
      url: "https://github.com/yourusername/schema-org-mcp#readme"
    };
  }

  generateDataset(): Dataset {
    return {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Schema.org Vocabulary",
      description: "Complete schema.org vocabulary in JSON-LD format",
      keywords: ["schema.org", "structured-data", "json-ld", "vocabulary", "semantic-web"],
      license: "CC BY-SA 3.0",
      creator: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Schema.org Community",
        url: "https://schema.org"
      },
      url: "https://schema.org/version/latest/schemaorg-current-https.jsonld",
      distribution: [
        {
          "@context": "https://schema.org",
          "@type": "DataDownload",
          name: "Schema.org JSON-LD",
          contentUrl: "https://schema.org/version/latest/schemaorg-current-https.jsonld",
          encodingFormat: "application/ld+json"
        }
      ]
    };
  }

  generateDataCatalog(): DataCatalog {
    return {
      "@context": "https://schema.org",
      "@type": "DataCatalog",
      name: "Schema.org Data Catalog",
      description: "Catalog of schema.org vocabulary data accessed by the MCP server",
      dataset: [this.generateDataset()],
      publisher: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Schema.org Community",
        url: "https://schema.org"
      }
    };
  }

  generateWebAPI(): WebAPI {
    return {
      "@context": "https://schema.org",
      "@type": "WebAPI",
      name: "Schema.org MCP API",
      description: "Model Context Protocol API for schema.org vocabulary access",
      documentation: "https://github.com/yourusername/schema-org-mcp#readme",
      serviceType: "Model Context Protocol",
      provider: this.generateSoftwareApplication(),
      potentialAction: [
        {
          "@context": "https://schema.org",
          "@type": "SearchAction",
          name: "search_schemas",
          description: "Search schema.org types by keyword"
        },
        {
          "@context": "https://schema.org", 
          "@type": "ViewAction",
          name: "get_schema_type",
          description: "Get detailed schema.org type information"
        },
        {
          "@context": "https://schema.org",
          "@type": "CreateAction",
          name: "generate_example", 
          description: "Generate JSON-LD examples"
        }
      ]
    };
  }

  generateProject(): Project {
    return {
      "@context": "https://schema.org",
      "@type": "Project",
      name: "Schema.org MCP Server",
      description: "A Model Context Protocol server providing access to the complete schema.org vocabulary",
      startDate: new Date().toISOString().split('T')[0],
      url: "https://github.com/yourusername/schema-org-mcp",
      result: this.generateSoftwareApplication()
    };
  }

  generateSearchAction(query: string, results?: any[]): SearchAction {
    return {
      "@context": "https://schema.org",
      "@type": "SearchAction",
      query,
      target: {
        "@context": "https://schema.org",
        "@type": "EntryPoint",
        name: "Schema.org Search",
        actionPlatform: ["MCP"]
      },
      agent: this.generateSoftwareApplication(),
      actionStatus: results ? "CompletedActionStatus" : "PotentialActionStatus",
      result: results ? {
        "@context": "https://schema.org",
        "@type": "SearchResultsPage",
        mainEntity: results.map(result => ({
          "@context": "https://schema.org",
          "@type": "Thing",
          name: result.name || result.label,
          description: result.description || result.comment,
          url: result.url
        })),
        numberOfItems: results.length
      } : undefined
    };
  }

  generateCreateAction(typeName: string, result?: any): CreateAction {
    return {
      "@context": "https://schema.org",
      "@type": "CreateAction",
      object: {
        "@context": "https://schema.org",
        "@type": "Thing",
        name: typeName,
        description: `Schema.org ${typeName} type`
      },
      result: result ? {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: `${typeName} JSON-LD Example`,
        description: `Generated JSON-LD example for ${typeName}`,
        text: JSON.stringify(result, null, 2),
        encodingFormat: "application/ld+json"
      } : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: `${typeName} JSON-LD Example`,
        description: `JSON-LD example for ${typeName}`
      },
      instrument: this.generateSoftwareApplication(),
      actionStatus: result ? "CompletedActionStatus" : "PotentialActionStatus"
    };
  }

  generateAllMetadata() {
    return {
      softwareApplication: this.generateSoftwareApplication(),
      sourceCode: this.generateSoftwareSourceCode(),
      apiReference: this.generateAPIReference(),
      dataset: this.generateDataset(),
      dataCatalog: this.generateDataCatalog(),
      webAPI: this.generateWebAPI(),
      project: this.generateProject()
    };
  }
}