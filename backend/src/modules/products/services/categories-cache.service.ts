import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CityContextService } from '../../../common/city-context.service';

export interface CategoriesCache {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  generationsByModel: Record<string, string[]>;
  partTypes: string[];
}

@Injectable()
export class CategoriesCacheService {
  private readonly logger = new Logger(CategoriesCacheService.name);
  /** Per-city cache so both ekb and spb are served from one process. */
  private cacheByCity = new Map<string, CategoriesCache>();

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private cityContext: CityContextService,
  ) {}

  async getCategories(): Promise<CategoriesCache> {
    const city = this.cityContext.getCity();
    if (!this.cacheByCity.has(city)) {
      await this.rebuildCacheForCity(city);
    }
    return this.cacheByCity.get(city)!;
  }

  /** Called from ProductsSyncService after CSV import — rebuilds caches for all known cities. */
  async rebuildCache(): Promise<void> {
    for (const city of ['ekb', 'spb']) {
      await this.rebuildCacheForCity(city);
    }
  }

  async rebuildCacheForCity(city: string): Promise<void> {
    this.logger.log(`Rebuilding categories cache for city="${city}"...`);

    const brandsResult = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.marka', 'marka')
      .where('product.city = :city', { city })
      .andWhere('product.marka IS NOT NULL')
      .andWhere("product.marka != ''")
      .orderBy('product.marka', 'ASC')
      .getRawMany();

    const brands = brandsResult.map(r => r.marka);

    const modelsResult = await this.productRepository
      .createQueryBuilder('product')
      .select('product.marka', 'marka')
      .addSelect('product.model', 'model')
      .distinct(true)
      .where('product.city = :city', { city })
      .andWhere('product.marka IS NOT NULL')
      .andWhere('product.model IS NOT NULL')
      .andWhere("product.marka != ''")
      .andWhere("product.model != ''")
      .orderBy('product.marka', 'ASC')
      .addOrderBy('product.model', 'ASC')
      .getRawMany();

    const modelsByBrand: Record<string, string[]> = {};
    modelsResult.forEach(r => {
      if (!modelsByBrand[r.marka]) modelsByBrand[r.marka] = [];
      if (!modelsByBrand[r.marka].includes(r.model)) modelsByBrand[r.marka].push(r.model);
    });

    const generationsResult = await this.productRepository
      .createQueryBuilder('product')
      .select('product.marka', 'marka')
      .addSelect('product.model', 'model')
      .addSelect('product.generation', 'generation')
      .distinct(true)
      .where('product.city = :city', { city })
      .andWhere('product.marka IS NOT NULL')
      .andWhere('product.model IS NOT NULL')
      .andWhere('product.generation IS NOT NULL')
      .andWhere("product.marka != ''")
      .andWhere("product.model != ''")
      .andWhere("product.generation != ''")
      .orderBy('product.marka', 'ASC')
      .addOrderBy('product.model', 'ASC')
      .addOrderBy('product.generation', 'ASC')
      .getRawMany();

    const generationsByModel: Record<string, string[]> = {};
    generationsResult.forEach(r => {
      const key = `${r.marka}-${r.model}`;
      if (!generationsByModel[key]) generationsByModel[key] = [];
      if (!generationsByModel[key].includes(r.generation)) generationsByModel[key].push(r.generation);
    });

    const partTypesResult = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.type', 'type')
      .where('product.city = :city', { city })
      .andWhere('product.type IS NOT NULL')
      .andWhere("product.type != ''")
      .orderBy('product.type', 'ASC')
      .getRawMany();

    const partTypes = partTypesResult.map(r => r.type);

    this.cacheByCity.set(city, { brands, modelsByBrand, generationsByModel, partTypes });
    this.logger.log(
      `Cache rebuilt (city=${city}): ${brands.length} brands, ${Object.keys(modelsByBrand).length} brand-model pairs`,
    );
  }

  clearCache(): void {
    this.cacheByCity.clear();
  }
}
