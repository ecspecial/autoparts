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
    // Найти все артикулы по OEM
    const articles = await this.crossCsvImportService.findArticlesByOem(oemInput);
  
    if (articles.length === 0) {
      return { products: [], total: 0, articlesFound: [] };
    }
  
    // Найти продукты
    const [products, total] = await this.productRepository.findAndCount({
      where: { article: In(articles) },
      skip: (page - 1) * limit,
      take: limit,
    });
  
    // ✅ ИСПРАВЛЕНИЕ: Возвращать только артикулы, которые действительно найдены
    const foundArticles = products.map(p => p.article);
    const uniqueFoundArticles = [...new Set(foundArticles)];
  
    return { 
      products, 
      total, 
      articlesFound: uniqueFoundArticles  // ← Только найденные в products
    };
  }

  // УЛУЧШЕННЫЙ поиск по артикулу с нормализацией
  async search(filters: {
    marka?: string;
    model?: string;
    generation?: string;
    article?: string;
    nameKeyword?: string;
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
      // Нормализуем поисковый запрос
      const normalized = this.normalizeForSearch(filters.article);
      
      // Ищем с учетом нормализации (убираем дефисы, пробелы, регистр не важен)
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

  async unifiedSearch(
    query: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ products: Product[]; total: number; articlesFound: string[] }> {
    const normalizedQuery = this.normalizeForSearch(query);
  
    // 1. Search cross-reference table by OEM (may return 0 results)
    const oemArticles = await this.crossCsvImportService.findArticlesByOem(query);
  
    // 2. Build unified query: article LIKE match OR exact OEM-matched articles
    const qb = this.productRepository.createQueryBuilder('product');
  
    if (oemArticles.length > 0) {
      // Search by normalized article OR by OEM-matched articles
      qb.where(
        "UPPER(REGEXP_REPLACE(product.article, '[^A-ZА-Я0-9]', '', 'gi')) LIKE :article",
        { article: `%${normalizedQuery}%` },
      ).orWhere('product.article IN (:...oemArticles)', { oemArticles });
    } else {
      // Only search by article
      qb.where(
        "UPPER(REGEXP_REPLACE(product.article, '[^A-ZА-Я0-9]', '', 'gi')) LIKE :article",
        { article: `%${normalizedQuery}%` },
      );
    }
  
    const [allProducts, total] = await qb
      .orderBy('product.marka', 'ASC')
      .addOrderBy('product.model', 'ASC')
      .getManyAndCount();
  
    // 3. Paginate manually (since we need total from combined query)
    const paginated = allProducts.slice((page - 1) * limit, page * limit);
  
    // 4. Only report OEM articles that actually exist in results
    const foundOemArticles = oemArticles.length > 0
      ? [...new Set(allProducts.filter(p => oemArticles.includes(p.article)).map(p => p.article))]
      : [];
  
    return { products: paginated, total, articlesFound: foundOemArticles };
  }

  // Вспомогательный метод нормализации
  private normalizeForSearch(input: string): string {
    return input
      .toUpperCase()
      .replace(/[^A-ZА-Я0-9]/g, '');
  }
}