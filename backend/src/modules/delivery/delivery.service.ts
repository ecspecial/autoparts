import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DeliveryMethod } from './entities/delivery-method.entity';
import * as fs from 'fs';
import csvParser from 'csv-parser';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    @InjectRepository(DeliveryMethod)
    private deliveryMethodRepository: Repository<DeliveryMethod>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<DeliveryMethod[]> {
    return this.deliveryMethodRepository.find({ order: { name: 'ASC' } });
  }

  async importFromCsv(): Promise<{ imported: number }> {
    const csvPath = this.configService.get<string>('DELIVERY_CSV_PATH')
      || '/var/images/autoparts/delivery/delivery.csv';

    if (!fs.existsSync(csvPath)) {
      this.logger.warn(`Delivery CSV not found at ${csvPath}, skipping`);
      return { imported: 0 };
    }

    this.logger.log(`Starting delivery methods import from ${csvPath}`);
    const records: Array<{ code1c: string; name: string }> = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath, { encoding: 'utf8' })
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', (row) => {
          try {
            // CSV format: ;CODE;NAME;
            // csv-parser with headers:false gives us 0, 1, 2, 3
            const code1c = (row['1'] || '').trim();
            const name = (row['2'] || '').trim();

            if (code1c && name) {
              records.push({ code1c, name });
            }
          } catch (error) {
            this.logger.warn('Error parsing delivery row:', error);
          }
        })
        .on('end', async () => {
          try {
            if (records.length === 0) {
              this.logger.warn('No delivery methods found in CSV');
              resolve({ imported: 0 });
              return;
            }

            await this.deliveryMethodRepository.clear();
            await this.deliveryMethodRepository.insert(records);
            this.logger.log(`✅ Imported ${records.length} delivery methods`);
            resolve({ imported: records.length });
          } catch (error) {
            this.logger.error('Failed to save delivery methods', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          this.logger.error('Error reading delivery CSV', error);
          reject(error);
        });
    });
  }
}