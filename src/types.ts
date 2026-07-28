export interface GlossaryItem {
  id: string;
  term: string;
  term_en: string;
  term_ar: string;
  term_de?: string;
  definition_id: string;
  definition_en: string;
  definition_ar: string;
  definition_de?: string;
  category: string;
  pronunciation_ar?: string;
  context_id?: string;
  context_en?: string;
  context_ar?: string;
  context_de?: string;
  keywords: string[];
  schema_json_ld?: string;
  createdAt: string;
  sourceUrl: string;
}

export interface CrawledPage {
  url: string;
  title: string;
  description: string;
  bodySnippet: string;
  language: string;
  crawledAt: string;
  wordCount: number;
  status: number;
  seoScore: number;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  linksFound: string[];
}

export interface SearchLog {
  id: string;
  query: string;
  timestamp: string;
  languageDetected: string;
  resultsCount: number;
  aiExplanation?: string;
}

export interface CrawlerSettings {
  seedUrls: string[];
  maxDepth: number;
  delayMs: number;
  userAgent: string;
  respectRobots: boolean;
}

export interface SeoConfig {
  robotsTxt: string;
  sitemapActive: boolean;
}

export interface Web3Config {
  googleSheetUrl: string;
  piAppId: string;
  stellarNetwork: 'testnet' | 'public';
  xenMintTerm: number;
}

export interface SystemStats {
  totalPagesCrawled: number;
  totalIndexedTerms: number;
  languagesIndexed: { id: number; en: number; ar: number };
  searchQueriesLogged: number;
  logs?: SearchLog[];
  categoryDistribution: Record<string, number>;
  crawlerSettings: CrawlerSettings;
  seoConfig: SeoConfig;
  glossary: GlossaryItem[];
  web3Config?: Web3Config;
}
