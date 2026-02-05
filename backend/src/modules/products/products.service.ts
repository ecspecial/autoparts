import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CrossCsvImportService } from '../cross-reference/services/cross-csv-import.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private crossCsvImportService: CrossCsvImportService,
  ) {}

  // Add this new method
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
  
    // Use productRepository (not productsRepository)
    const [products, total] = await this.productRepository.findAndCount({
      where: articles.map(article => ({ article })),
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return { products, total, articlesFound: articles };
  }

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
      query.andWhere('product.article ILIKE :article', { article: `%${filters.article}%` });
    }
  
    // ← ADD THIS: Search by name or fullName
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
}