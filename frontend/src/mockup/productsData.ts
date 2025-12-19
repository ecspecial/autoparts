// Mockup product/parts data

export interface Product {
  id: string;
  article: string;        // Full article code (e.g., "SDOCT05-880")
  name: string;           // Product name in Russian
  brand: string;          // Car brand (e.g., "Skoda")
  model: string;          // Car model (e.g., "Octavia")
  year: string;           // Year (e.g., "2005")
  category: string;       // Category (Капоты, Бамперы, etc.)
  price: number;          // Price in rubles
  availability: 'in_stock' | 'on_order' | 'out_of_stock';
  imageUrl: string;       // Image URL (for now, placeholder)
  marketplaces?: {
    ozon?: string;
    wildberries?: string;
  };
}

// Placeholder images (will be replaced with real images later)
// All products use the same default image for now
const DEFAULT_IMAGE = '/product-placeholder.png';

const IMAGES = {
  hood: DEFAULT_IMAGE,
  bumper: DEFAULT_IMAGE,
  fender: DEFAULT_IMAGE,
  headlight: DEFAULT_IMAGE,
  taillight: DEFAULT_IMAGE,
  door: DEFAULT_IMAGE,
  mirror: DEFAULT_IMAGE,
  grille: DEFAULT_IMAGE,
};

