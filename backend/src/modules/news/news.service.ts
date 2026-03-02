import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export interface NewsItem {
  filename: string;
  title: string;       // derived from filename
  date: string;        // derived from filename
  html: string;        // raw HTML content
}

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private cache: NewsItem[] = [];
  private lastLoaded: number = 0;
  private readonly TTL_MS = 30 * 60 * 1000; // 30 minutes

  constructor(private configService: ConfigService) {}

  async getAll(): Promise<NewsItem[]> {
    const now = Date.now();
    if (this.cache.length === 0 || now - this.lastLoaded > this.TTL_MS) {
      await this.reload();
    }
    return this.cache;
  }

  async reload(): Promise<void> {
    const newsPath = this.configService.get<string>('NEWS_PATH')
      || '/var/images/autoparts/news';

    if (!fs.existsSync(newsPath)) {
      this.logger.warn(`News folder not found: ${newsPath}`);
      this.cache = [];
      return;
    }

    try {
      const files = fs.readdirSync(newsPath)
        .filter(f => f.endsWith('.html'))
        .sort()
        .reverse(); // newest first

      const items: NewsItem[] = [];

      for (const filename of files) {
        try {
          const filePath = path.join(newsPath, filename);
          const html = fs.readFileSync(filePath, 'utf8');

          // Extract date and title from filename: 2026-02-18-price-update.html
          const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.html$/);
          const date = match ? match[1] : '';
          const titleSlug = match ? match[2].replace(/-/g, ' ') : filename;

          items.push({ filename, date, title: titleSlug, html });
        } catch (err) {
          this.logger.warn(`Failed to read news file: ${filename}`);
        }
      }

      this.cache = items;
      this.lastLoaded = Date.now();
      this.logger.log(`✅ News cache loaded: ${items.length} articles`);
    } catch (err) {
      this.logger.error('Failed to load news', err);
      this.cache = [];
    }
  }
}