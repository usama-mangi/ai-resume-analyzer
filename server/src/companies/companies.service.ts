import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { Prisma } from '@prisma/client';

export interface CompanyResearchResult {
  companyName: string;
  overview: {
    description: string;
    website: string;
    headquarters: string;
    founded: number;
    employeeCount: string;
    industry: string;
    type: string; // public, private, nonprofit, etc.
  };
  ratings: {
    glassdoor?: { overall: number; culture: number; workLifeBalance: number; compBenefits: number; careerOpportunities: number; recommendToFriend: number; ceoApproval: number };
    indeed?: { overall: number; workLifeBalance: number; compensation: number; jobSecurity: number; management: number; culture: number };
    comparable?: { overall: number; engineering: number; product: number; design: number; sales: number; marketing: number };
  };
  financials: {
    revenue?: string;
    valuation?: string;
    fundingRounds?: { date: string; round: string; amount: string; investors: string[] }[];
    stockSymbol?: string;
    stockPrice?: number;
    marketCap?: string;
  };
  culture: {
    values: string[];
    perks: string[];
    diversityStats?: { gender: Record<string, number>; ethnicity: Record<string, number> };
    workModel: string; // remote, hybrid, onsite
    notablePolicies: string[];
  };
  interviewInsights: {
    difficulty: number; // 1-5
    processLength: string; // e.g., "2-4 weeks"
    commonQuestions: string[];
    topics: string[];
    tips: string[];
  };
  news: { title: string; source: string; date: string; url: string; sentiment: 'positive' | 'neutral' | 'negative' }[];
  competitors: { name: string; similarity: number; reason: string }[];
  lastUpdated: string;
}

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  private readonly cacheTtl = 86400; // 24 hours

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private redis: RedisService,
  ) {}

  async getCompanyResearch(companyName: string, userId: string): Promise<CompanyResearchResult> {
    const cacheKey = `company:research:${companyName.toLowerCase().replace(/\s+/g, '_')}`;

    // Try cache first
    const cached = await this.redis.get<CompanyResearchResult>(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for company research: ${companyName}`);
      return cached;
    }

    // Check database
    const existing = await this.prisma.companyResearch.findUnique({
      where: { companyName_normalized: companyName.toLowerCase() },
    });

    if (existing && existing.lastUpdated > new Date(Date.now() - this.cacheTtl * 1000)) {
      const result = existing.data as unknown as CompanyResearchResult;
      await this.redis.set(cacheKey, result, this.cacheTtl);
      return result;
    }

    // Fetch fresh data
    this.logger.log(`Fetching fresh company research for: ${companyName}`);
    const result = await this.fetchCompanyResearch(companyName);

    // Save to database
            await this.prisma.companyResearch.upsert({
              where: { companyName_normalized: companyName.toLowerCase() },
              create: {
                companyName,
                companyName_normalized: companyName.toLowerCase(),
                data: result as any,
              },
              update: {
                data: result as any,
                lastUpdated: new Date(),
              },
            });

    // Cache
    await this.redis.set(cacheKey, result, this.cacheTtl);

    return result;
  }

  private async fetchCompanyResearch(companyName: string): Promise<CompanyResearchResult> {
    // In production, integrate with:
    // - Glassdoor API (partner)
    // - Indeed API (partner)
    // - Crunchbase API
    // - LinkedIn API
    // - Yahoo Finance / Alpha Vantage for financials
    // - News API for recent news
    // - SEC EDGAR for public company filings

    // For now, return structured mock data based on known companies
    return this.generateMockResearch(companyName);
  }

  private generateMockResearch(companyName: string): CompanyResearchResult {
    const knownCompanies: Record<string, Partial<CompanyResearchResult>> = {
      'google': {
        overview: { description: 'Google is a multinational technology company...', website: 'https://google.com', headquarters: 'Mountain View, CA', founded: 1998, employeeCount: '150,000+', industry: 'Technology', type: 'Public (GOOGL)' },
        ratings: { glassdoor: { overall: 4.4, culture: 4.3, workLifeBalance: 4.1, compBenefits: 4.5, careerOpportunities: 4.2, recommendToFriend: 0.92, ceoApproval: 0.95 } },
        financials: { revenue: '$280B+', stockSymbol: 'GOOGL', stockPrice: 140, marketCap: '$1.8T' },
        culture: { values: ['Focus on the user', 'Fast is better than slow'], perks: ['Free meals', 'On-site wellness', '20% time'], workModel: 'Hybrid (3 days office)', notablePolicies: ['20% time', 'Peer reviews', 'Internal mobility'] },
        interviewInsights: { difficulty: 4, processLength: '4-8 weeks', commonQuestions: ['Design a distributed system', 'Explain MapReduce'], topics: ['System Design', 'Algorithms', 'Googlyness'], tips: ['Practice system design', 'Know Google products'] },
        competitors: [{ name: 'Microsoft', similarity: 0.85, reason: 'Cloud, AI, Enterprise' }, { name: 'Amazon', similarity: 0.75, reason: 'Cloud, AI' }],
      },
      'microsoft': {
        overview: { description: 'Microsoft Corporation develops software...', website: 'https://microsoft.com', headquarters: 'Redmond, WA', founded: 1975, employeeCount: '220,000+', industry: 'Technology', type: 'Public (MSFT)' },
        ratings: { glassdoor: { overall: 4.3, culture: 4.2, workLifeBalance: 4.2, compBenefits: 4.4, careerOpportunities: 4.1, recommendToFriend: 0.90, ceoApproval: 0.96 } },
        financials: { revenue: '$210B+', stockSymbol: 'MSFT', stockPrice: 340, marketCap: '$2.5T' },
        culture: { values: ['Empower every person', 'Growth mindset'], perks: ['Flexible work', 'Learning budget', 'Parental leave'], workModel: 'Hybrid (3 days office)', notablePolicies: ['Growth mindset culture', 'Annual hackathon', 'Internal mobility'] },
        interviewInsights: { difficulty: 3.5, processLength: '3-6 weeks', commonQuestions: ['Design a cache system', 'Behavioral: Tell me about a failure'], topics: ['System Design', 'Coding', 'Behavioral'], tips: ['Know Azure services', 'Practice STAR stories'] },
        competitors: [{ name: 'Google', similarity: 0.85, reason: 'Cloud, AI' }, { name: 'Amazon', similarity: 0.8, reason: 'Cloud, Enterprise' }],
      },
    };

    const known = knownCompanies[companyName.toLowerCase()] || {};

    return {
      companyName,
      overview: known.overview || { description: `${companyName} is a technology company.`, website: '', headquarters: '', founded: 0, employeeCount: '', industry: 'Technology', type: 'Private' },
      ratings: known.ratings || {},
      financials: known.financials || {},
      culture: known.culture || { values: [], perks: [], workModel: 'Hybrid', notablePolicies: [] },
      interviewInsights: known.interviewInsights || { difficulty: 3, processLength: '2-4 weeks', commonQuestions: [], topics: [], tips: [] },
      news: [],
      competitors: known.competitors || [],
      lastUpdated: new Date().toISOString(),
    };
  }

  async getCompanyResearchList(userId: string, filters: { search?: string; industry?: string } = {}) {
    const where: Record<string, unknown> = {};
    if (filters.search) {
      where.companyName = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters.industry) {
      where.data = { path: ['overview', 'industry'], string_contains: filters.industry };
    }

    return this.prisma.companyResearch.findMany({
      where,
      orderBy: { lastUpdated: 'desc' },
      take: 50,
      select: { companyName: true, data: true, lastUpdated: true },
    });
  }

  async invalidateCache(companyName: string): Promise<void> {
    const cacheKey = `company:research:${companyName.toLowerCase().replace(/\s+/g, '_')}`;
    await this.redis.del(cacheKey);
    await this.prisma.companyResearch.delete({ where: { companyName_normalized: companyName.toLowerCase() } }).catch(() => {});
  }
}
