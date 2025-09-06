/**
 * Schema.org types for performance testing and analysis
 */

import { 
  Thing, 
  CreativeWork, 
  SoftwareApplication,
  Action 
} from './schema-types.js';

export interface PerformanceTest extends Thing {
  "@context": "https://schema.org";
  "@type": "PerformanceTest";
  name: string;
  description: string;
  testUrl: string;
  testType: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  status: "pending" | "running" | "completed" | "failed";
  result?: TestResult;
  configuration?: TestConfiguration;
}

export interface TestResult {
  "@context": "https://schema.org";
  "@type": string;
  name: string;
  description: string;
  dateCreated: string;
  encodingFormat: "application/json";
  text: string;
  about: PerformanceTest;
  measurementTechnique?: string;
  value?: number;
  unitText?: string;
  minValue?: number;
  maxValue?: number;
}

export interface CoreWebVitalsResult extends TestResult {
  "@type": "CoreWebVitalsResult";
  lcp?: PerformanceMetric;
  fid?: PerformanceMetric;
  cls?: PerformanceMetric;
  score?: number;
  grade?: string;
}

export interface LoadTestResult extends TestResult {
  "@type": "LoadTestResult";
  maxUsers: number;
  averageResponseTime?: PerformanceMetric;
  throughput?: PerformanceMetric;
  errorRate?: PerformanceMetric;
  successRate?: PerformanceMetric;
}

export interface StressTestResult extends TestResult {
  "@type": "StressTestResult";
  breakingPoint?: number;
  maxThroughput?: PerformanceMetric;
  degradationPoint?: number;
  systemLimits?: any;
}

export interface SoakTestResult extends TestResult {
  "@type": "SoakTestResult";
  stabilityScore?: number;
  memoryLeaks?: boolean;
  performanceDegradation?: PerformanceMetric;
  uptime?: PerformanceMetric;
}

export interface ScalabilityTestResult extends TestResult {
  "@type": "ScalabilityTestResult";
  scalingEfficiency?: number;
  linearityScore?: number;
  crossFactorPerformance?: any;
  scalingPattern?: string;
}

export interface PerformanceMetric extends Thing {
  "@context": "https://schema.org";
  "@type": "PerformanceMetric";
  name: string;
  value: number;
  unitText: string;
  minValue?: number;
  maxValue?: number;
  avgValue?: number;
  p95Value?: number;
  p99Value?: number;
  threshold?: number;
  status?: "good" | "needs-improvement" | "poor";
}

export interface TestConfiguration extends Thing {
  "@context": "https://schema.org";
  "@type": "TestConfiguration";
  name: string;
  description: string;
  testType: string;
  parameters: Record<string, any>;
  environment?: TestEnvironment;
}

export interface TestEnvironment extends Thing {
  "@context": "https://schema.org";
  "@type": "TestEnvironment";
  name: string;
  operatingSystem?: string;
  browserVersion?: string;
  networkConditions?: string;
  deviceType?: string;
  viewportSize?: string;
}

export interface PerformanceComparison {
  "@context": "https://schema.org";
  "@type": "PerformanceComparison";
  name: string;
  description: string;
  dateCreated: string;
  beforeTest: TestResult;
  afterTest: TestResult;
  improvement?: PerformanceMetric;
  regression?: PerformanceMetric;
  overallImpact: "positive" | "negative" | "neutral";
  impactScore?: number;
  recommendations?: string[];
}

export interface SchemaImpactAnalysis {
  "@context": "https://schema.org";
  "@type": "SchemaImpactAnalysis";
  name: string;
  description: string;
  dateCreated: string;
  websiteUrl: string;
  seoImpact?: SEOImpact;
  llmImpact?: LLMImpact;
  performanceImpact?: PerformanceImpact;
  businessImpact?: BusinessImpact;
  overallScore?: number;
  grade?: string;
}

export interface SEOImpact extends Thing {
  "@context": "https://schema.org";
  "@type": "SEOImpact";
  structuredDataScore?: number;
  richSnippetPotential?: number;
  searchRankingImpact?: number;
  clickThroughRateImprovement?: number;
  localSEOBoost?: number;
  knowledgeGraphEligibility?: number;
  searchVisibilityScore?: number;
}

export interface LLMImpact extends Thing {
  "@context": "https://schema.org";
  "@type": "LLMImpact";
  contentUnderstandability?: number;
  entityRecognition?: number;
  contextualRelevance?: number;
  aiCitationPotential?: number;
  semanticClarity?: number;
  llmTrainingValue?: number;
}

export interface PerformanceImpact extends Thing {
  "@context": "https://schema.org";
  "@type": "PerformanceImpact";
  pageLoadImpact?: number;
  renderBlockingImpact?: number;
  cacheEfficiency?: number;
  bundleSizeImpact?: number;
  networkRequestImpact?: number;
  clientSideProcessingImpact?: number;
  mobileFriendlinessImpact?: number;
}

export interface BusinessImpact extends Thing {
  "@context": "https://schema.org";
  "@type": "BusinessImpact";
  revenueProjection?: number;
  trafficIncrease?: number;
  conversionImprovement?: number;
  brandVisibilityIncrease?: number;
  competitiveAdvantage?: number;
  implementationCost?: number;
  roi?: number;
}

export interface PerformanceTestSuite {
  "@context": "https://schema.org";
  "@type": "PerformanceTestSuite";
  name: string;
  description: string;
  dateCreated: string;
  testUrl: string;
  suiteType: "quick" | "comprehensive" | "endurance";
  tests: PerformanceTest[];
  overallResult?: TestResult;
  executionTime?: number;
  status: "pending" | "running" | "completed" | "failed";
}

export interface PerformanceReport {
  "@context": "https://schema.org";
  "@type": "PerformanceReport";
  name: string;
  headline: string;
  description: string;
  dateCreated: string;
  author: SoftwareApplication;
  about: PerformanceTest | PerformanceTestSuite;
  mainEntity: TestResult[];
  summary?: string;
  recommendations?: string[];
  overallScore?: number;
  grade?: string;
}

export interface PerformanceAnalysisAction extends Action {
  "@context": "https://schema.org";
  "@type": "PerformanceAnalysisAction";
  name: string;
  description: string;
  object: {
    "@type": "WebSite";
    url: string;
  };
  result?: PerformanceReport;
  instrument: SoftwareApplication;
  actionStatus: "PotentialActionStatus" | "ActiveActionStatus" | "CompletedActionStatus" | "FailedActionStatus";
  startTime?: string;
  endTime?: string;
}