import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CrossCsvImportService } from '../cross-reference/services/cross-csv-import.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private crossCsvImportService: CrossCsvImportService,
  ) {}

  async findById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  async searchByOem(
    oemInput: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ products: Product[]; total: number; articlesFound: string[] }> {
    const articles = await this.crossCsvImportService.findArticlesByOem(oemInput);
  
    if (articles.length === 0) {
      return { products: [], total: 0, articlesFound: [] };
    }
  
    const [products, total] = await this.productRepository.findAndCount({
      where: { article: In(articles) },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    const foundArticles = products.map(p => p.article);
    const uniqueFoundArticles = [...new Set(foundArticles)];
  
    return { 
      products, 
      total, 
      articlesFound: uniqueFoundArticles,
    };
  }

  // Search with all filters including type
  async search(filters: {
    marka?: string;
    model?: string;
    generation?: string;
    article?: string;
    nameKeyword?: string;
    type?: string;
    page: number;
    limit: number;
  }) {
    const query = this.productRepository.createQueryBuilder('product');
  
    if (filters.marka) {
      query.andWhere('product.marka = :marka', { marka: filters.marka });
    }
  
    if (filters.model) {
      query.andWhere('product.model = :model', { model: filters.model });
    }
  
    if (filters.generation) {
      query.andWhere('product.generation = :generation', { generation: filters.generation });
    }
  
    if (filters.article) {
      const normalized = this.normalizeForSearch(filters.article);
      query.andWhere(
        "UPPER(REGEXP_REPLACE(product.article, '[^A-ZА-Я0-9]', '', 'gi')) LIKE UPPER(:article)",
        { article: `%${normalized}%` }
      );
    }
  
    if (filters.nameKeyword) {
      query.andWhere(
        '(product.name ILIKE :keyword OR product.fullName ILIKE :keyword)',
        { keyword: `%${filters.nameKeyword}%` }
      );
    }

    if (filters.type) {
      query.andWhere('product.type = :type', { type: filters.type });
    }
  
    const [items, total] = await query
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .orderBy('product.marka', 'ASC')
      .addOrderBy('product.model', 'ASC')
      .getManyAndCount();
  
    return {
      items,
      total,
      page: filters.page,
      limit: filters.limit,
      pages: Math.ceil(total / filters.limit),
    };
  }

  // Get available part types based on current filters (dynamic)
  async getAvailableTypes(filters: {
    marka?: string;
    model?: string;
    generation?: string;
  }): Promise<string[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.type', 'type')
      .where('product.type IS NOT NULL')
      .andWhere("product.type != ''");

    if (filters.marka) {
      query.andWhere('product.marka = :marka', { marka: filters.marka });
    }

    if (filters.model) {
      query.andWhere('product.model = :model', { model: filters.model });
    }

    if (filters.generation) {
      query.andWhere('product.generation = :generation', { generation: filters.generation });
    }

    query.orderBy('product.type', 'ASC');

    const result = await query.getRawMany();
    return result.map(r => r.type);
  }

  async unifiedSearch(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ products: Product[]; total: number; articlesFound: string[] }> {
    const normalizedQuery = this.normalizeForSearch(query);
  
    const oemArticles = await this.crossCsvImportService.findArticlesByOem(query);
  
    const qb = this.productRepository.createQueryBuilder('product');
  
    if (oemArticles.length > 0) {
      qb.where(
        "UPPER(REGEXP_REPLACE(product.article, '[^A-ZА-Я0-9]', '', 'gi')) LIKE :article",
        { article: `%${normalizedQuery}%` },
      ).orWhere('product.article IN (:...oemArticles)', { oemArticles });
    } else {
      qb.where(
        "UPPER(REGEXP_REPLACE(product.article, '[^A-ZА-Я0-9]', '', 'gi')) LIKE :article",
        { article: `%${normalizedQuery}%` },
      );
    }
  
    const [allProducts, total] = await qb
      .orderBy('product.marka', 'ASC')
      .addOrderBy('product.model', 'ASC')
      .getManyAndCount();
  
    const paginated = allProducts.slice((page - 1) * limit, page * limit);
  
    const foundOemArticles = oemArticles.length > 0
      ? [...new Set(allProducts.filter(p => oemArticles.includes(p.article)).map(p => p.article))]
      : [];
  
    return { products: paginated, total, articlesFound: foundOemArticles };
  }

  private normalizeForSearch(input: string): string {
    return input
      .toUpperCase()
      .replace(/[^A-ZА-Я0-9]/g, '');
  }
}
