import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export interface CategoriesCache {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  generationsByModel: Record<string, string[]>;
  partTypes: string[];
}

@Injectable()
export class CategoriesCacheService {
  private readonly logger = new Logger(CategoriesCacheService.name);
  private cache: CategoriesCache | null = null;

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCategories(): Promise<CategoriesCache> {
    if (!this.cache) {
      await this.rebuildCache();
    }
    return this.cache!;
  }

  async rebuildCache(): Promise<void> {
    this.logger.log('Rebuilding categories cache...');
    const city = (process.env.SITE_CITY ?? 'ekb').toLowerCase().trim();

    // Get all unique brands
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
      if (!modelsByBrand[r.marka]) {
        modelsByBrand[r.marka] = [];
      }
      if (!modelsByBrand[r.marka].includes(r.model)) {
        modelsByBrand[r.marka].push(r.model);
      }
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
      if (!generationsByModel[key]) {
        generationsByModel[key] = [];
      }
      if (!generationsByModel[key].includes(r.generation)) {
        generationsByModel[key].push(r.generation);
      }
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

    this.cache = {
      brands,
      modelsByBrand,
      generationsByModel,
      partTypes,
    };

    this.logger.log(`Cache rebuilt (city=${city}): ${brands.length} brands, ${Object.keys(modelsByBrand).length} brand-model pairs, ${Object.keys(generationsByModel).length} model-generation pairs`);
  }

  clearCache(): void {
    this.cache = null;
  }
}