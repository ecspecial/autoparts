import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossReference } from '../entities/cross-reference.entity';
import * as fs from 'fs';
import csvParser from 'csv-parser';
import * as path from 'path';

@Injectable()
export class CrossCsvImportService {
  private readonly logger = new Logger(CrossCsvImportService.name);
  private readonly csvPath = process.env.CROSS_CSV_PATH || '/var/images/autoparts/cross-reference/cross_site.csv';

  constructor(
    @InjectRepository(CrossReference)
    private crossReferenceRepository: Repository<CrossReference>,
  ) {}

  async importFromCsv(): Promise<{ imported: number; errors: number }> {
    this.logger.log(`Starting cross-reference import from ${this.csvPath}`);

    if (!fs.existsSync(this.csvPath)) {
      throw new Error(`CSV file not found: ${this.csvPath}`);
    }

    const records: Array<{ article: string; oem: string }> = [];
    let errors = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.csvPath)
        .pipe(csvParser({ separator: ';', headers: ['article', 'oem'] }))
        .on('data', (row) => {
          try {
            if (row.article && row.oem && row.article !== 'art') {
              const article = row.article.replace(/^\uFEFF/, '').trim();
              const oem = row.oem.replace(/^\uFEFF/, '').trim();
              
              if (article && oem) {
                records.push({ article, oem });
              }
            }
          } catch (error) {
            this.logger.warn(`Error parsing row:`, error);
            errors++;
          }
        })
        .on('end', async () => {
          try {
            this.logger.log(`Parsed ${records.length} records from CSV`);
            await this.crossReferenceRepository.clear();
            this.logger.log('Cleared existing cross-reference data');

            const batchSize = 1000;
            for (let i = 0; i < records.length; i += batchSize) {
              const batch = records.slice(i, i + batchSize);
              await this.crossReferenceRepository.insert(batch);
            }

            this.logger.log(`✅ Successfully imported ${records.length} cross-reference records`);
            resolve({ imported: records.length, errors });
          } catch (error) {
            this.logger.error('Failed to save cross-reference data', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          this.logger.error('Error reading CSV file', error);
          reject(error);
        });
    });
  }

  // Нормализация: убирает все кроме букв и цифр, переводит в верхний регистр
  normalizeArticle(input: string): string {
    return input
      .toUpperCase()
      .replace(/[^A-ZА-Я0-9]/g, '');
  }

  // ИСПРАВЛЕННЫЙ метод поиска по OEM
  async findArticlesByOem(oemInput: string): Promise<string[]> {
    const normalizedInput = this.normalizeArticle(oemInput);
    
    this.logger.log(`Searching OEM: "${oemInput}" → normalized: "${normalizedInput}"`);
    
    // Получаем все записи и фильтруем в памяти
    // Это работает быстро если записей не миллионы
    const allRecords = await this.crossReferenceRepository.find();
    
    const matchedArticles = allRecords
      .filter(record => this.normalizeArticle(record.oem) === normalizedInput)
      .map(record => record.article);
    
    // Убираем дубликаты
    const uniqueArticles = [...new Set(matchedArticles)];
    
    this.logger.log(`Found ${uniqueArticles.length} article(s): ${uniqueArticles.join(', ')}`);
    
    return uniqueArticles;
  }
}