export const productsData: Product[] = [
  // Skoda Octavia 2005
  { id: "1", article: "SDOCT05-880", name: "Капот", brand: "Skoda", model: "Octavia", year: "2005", category: "Капоты", price: 12900, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "2", article: "SDOCT05-743-L", name: "Крыло переднее левое", brand: "Skoda", model: "Octavia", year: "2005", category: "Крылья", price: 7800, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "3", article: "SDOCT05-743-R", name: "Крыло переднее правое", brand: "Skoda", model: "Octavia", year: "2005", category: "Крылья", price: 7800, availability: "in_stock", imageUrl: IMAGES.fender },
  
  // Skoda Octavia 2008
  { id: "4", article: "SDOCT08-071-L", name: "Фара передняя левая", brand: "Skoda", model: "Octavia", year: "2008", category: "Фары", price: 5800, availability: "in_stock", imageUrl: IMAGES.headlight },
  { id: "5", article: "SDOCT08-071-R", name: "Фара передняя правая", brand: "Skoda", model: "Octavia", year: "2008", category: "Фары", price: 5800, availability: "in_stock", imageUrl: IMAGES.headlight },
  { id: "6", article: "SDOCT08-191-C", name: "Бампер передний", brand: "Skoda", model: "Octavia", year: "2008", category: "Бамперы", price: 6500, availability: "on_order", imageUrl: IMAGES.bumper, marketplaces: { ozon: "OZON" } },
  { id: "7", article: "SDOCT08-290-C", name: "Бампер задний", brand: "Skoda", model: "Octavia", year: "2008", category: "Бамперы", price: 5900, availability: "in_stock", imageUrl: IMAGES.bumper },
  { id: "8", article: "SDOCT08-455-L", name: "Зеркало левое", brand: "Skoda", model: "Octavia", year: "2008", category: "Зеркала", price: 2800, availability: "in_stock", imageUrl: IMAGES.mirror },
  
  // Skoda Octavia 2013
  { id: "9", article: "SDOCT13-020-R", name: "Дверь передняя правая", brand: "Skoda", model: "Octavia", year: "2013", category: "Двери", price: 14500, availability: "in_stock", imageUrl: IMAGES.door },
  { id: "10", article: "SDOCT13-455", name: "Капот", brand: "Skoda", model: "Octavia", year: "2013", category: "Капоты", price: 13900, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "11", article: "SDOCT13-765-R", name: "Фонарь задний правый", brand: "Skoda", model: "Octavia", year: "2013", category: "Фонари", price: 4200, availability: "in_stock", imageUrl: IMAGES.taillight },
  
  // Kia Rio 2011
  { id: "12", article: "KARIO11-510-R", name: "Крыло заднее правое", brand: "Kia", model: "Rio", year: "2011", category: "Крылья", price: 8500, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "13", article: "KARIO11-345", name: "Бампер задний", brand: "Kia", model: "Rio", year: "2011", category: "Бамперы", price: 5900, availability: "in_stock", imageUrl: IMAGES.bumper },
  { id: "14", article: "KARIO11-223", name: "Решетка радиатора", brand: "Kia", model: "Rio", year: "2011", category: "Решетки", price: 3200, availability: "on_order", imageUrl: IMAGES.grille },
  
  // Kia Rio 2017
  { id: "15", article: "KARIO17-520-L", name: "Крыло переднее левое", brand: "Kia", model: "Rio", year: "2017", category: "Крылья", price: 6800, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "16", article: "KARIO17-520-R", name: "Крыло переднее правое", brand: "Kia", model: "Rio", year: "2017", category: "Крылья", price: 6800, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "17", article: "KARIO17-510-R", name: "Зеркало правое", brand: "Kia", model: "Rio", year: "2017", category: "Зеркала", price: 3200, availability: "on_order", imageUrl: IMAGES.mirror, marketplaces: { wildberries: "WB" } },
  { id: "18", article: "KARIO17-089-L", name: "Фара передняя левая", brand: "Kia", model: "Rio", year: "2017", category: "Фары", price: 6200, availability: "in_stock", imageUrl: IMAGES.headlight },
  { id: "19", article: "KARIO17-290", name: "Бампер передний", brand: "Kia", model: "Rio", year: "2017", category: "Бамперы", price: 7300, availability: "in_stock", imageUrl: IMAGES.bumper },
  
  // VW Golf 2009
  { id: "20", article: "VWGLF09-453-R", name: "Фара передняя правая", brand: "Volkswagen", model: "Golf", year: "2009", category: "Фары", price: 7200, availability: "in_stock", imageUrl: IMAGES.headlight },
  { id: "21", article: "VWGLF09-120", name: "Капот", brand: "Volkswagen", model: "Golf", year: "2009", category: "Капоты", price: 15800, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "22", article: "VWGLF09-678-R", name: "Крыло заднее правое", brand: "Volkswagen", model: "Golf", year: "2009", category: "Крылья", price: 9100, availability: "on_order", imageUrl: IMAGES.fender },
  
  // VW Golf 2013
  { id: "23", article: "VWGLF13-789", name: "Бампер передний", brand: "Volkswagen", model: "Golf", year: "2013", category: "Бамперы", price: 8900, availability: "in_stock", imageUrl: IMAGES.bumper, marketplaces: { ozon: "OZON", wildberries: "WB" } },
  { id: "24", article: "VWGLF13-231-L", name: "Дверь задняя левая", brand: "Volkswagen", model: "Golf", year: "2013", category: "Двери", price: 12500, availability: "on_order", imageUrl: IMAGES.door },
  { id: "25", article: "VWGLF13-556-R", name: "Фонарь задний правый", brand: "Volkswagen", model: "Golf", year: "2013", category: "Фонари", price: 3800, availability: "in_stock", imageUrl: IMAGES.taillight },
  
  // BMW 3 Series 2005
  { id: "26", article: "BME3405-023L-Z", name: "Зеркало левое с подогревом", brand: "BMW", model: "3 Series", year: "2005", category: "Зеркала", price: 4500, availability: "in_stock", imageUrl: IMAGES.mirror },
  { id: "27", article: "BME3405-892", name: "Капот", brand: "BMW", model: "3 Series", year: "2005", category: "Капоты", price: 18900, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "28", article: "BME3405-334", name: "Решетка радиатора", brand: "BMW", model: "3 Series", year: "2005", category: "Решетки", price: 5600, availability: "in_stock", imageUrl: IMAGES.grille, marketplaces: { ozon: "OZON" } },
  
  // BMW 3 Series 2012  
  { id: "29", article: "BME3412-488", name: "Бампер передний", brand: "BMW", model: "3 Series", year: "2012", category: "Бамперы", price: 12800, availability: "in_stock", imageUrl: IMAGES.bumper },
  { id: "30", article: "BME3412-673-R", name: "Фара передняя правая LED", brand: "BMW", model: "3 Series", year: "2012", category: "Фары", price: 15600, availability: "on_order", imageUrl: IMAGES.headlight },
  { id: "31", article: "BME3412-221-L", name: "Дверь передняя левая", brand: "BMW", model: "3 Series", year: "2012", category: "Двери", price: 16800, availability: "in_stock", imageUrl: IMAGES.door },
  
  // Toyota Camry 2011
  { id: "32", article: "TYCAM11-345", name: "Крыло переднее левое", brand: "Toyota", model: "Camry", year: "2011", category: "Крылья", price: 9200, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "33", article: "TYCAM11-891-R", name: "Решетка радиатора", brand: "Toyota", model: "Camry", year: "2011", category: "Решетки", price: 4200, availability: "in_stock", imageUrl: IMAGES.grille },
  { id: "34", article: "TYCAM11-120", name: "Капот", brand: "Toyota", model: "Camry", year: "2011", category: "Капоты", price: 14300, availability: "in_stock", imageUrl: IMAGES.hood },
  
  // Toyota Camry 2018
  { id: "35", article: "TYCAM18-234", name: "Капот", brand: "Toyota", model: "Camry", year: "2018", category: "Капоты", price: 16500, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "36", article: "TYCAM18-567-L", name: "Фара передняя левая", brand: "Toyota", model: "Camry", year: "2018", category: "Фары", price: 12300, availability: "in_stock", imageUrl: IMAGES.headlight },
  { id: "37", article: "TYCAM18-890-C", name: "Бампер передний", brand: "Toyota", model: "Camry", year: "2018", category: "Бамперы", price: 9800, availability: "in_stock", imageUrl: IMAGES.bumper, marketplaces: { ozon: "OZON" } },
  
  // Hyundai Solaris 2014
  { id: "38", article: "HYSOL14-456", name: "Капот", brand: "Hyundai", model: "Solaris", year: "2014", category: "Капоты", price: 11200, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "39", article: "HYSOL14-678-L", name: "Крыло переднее левое", brand: "Hyundai", model: "Solaris", year: "2014", category: "Крылья", price: 6500, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "40", article: "HYSOL14-234-C", name: "Бампер задний", brand: "Hyundai", model: "Solaris", year: "2014", category: "Бамперы", price: 5600, availability: "on_order", imageUrl: IMAGES.bumper },
  
  // Hyundai Solaris 2017
  { id: "41", article: "HYSOL17-789-R", name: "Фонарь задний правый", brand: "Hyundai", model: "Solaris", year: "2017", category: "Фонари", price: 3900, availability: "in_stock", imageUrl: IMAGES.taillight },
  { id: "42", article: "HYSOL17-345-R", name: "Зеркало правое с повторителем", brand: "Hyundai", model: "Solaris", year: "2017", category: "Зеркала", price: 3800, availability: "in_stock", imageUrl: IMAGES.mirror },
  
  // Mercedes-Benz E-Class 2009
  { id: "43", article: "MBECL09-567", name: "Капот", brand: "Mercedes-Benz", model: "E-Class", year: "2009", category: "Капоты", price: 22500, availability: "on_order", imageUrl: IMAGES.hood },
  { id: "44", article: "MBECL09-234-L", name: "Фара передняя левая ксенон", brand: "Mercedes-Benz", model: "E-Class", year: "2009", category: "Фары", price: 18900, availability: "in_stock", imageUrl: IMAGES.headlight, marketplaces: { ozon: "OZON" } },
  
  // Mercedes-Benz E-Class 2016
  { id: "45", article: "MBECL16-890", name: "Решетка радиатора AMG", brand: "Mercedes-Benz", model: "E-Class", year: "2016", category: "Решетки", price: 12300, availability: "in_stock", imageUrl: IMAGES.grille },
  { id: "46", article: "MBECL16-456-C", name: "Бампер передний", brand: "Mercedes-Benz", model: "E-Class", year: "2016", category: "Бамперы", price: 15800, availability: "in_stock", imageUrl: IMAGES.bumper },
  
  // Mazda 3 2010
  { id: "47", article: "MDMAZ10-234", name: "Капот", brand: "Mazda", model: "3", year: "2010", category: "Капоты", price: 10800, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "48", article: "MDMAZ10-567-R", name: "Крыло переднее правое", brand: "Mazda", model: "3", year: "2010", category: "Крылья", price: 7300, availability: "in_stock", imageUrl: IMAGES.fender },
  
  // Mazda 3 2013
  { id: "49", article: "MDMAZ13-890-L", name: "Фара передняя левая", brand: "Mazda", model: "3", year: "2013", category: "Фары", price: 8900, availability: "in_stock", imageUrl: IMAGES.headlight },
  { id: "50", article: "MDMAZ13-123-C", name: "Бампер передний", brand: "Mazda", model: "3", year: "2013", category: "Бамперы", price: 7800, availability: "on_order", imageUrl: IMAGES.bumper, marketplaces: { wildberries: "WB" } },
  
  // Ford Focus 2011
  { id: "51", article: "FDFOC11-456", name: "Капот", brand: "Ford", model: "Focus", year: "2011", category: "Капоты", price: 11900, availability: "in_stock", imageUrl: IMAGES.hood },
  { id: "52", article: "FDFOC11-789-R", name: "Фонарь задний правый", brand: "Ford", model: "Focus", year: "2011", category: "Фонари", price: 3400, availability: "in_stock", imageUrl: IMAGES.taillight },
  
  // Ford Focus 2015
  { id: "53", article: "FDFOC15-234-L", name: "Крыло переднее левое", brand: "Ford", model: "Focus", year: "2015", category: "Крылья", price: 7600, availability: "in_stock", imageUrl: IMAGES.fender },
  { id: "54", article: "FDFOC15-567-C", name: "Бампер задний", brand: "Ford", model: "Focus", year: "2015", category: "Бамперы", price: 6800, availability: "in_stock", imageUrl: IMAGES.bumper },
];

// Filter products by article prefix
export const filterProductsByArticlePrefix = (prefix: string): Product[] => {
  return productsData.filter(product => product.article.startsWith(prefix));
};

// Get all unique categories
export const getUniqueCategories = (): string[] => {
  const categories = Array.from(new Set(productsData.map(p => p.category)));
  return categories.sort();
};

// Get all unique brands for filter
export const getUniqueBrandsFromProducts = (): string[] => {
  const brands = Array.from(new Set(productsData.map(p => p.brand)));
  return brands.sort();
};

