import apiClient from './client';

export interface Product {
  id: number;
  article: string;
  price: string;
  quantity: number;
  brand: string;
  fullName: string;
  marka: string;
  model: string;
  generation: string;
  ozonUrl: string | null;
  wildberriesUrl: string | null;
  name: string;
  oem: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CategoriesResponse {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  generationsByModel: Record<string, string[]>;
  partTypes: string[];
}

export interface SearchFilters {
  marka?: string;
  model?: string;
  generation?: string;
  article?: string;
  nameKeyword?: string;
  page?: number;
  limit?: number;
}

export interface OemSearchResponse {
  products: Product[];
  total: number;
  articlesFound: string[];
}

export interface UnifiedSearchResponse {
    products: Product[];
    total: number;
    articlesFound: string[];
  }

export const productsApi = {
  // Get categories hierarchy
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await apiClient.get<CategoriesResponse>('/products/categories');
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Search products with filters
  searchProducts: async (filters: SearchFilters = {}): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products/search', {
      params: filters,
    });
    return response.data;
  },
  searchByOem: async (oem: string, page: number = 1, limit: number = 20): Promise<OemSearchResponse> => {
    const response = await apiClient.get<OemSearchResponse>('/products/search-by-oem', {
      params: { oem, page, limit },
    });
    return response.data;
  },
  unifiedSearch: async (q: string, page: number = 1, limit: number = 20): Promise<UnifiedSearchResponse> => {
    const response = await apiClient.get<UnifiedSearchResponse>('/products/unified-search', {
      params: { q, page, limit },
    });
    return response.data;
  },
};