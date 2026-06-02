import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { CityContextService } from '../../common/city-context.service';

export interface NewsItem {
  filename: string;
  title: string;
  date: string;
  html: string;
}

interface CityCache {
  items: NewsItem[];
  lastLoaded: number;
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly TTL_MS = 30 * 60 * 1000;
  private readonly cache = new Map<string, CityCache>();

  constructor(
    private configService: ConfigService,
    private cityContext: CityContextService,
  ) {}

  private getNewsPath(city: string): string {
    if (city === 'spb') {
      return (
        this.configService.get<string>('NEWS_PATH_SPB') ||
        '/var/images/autoparts/news/spb'
      );
    }
    return (
      this.configService.get<string>('NEWS_PATH_EKB') ||
      this.configService.get<string>('NEWS_PATH') ||
      '/var/images/autoparts/news/ekb'
    );
  }

  async getAll(): Promise<NewsItem[]> {
    const city = this.cityContext.getCity();
    const now = Date.now();
    const cached = this.cache.get(city);
    if (cached && cached.items.length > 0 && now - cached.lastLoaded < this.TTL_MS) {
      return cached.items;
    }
    await this.reload(city);
    return this.cache.get(city)?.items ?? [];
  }

  async reload(city?: string): Promise<void> {
    const c = city ?? this.cityContext.getCity();
    const newsPath = this.getNewsPath(c);

    if (!fs.existsSync(newsPath)) {
      this.logger.warn(`News folder not found: ${newsPath}`);
      this.cache.set(c, { items: [], lastLoaded: Date.now() });
      return;
    }

    try {
      const files = fs.readdirSync(newsPath)
        .filter(f => f.endsWith('.html'))
        .sort()
        .reverse();

      const items: NewsItem[] = [];

      for (const filename of files) {
        try {
          const filePath = path.join(newsPath, filename);
          const html = fs.readFileSync(filePath, 'utf8');
          const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.html$/);
          const date = match ? match[1] : '';
          const titleSlug = match ? match[2].replace(/-/g, ' ') : filename;
          items.push({ filename, date, title: titleSlug, html });
        } catch {
          this.logger.warn(`Failed to read news file: ${filename}`);
        }
      }

      this.cache.set(c, { items, lastLoaded: Date.now() });
      this.logger.log(`✅ News [${c}] cache loaded: ${items.length} articles from ${newsPath}`);
    } catch (err) {
      this.logger.error(`Failed to load news [${c}]`, err);
      this.cache.set(c, { items: [], lastLoaded: Date.now() });
    }
  }
}
