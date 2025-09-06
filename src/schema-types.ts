/**
 * Schema.org type definitions for the MCP server
 */

export interface SoftwareApplication {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  version: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  programmingLanguage?: string;
  runtimePlatform?: string;
  codeRepository?: string;
  license?: string;
  author?: Person | Organization;
  maintainer?: Person | Organization;
  potentialAction?: Action[];
}

export interface SoftwareSourceCode {
  "@context": "https://schema.org";
  "@type": "SoftwareSourceCode";
  name: string;
  description: string;
  codeRepository: string;
  programmingLanguage: string;
  runtimePlatform: string;
  targetProduct: SoftwareApplication;
  license?: string;
  author?: Person | Organization;
  dateCreated?: string;
  dateModified?: string;
}

export interface APIReference {
  "@context": "https://schema.org";
  "@type": "APIReference";
  name: string;
  description: string;
  programmingModel: string;
  executableLibraryName?: string;
  operatingSystem?: string;
  programmingLanguage?: string;
  url?: string;
}

export interface Dataset {
  "@context": "https://schema.org";
  "@type": "Dataset";
  name: string;
  description: string;
  distribution?: DataDownload[];
  keywords?: string[];
  license?: string;
  creator?: Person | Organization;
  dateCreated?: string;
  dateModified?: string;
  url?: string;
}

export interface DataCatalog {
  "@context": "https://schema.org";
  "@type": "DataCatalog";
  name: string;
  description: string;
  dataset: Dataset[];
  publisher?: Organization;
  url?: string;
}

export interface TechArticle {
  "@context": "https://schema.org";
  "@type": "TechArticle";
  headline: string;
  text: string;
  codeRepository?: string;
  programmingLanguage?: string;
  author?: Person | Organization;
  datePublished?: string;
  dateModified?: string;
}

export interface SearchAction {
  "@context": "https://schema.org";
  "@type": "SearchAction";
  query: string;
  result?: SearchResultsPage;
  target: EntryPoint;
  actionStatus?: string;
  agent?: SoftwareApplication;
}

export interface CreateAction {
  "@context": "https://schema.org";
  "@type": "CreateAction";
  result: CreativeWork;
  object?: Thing;
  instrument?: SoftwareApplication;
  actionStatus?: string;
  agent?: SoftwareApplication;
}

export interface WebAPI {
  "@context": "https://schema.org";
  "@type": "WebAPI";
  name: string;
  description: string;
  documentation?: string | TechArticle;
  potentialAction?: Action[];
  provider?: Organization | SoftwareApplication;
  serviceType?: string;
}

export interface Project {
  "@context": "https://schema.org";
  "@type": "Project";
  name: string;
  description: string;
  member?: Person[];
  parentOrganization?: Organization;
  startDate?: string;
  url?: string;
  result?: SoftwareApplication;
}

// Supporting types
export interface Person {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  email?: string;
  url?: string;
}

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url?: string;
  email?: string;
}

export interface DataDownload {
  "@context": "https://schema.org";
  "@type": "DataDownload";
  name: string;
  contentUrl: string;
  encodingFormat: string;
}

export interface SearchResultsPage {
  "@context": "https://schema.org";
  "@type": "SearchResultsPage";
  mainEntity: Thing[];
  numberOfItems?: number;
}

export interface EntryPoint {
  "@context": "https://schema.org";
  "@type": "EntryPoint";
  name: string;
  url?: string;
  actionPlatform?: string[];
}

export interface CreativeWork {
  "@context": "https://schema.org";
  "@type": "CreativeWork";
  name: string;
  description?: string;
  text?: string;
  encodingFormat?: string;
}

export interface Thing {
  "@context": "https://schema.org";
  "@type": string;
  name: string;
  description?: string;
  url?: string;
}

export interface Action {
  "@context": "https://schema.org";
  "@type": string;
  name: string;
  description?: string;
  target?: EntryPoint;
}