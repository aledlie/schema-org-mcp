import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  PerformanceTest,
  TestResult,
  CoreWebVitalsResult,
  LoadTestResult,
  StressTestResult,
  SoakTestResult,
  ScalabilityTestResult,
  PerformanceComparison,
  SchemaImpactAnalysis,
  PerformanceTestSuite,
  PerformanceReport,
  PerformanceAnalysisAction
} from './performance-types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PerformanceClient {
  private performanceSuitePath: string;
  private reportsPath: string;

  constructor() {
    this.performanceSuitePath = join(__dirname, '..', 'performance-suite');
    this.reportsPath = join(__dirname, '..', 'performance-reports');
  }

  async initializeReportsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.reportsPath, { recursive: true });
    } catch (error) {
      console.error('Error creating reports directory:', error);
    }
  }

  async runCoreWebVitals(url: string, options: any = {}): Promise<CoreWebVitalsResult> {
    const testId = `core-web-vitals-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    const testConfig = {
      url,
      iterations: options.iterations || 5,
      reportPath
    };

    try {
      await this.executeNodeScript('core-web-vitals.js', [
        '--url', url,
        '--iterations', testConfig.iterations.toString(),
        '--output', reportPath
      ]);

      const rawResult = await this.readReportFile(reportPath);
      return this.transformToCoreWebVitalsResult(rawResult, testId);
    } catch (error) {
      throw new Error(`Core Web Vitals test failed: ${error}`);
    }
  }

  async runLoadTest(url: string, options: any = {}): Promise<LoadTestResult> {
    const testId = `load-test-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    try {
      await this.executeNodeScript('load-testing.js', [
        '--url', url,
        '--max-users', (options.maxUsers || 50).toString(),
        '--duration', (options.duration || 300).toString(),
        '--ramp-up', (options.rampUp || 60).toString(),
        '--output', reportPath
      ]);

      const rawResult = await this.readReportFile(reportPath);
      return this.transformToLoadTestResult(rawResult, testId);
    } catch (error) {
      throw new Error(`Load test failed: ${error}`);
    }
  }

  async runStressTest(url: string, options: any = {}): Promise<StressTestResult> {
    const testId = `stress-test-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    try {
      await this.executeNodeScript('stress-testing.js', [
        '--url', url,
        '--initial-users', (options.initialUsers || 10).toString(),
        '--max-users', (options.maxUsers || 200).toString(),
        '--step-size', (options.stepSize || 10).toString(),
        '--output', reportPath
      ]);

      const rawResult = await this.readReportFile(reportPath);
      return this.transformToStressTestResult(rawResult, testId);
    } catch (error) {
      throw new Error(`Stress test failed: ${error}`);
    }
  }

  async runSoakTest(url: string, options: any = {}): Promise<SoakTestResult> {
    const testId = `soak-test-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    try {
      await this.executeNodeScript('soak-testing.js', [
        '--url', url,
        '--users', (options.users || 25).toString(),
        '--duration', (options.duration || 2).toString(),
        '--interval', (options.interval || 2000).toString(),
        '--output', reportPath
      ]);

      const rawResult = await this.readReportFile(reportPath);
      return this.transformToSoakTestResult(rawResult, testId);
    } catch (error) {
      throw new Error(`Soak test failed: ${error}`);
    }
  }

  async runScalabilityTest(url: string, options: any = {}): Promise<ScalabilityTestResult> {
    const testId = `scalability-test-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    try {
      await this.executeNodeScript('scalability-testing.js', [
        '--url', url,
        '--users', options.users || '1,5,10,25,50,100',
        '--duration', (options.duration || 120).toString(),
        '--output', reportPath
      ]);

      const rawResult = await this.readReportFile(reportPath);
      return this.transformToScalabilityTestResult(rawResult, testId);
    } catch (error) {
      throw new Error(`Scalability test failed: ${error}`);
    }
  }

  async runSchemaImpactTest(url: string, options: any = {}): Promise<SchemaImpactAnalysis> {
    const testId = `schema-impact-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    try {
      await this.executeNodeScript('schema-impact-test.js', [
        '--url', url,
        '--output', reportPath
      ]);

      const rawResult = await this.readReportFile(reportPath);
      return this.transformToSchemaImpactAnalysis(rawResult, testId);
    } catch (error) {
      throw new Error(`Schema impact test failed: ${error}`);
    }
  }

  async runComprehensiveTestSuite(url: string, suiteType: 'quick' | 'comprehensive' | 'endurance' = 'comprehensive'): Promise<PerformanceTestSuite> {
    const testId = `test-suite-${Date.now()}`;
    const reportPath = join(this.reportsPath, `${testId}.json`);
    
    const suiteOptions = {
      quick: ['--quick'],
      comprehensive: ['--comprehensive'],
      endurance: ['--endurance']
    };

    try {
      await this.executeNodeScript('master-performance-suite.js', [
        '--url', url,
        '--output-dir', this.reportsPath,
        ...suiteOptions[suiteType]
      ]);

      const rawResult = await this.readReportFile(join(this.reportsPath, 'master-performance-report.json'));
      return this.transformToPerformanceTestSuite(rawResult, testId, suiteType);
    } catch (error) {
      throw new Error(`Test suite failed: ${error}`);
    }
  }

  async comparePerformance(beforeResult: TestResult, afterResult: TestResult): Promise<PerformanceComparison> {
    const comparison: PerformanceComparison = {
      "@context": "https://schema.org",
      "@type": "PerformanceComparison",
      name: `Performance Comparison: ${beforeResult.name} vs ${afterResult.name}`,
      description: "Performance comparison analysis showing before and after metrics",
      dateCreated: new Date().toISOString(),
      beforeTest: beforeResult,
      afterTest: afterResult,
      overallImpact: this.calculateOverallImpact(beforeResult, afterResult),
      impactScore: this.calculateImpactScore(beforeResult, afterResult),
      recommendations: this.generateRecommendations(beforeResult, afterResult)
    };

    // Calculate improvement/regression metrics
    const improvement = this.calculateImprovement(beforeResult, afterResult);
    const regression = this.calculateRegression(beforeResult, afterResult);

    if (improvement) comparison.improvement = improvement;
    if (regression) comparison.regression = regression;

    return comparison;
  }

  async generatePerformanceReport(testResult: TestResult | PerformanceTestSuite): Promise<PerformanceReport> {
    const report: PerformanceReport = {
      "@context": "https://schema.org",
      "@type": "PerformanceReport",
      name: `Performance Report: ${testResult.name}`,
      headline: `Performance Analysis Report`,
      description: `Comprehensive performance analysis for ${testResult.name}`,
      dateCreated: new Date().toISOString(),
      author: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Schema.org MCP Performance Suite",
        version: "1.0.0",
        description: "Performance testing suite for schema.org MCP server",
        applicationCategory: "DeveloperApplication"
      },
      about: testResult as any,
      mainEntity: [testResult] as TestResult[],
      summary: this.generateSummary(testResult),
      recommendations: this.generateRecommendationsFromResult(testResult),
      overallScore: this.calculateOverallScore(testResult),
      grade: this.calculateGrade(testResult)
    };

    return report;
  }

  private async executeNodeScript(scriptName: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = join(this.performanceSuitePath, scriptName);
      const child = spawn('node', [scriptPath, ...args], {
        cwd: this.performanceSuitePath,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Script ${scriptName} failed with code ${code}. stderr: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start script ${scriptName}: ${error.message}`));
      });
    });
  }

  private async readReportFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read report file ${filePath}: ${error}`);
    }
  }

  private transformToCoreWebVitalsResult(rawResult: any, testId: string): CoreWebVitalsResult {
    return {
      "@context": "https://schema.org",
      "@type": "CoreWebVitalsResult",
      name: `Core Web Vitals Test ${testId}`,
      description: "Core Web Vitals performance test results",
      dateCreated: new Date().toISOString(),
      encodingFormat: "application/json",
      text: JSON.stringify(rawResult, null, 2),
      about: {
        "@context": "https://schema.org",
        "@type": "PerformanceTest",
        name: "Core Web Vitals Test",
        description: "Core Web Vitals performance test",
        testUrl: rawResult.testUrl || "unknown",
        testType: "CoreWebVitals",
        startTime: rawResult.timestamp || new Date().toISOString(),
        status: "completed"
      },
      lcp: rawResult.averages?.lcp ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Largest Contentful Paint",
        value: rawResult.averages.lcp,
        unitText: "ms",
        status: this.getWebVitalStatus(rawResult.averages.lcp, [2500, 4000])
      } : undefined,
      fid: rawResult.averages?.fid ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "First Input Delay",
        value: rawResult.averages.fid,
        unitText: "ms",
        status: this.getWebVitalStatus(rawResult.averages.fid, [100, 300])
      } : undefined,
      cls: rawResult.averages?.cls ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Cumulative Layout Shift",
        value: rawResult.averages.cls,
        unitText: "score",
        status: this.getWebVitalStatus(rawResult.averages.cls, [0.1, 0.25])
      } : undefined,
      score: rawResult.overallScore || 0,
      grade: rawResult.grade || "F"
    };
  }

  private transformToLoadTestResult(rawResult: any, testId: string): LoadTestResult {
    return {
      "@context": "https://schema.org",
      "@type": "LoadTestResult",
      name: `Load Test ${testId}`,
      description: "Load testing performance results",
      dateCreated: new Date().toISOString(),
      encodingFormat: "application/json",
      text: JSON.stringify(rawResult, null, 2),
      about: {
        "@context": "https://schema.org",
        "@type": "PerformanceTest",
        name: "Load Test",
        description: "Load testing performance test",
        testUrl: rawResult.testUrl || "unknown",
        testType: "LoadTest",
        startTime: rawResult.timestamp || new Date().toISOString(),
        status: "completed"
      },
      maxUsers: rawResult.configuration?.maxUsers || 0,
      averageResponseTime: rawResult.averages?.responseTime ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Average Response Time",
        value: rawResult.averages.responseTime,
        unitText: "ms"
      } : undefined,
      throughput: rawResult.averages?.throughput ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Throughput",
        value: rawResult.averages.throughput,
        unitText: "requests/sec"
      } : undefined,
      errorRate: rawResult.averages?.errorRate ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Error Rate",
        value: rawResult.averages.errorRate,
        unitText: "percent"
      } : undefined,
      successRate: rawResult.averages?.successRate ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Success Rate",
        value: rawResult.averages.successRate,
        unitText: "percent"
      } : undefined
    };
  }

  private transformToStressTestResult(rawResult: any, testId: string): StressTestResult {
    return {
      "@context": "https://schema.org",
      "@type": "StressTestResult",
      name: `Stress Test ${testId}`,
      description: "Stress testing performance results",
      dateCreated: new Date().toISOString(),
      encodingFormat: "application/json",
      text: JSON.stringify(rawResult, null, 2),
      about: {
        "@context": "https://schema.org",
        "@type": "PerformanceTest",
        name: "Stress Test",
        description: "Stress testing performance test",
        testUrl: rawResult.testUrl || "unknown",
        testType: "StressTest",
        startTime: rawResult.timestamp || new Date().toISOString(),
        status: "completed"
      },
      breakingPoint: rawResult.breakingPoint || 0,
      maxThroughput: rawResult.maxThroughput ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Maximum Throughput",
        value: rawResult.maxThroughput,
        unitText: "requests/sec"
      } : undefined,
      degradationPoint: rawResult.degradationPoint || 0,
      systemLimits: rawResult.systemLimits || {}
    };
  }

  private transformToSoakTestResult(rawResult: any, testId: string): SoakTestResult {
    return {
      "@context": "https://schema.org",
      "@type": "SoakTestResult",
      name: `Soak Test ${testId}`,
      description: "Soak testing performance results",
      dateCreated: new Date().toISOString(),
      encodingFormat: "application/json",
      text: JSON.stringify(rawResult, null, 2),
      about: {
        "@context": "https://schema.org",
        "@type": "PerformanceTest",
        name: "Soak Test",
        description: "Soak testing performance test",
        testUrl: rawResult.testUrl || "unknown",
        testType: "SoakTest",
        startTime: rawResult.timestamp || new Date().toISOString(),
        status: "completed"
      },
      stabilityScore: rawResult.stabilityScore || 0,
      memoryLeaks: rawResult.memoryLeaks || false,
      performanceDegradation: rawResult.performanceDegradation ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Performance Degradation",
        value: rawResult.performanceDegradation,
        unitText: "percent"
      } : undefined,
      uptime: rawResult.uptime ? {
        "@context": "https://schema.org",
        "@type": "PerformanceMetric",
        name: "Uptime",
        value: rawResult.uptime,
        unitText: "percent"
      } : undefined
    };
  }

  private transformToScalabilityTestResult(rawResult: any, testId: string): ScalabilityTestResult {
    return {
      "@context": "https://schema.org",
      "@type": "ScalabilityTestResult",
      name: `Scalability Test ${testId}`,
      description: "Scalability testing performance results",
      dateCreated: new Date().toISOString(),
      encodingFormat: "application/json",
      text: JSON.stringify(rawResult, null, 2),
      about: {
        "@context": "https://schema.org",
        "@type": "PerformanceTest",
        name: "Scalability Test",
        description: "Scalability testing performance test",
        testUrl: rawResult.testUrl || "unknown",
        testType: "ScalabilityTest",
        startTime: rawResult.timestamp || new Date().toISOString(),
        status: "completed"
      },
      scalingEfficiency: rawResult.scalingEfficiency || 0,
      linearityScore: rawResult.linearityScore || 0,
      crossFactorPerformance: rawResult.crossFactorPerformance || {},
      scalingPattern: rawResult.scalingPattern || "unknown"
    };
  }

  private transformToSchemaImpactAnalysis(rawResult: any, testId: string): SchemaImpactAnalysis {
    return {
      "@context": "https://schema.org",
      "@type": "SchemaImpactAnalysis",
      name: `Schema Impact Analysis ${testId}`,
      description: "Schema.org implementation impact analysis",
      dateCreated: new Date().toISOString(),
      websiteUrl: rawResult.websiteUrl || "unknown",
      seoImpact: rawResult.seo ? {
        "@context": "https://schema.org",
        "@type": "SEOImpact",
        name: "SEO Impact Analysis",
        structuredDataScore: rawResult.seo.structuredDataScore,
        richSnippetPotential: rawResult.seo.richSnippetPotential,
        searchRankingImpact: rawResult.seo.searchRankingImpact,
        clickThroughRateImprovement: rawResult.seo.clickThroughRateImprovement,
        localSEOBoost: rawResult.seo.localSEOBoost,
        knowledgeGraphEligibility: rawResult.seo.knowledgeGraphEligibility,
        searchVisibilityScore: rawResult.seo.searchVisibilityScore
      } : undefined,
      llmImpact: rawResult.llm ? {
        "@context": "https://schema.org",
        "@type": "LLMImpact",
        name: "LLM Impact Analysis",
        contentUnderstandability: rawResult.llm.contentUnderstandability,
        entityRecognition: rawResult.llm.entityRecognition,
        contextualRelevance: rawResult.llm.contextualRelevance,
        aiCitationPotential: rawResult.llm.aiCitationPotential,
        semanticClarity: rawResult.llm.semanticClarity,
        llmTrainingValue: rawResult.llm.llmTrainingValue
      } : undefined,
      performanceImpact: rawResult.performance ? {
        "@context": "https://schema.org",
        "@type": "PerformanceImpact",
        name: "Performance Impact Analysis",
        pageLoadImpact: rawResult.performance.pageLoadImpact,
        renderBlockingImpact: rawResult.performance.renderBlockingImpact,
        cacheEfficiency: rawResult.performance.cacheEfficiency,
        bundleSizeImpact: rawResult.performance.bundleSizeImpact,
        networkRequestImpact: rawResult.performance.networkRequestImpact,
        clientSideProcessingImpact: rawResult.performance.clientSideProcessingImpact,
        mobileFriendlinessImpact: rawResult.performance.mobileFriendlinessImpact
      } : undefined,
      businessImpact: rawResult.businessImpact ? {
        "@context": "https://schema.org",
        "@type": "BusinessImpact",
        name: "Business Impact Analysis",
        revenueProjection: rawResult.businessImpact.revenueProjection,
        trafficIncrease: rawResult.businessImpact.trafficIncrease,
        conversionImprovement: rawResult.businessImpact.conversionImprovement,
        brandVisibilityIncrease: rawResult.businessImpact.brandVisibilityIncrease,
        competitiveAdvantage: rawResult.businessImpact.competitiveAdvantage,
        implementationCost: rawResult.businessImpact.implementationCost,
        roi: rawResult.businessImpact.roi
      } : undefined,
      overallScore: rawResult.overallScore || 0,
      grade: rawResult.grade || "F"
    };
  }

  private transformToPerformanceTestSuite(rawResult: any, testId: string, suiteType: string): PerformanceTestSuite {
    return {
      "@context": "https://schema.org",
      "@type": "PerformanceTestSuite",
      name: `Performance Test Suite ${testId}`,
      description: `${suiteType} performance test suite results`,
      dateCreated: new Date().toISOString(),
      testUrl: rawResult.testUrl || "unknown",
      suiteType: suiteType as any,
      tests: rawResult.tests || [],
      overallResult: rawResult.overallResult,
      executionTime: rawResult.executionTime || 0,
      status: "completed"
    };
  }

  private getWebVitalStatus(value: number, thresholds: [number, number]): "good" | "needs-improvement" | "poor" {
    if (value <= thresholds[0]) return "good";
    if (value <= thresholds[1]) return "needs-improvement";
    return "poor";
  }

  private calculateOverallImpact(before: TestResult, after: TestResult): "positive" | "negative" | "neutral" {
    // Simplified impact calculation - could be more sophisticated
    const beforeScore = this.extractNumericScore(before);
    const afterScore = this.extractNumericScore(after);
    
    if (afterScore > beforeScore + 5) return "positive";
    if (afterScore < beforeScore - 5) return "negative";
    return "neutral";
  }

  private calculateImpactScore(before: TestResult, after: TestResult): number {
    const beforeScore = this.extractNumericScore(before);
    const afterScore = this.extractNumericScore(after);
    
    return ((afterScore - beforeScore) / beforeScore) * 100;
  }

  private calculateImprovement(before: TestResult, after: TestResult): any {
    // Implementation would analyze specific metrics that improved
    return undefined;
  }

  private calculateRegression(before: TestResult, after: TestResult): any {
    // Implementation would analyze specific metrics that regressed
    return undefined;
  }

  private generateRecommendations(before: TestResult, after: TestResult): string[] {
    // Implementation would generate specific recommendations based on comparison
    return [
      "Continue monitoring performance trends",
      "Consider additional optimizations based on results"
    ];
  }

  private generateSummary(result: TestResult | PerformanceTestSuite): string {
    return `Performance analysis completed with overall assessment`;
  }

  private generateRecommendationsFromResult(result: TestResult | PerformanceTestSuite): string[] {
    return [
      "Review performance metrics",
      "Consider optimization strategies",
      "Monitor ongoing performance"
    ];
  }

  private calculateOverallScore(result: TestResult | PerformanceTestSuite): number {
    return this.extractNumericScore(result) || 0;
  }

  private calculateGrade(result: TestResult | PerformanceTestSuite): string {
    const score = this.calculateOverallScore(result);
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "A-";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "B-";
    if (score >= 65) return "C+";
    if (score >= 60) return "C";
    if (score >= 55) return "C-";
    if (score >= 50) return "D";
    return "F";
  }

  private extractNumericScore(result: any): number {
    if (typeof result.value === 'number') return result.value;
    if (typeof result.score === 'number') return result.score;
    if (typeof result.overallScore === 'number') return result.overallScore;
    return 0;
  }
}