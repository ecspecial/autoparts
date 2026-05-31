import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import csv from 'csv-parser';
import { Product } from '../entities/product.entity';

@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService,
  ) {}

  /** Import CSV for a specific city. Env keys: CSV_PATH_EKB, CSV_PATH_SPB.
   *  Falls back to legacy CSV_PATH when city='ekb' and CSV_PATH_EKB is absent. */
  async importFromCsvForCity(city: string): Promise<number> {
    const envKey = `CSV_PATH_${city.toUpperCase()}`;
    let csvPath = this.configService.get<string>(envKey);

    // backward-compat: legacy CSV_PATH used as ekb source
    if (!csvPath && city === 'ekb') {
      csvPath = this.configService.get<string>('CSV_PATH');
    }

    if (!csvPath) {
      this.logger.warn(`${envKey} not configured — skipping city "${city}"`);
      return 0;
    }

    if (!fs.existsSync(csvPath)) {
      this.logger.warn(`CSV file for city "${city}" not found at ${csvPath} — skipping`);
      return 0;
    }

    this.logger.log(`Starting CSV import for city="${city}" from ${csvPath}`);
    const products: Partial<Product>[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath!, { encoding: 'utf8' })
        .pipe(
          csv({
            separator: ';',
            headers: [
              'art', 'price', 'quantity', 'brand', 'full_name',
              'marka', 'model', 'generation', 'ozon', 'wildberries',
              'name', 'oem', 'type', 'artKod', 'lab',
            ],
            skipLines: 1,
          }),
        )
        .on('data', (row) => {
          if (!row.art || !row.art.trim()) return;

          const quantity = parseInt(row.quantity || '0', 10);
          if (quantity === 0) return;

          const artTrim = row.art.trim();
          const artKodTrim = row.artKod?.trim();
          products.push({
            article: artTrim,
            city,
            artKod: artKodTrim || null,
            price: parseFloat(row.price?.replace(',', '.') || '0'),
            quantity,
            brand: row.brand?.trim() || '',
            fullName: row.full_name?.trim() || '',
            marka: row.marka?.trim() || '',
            model: row.model?.trim() || '',
            generation: row.generation?.trim() || '',
            ozonUrl: row.ozon?.trim() || null,
            wildberriesUrl: row.wildberries?.trim() || null,
            name: row.name?.trim() || '',
            oem: row.oem?.trim() || null,
            type: row.type?.trim() || null,
            lab: row.lab?.trim() || null,
          });
        })
        .on('end', async () => {
          try {
            this.logger.log(`Parsed ${products.length} products for city="${city}"`);

            // Delete only this city's rows so other cities are unaffected
            await this.productRepository
              .createQueryBuilder()
              .delete()
              .from(Product)
              .where('city = :city', { city })
              .execute();

            const chunkSize = 500;
            for (let i = 0; i < products.length; i += chunkSize) {
              const chunk = products.slice(i, i + chunkSize);
              await this.productRepository.save(chunk);
            }

            this.logger.log(`Imported ${products.length} products for city="${city}"`);
            resolve(products.length);
          } catch (error) {
            this.logger.error(`Failed to save products for city="${city}"`, error);
            reject(error);
          }
        })
        .on('error', (error) => {
          this.logger.error('Error reading CSV file', error);
          reject(error);
        });
    });
  }

  /** Legacy alias — keeps backward compatibility for code that calls importFromCsv(). */
  async importFromCsv(): Promise<number> {
    return this.importFromCsvForCity('ekb');
  }
}
