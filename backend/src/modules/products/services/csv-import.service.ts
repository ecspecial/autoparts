import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import csv from 'csv-parser';  // ← Default import, not namespace
import { Product } from '../entities/product.entity';

@Injectable()
export class CsvImportService {
  private readonly logger = new Logger(CsvImportService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private configService: ConfigService,
  ) {}

  async importFromCsv(): Promise<number> {
    const csvPath = this.configService.get<string>('CSV_PATH');
    
    if (!csvPath) {  // ← Handle undefined
      this.logger.error('CSV_PATH not configured in .env');
      throw new Error('CSV_PATH not configured');
    }
    
    if (!fs.existsSync(csvPath)) {
      this.logger.error(`CSV file not found at ${csvPath}`);
      throw new Error('CSV file not found');
    }

    this.logger.log(`Starting CSV import from ${csvPath}`);
    const products: Partial<Product>[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath, { encoding: 'utf8' })
        .pipe(csv({  // ← Now works as default import
          separator: ';',
          headers: ['art', 'price', 'quantity', 'brand', 'full_name', 'marka', 'model', 'generation', 'ozon', 'wildberries', 'name', 'oem', 'type', 'artKod', 'lab'],          
          skipLines: 1,
        }))
        .on('data', (row) => {
            if (!row.art || !row.art.trim()) return;
  
            const quantity = parseInt(row.quantity || '0', 10);
            if (quantity === 0) return;
  
            products.push({
              article: row.art.trim(),
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
            this.logger.log(`Parsed ${products.length} products from CSV`);

            await this.productRepository.clear();
            
            const chunkSize = 500;
            for (let i = 0; i < products.length; i += chunkSize) {
              const chunk = products.slice(i, i + chunkSize);
              await this.productRepository.save(chunk);
            }

            this.logger.log(`Successfully imported ${products.length} products`);
            resolve(products.length);
          } catch (error) {
            this.logger.error('Failed to save products to database', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          this.logger.error('Error reading CSV file', error);
          reject(error);
        });
    });
  }
}