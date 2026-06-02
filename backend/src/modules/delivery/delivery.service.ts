import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DeliveryMethod } from './entities/delivery-method.entity';
import { CityContextService } from '../../common/city-context.service';
import * as fs from 'fs';
import csvParser from 'csv-parser';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    @InjectRepository(DeliveryMethod)
    private deliveryMethodRepository: Repository<DeliveryMethod>,
    private configService: ConfigService,
    private cityContext: CityContextService,
  ) {}

  private getCsvPath(city: string): string {
    if (city === 'spb') {
      return (
        this.configService.get<string>('DELIVERY_CSV_PATH_SPB') ||
        '/var/images/autoparts/delivery/spb/delivery.csv'
      );
    }
    return (
      this.configService.get<string>('DELIVERY_CSV_PATH_EKB') ||
      this.configService.get<string>('DELIVERY_CSV_PATH') ||
      '/var/images/autoparts/delivery/ekb/delivery.csv'
    );
  }

  async findAll(): Promise<DeliveryMethod[]> {
    const city = this.cityContext.getCity();
    return this.deliveryMethodRepository.find({
      where: { city },
      order: { name: 'ASC' },
    });
  }

  async importFromCsv(): Promise<{ imported: number }> {
    const city = this.cityContext.getCity();
    const csvPath = this.getCsvPath(city);

    if (!fs.existsSync(csvPath)) {
      this.logger.warn(`Delivery CSV not found at ${csvPath}, skipping`);
      return { imported: 0 };
    }

    this.logger.log(`Starting delivery methods import [${city}] from ${csvPath}`);
    const records: Array<{ code1c: string; name: string; city: string }> = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(csvPath, { encoding: 'utf8' })
        .pipe(csvParser({ separator: ';', headers: false }))
        .on('data', (row) => {
          try {
            const code1c = (row['1'] || '').trim();
            const name = (row['2'] || '').trim();
            if (code1c && name) {
              records.push({ code1c, name, city });
            }
          } catch (error) {
            this.logger.warn('Error parsing delivery row:', error);
          }
        })
        .on('end', async () => {
          try {
            if (records.length === 0) {
              this.logger.warn(`No delivery methods found in CSV [${city}]`);
              resolve({ imported: 0 });
              return;
            }
            // Delete only current city's rows, keep other city's rows intact
            await this.deliveryMethodRepository.delete({ city });
            await this.deliveryMethodRepository.insert(records);
            this.logger.log(`✅ Imported ${records.length} delivery methods [${city}]`);
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
