# Mockup Data Documentation

This folder contains mockup data files that simulate the backend API responses. Later, these will be replaced with actual API calls.

## Data Structure

### 1. `catalogData.ts` - Car Database (Avito Structure)

Simulates the Avito car catalog database with two main tables:

#### **Katalog_avito** (catalogAvitoData)
```typescript
{
  id2: string;      // Brand name (e.g., "Skoda")
  n_ame: string;    // Brand code (e.g., "329295")
  id4: string;      // Model name (e.g., "Octavia")
  name3: string;    // Model code (e.g., "330498")
  id6: string;      // Year (e.g., "2005")
  name5: string;    // Year code (e.g., "334394")
  display: number;  // 1 = show, 0 = hide
}
```

#### **artf_avito** (articleAvitoData)
Maps article prefixes to car codes:
```typescript
{
  article_prefix: string;  // e.g., "SDOCT05"
  n_ame: string;          // Brand code
  name3: string;          // Model code
  name5: string;          // Year code
}
```

### 2. `productsData.ts` - Products/Parts

Contains all auto parts with full information:
```typescript
{
  id: string;
  article: string;        // Full article code: "SDOCT05-880"
  name: string;           // Part name in Russian
  brand: string;          // Car brand: "Skoda"
  model: string;          // Car model: "Octavia"
  year: string;           // Year: "2005"
  category: string;       // Category (Капоты, Бамперы, etc.)
  price: number;          // Price in rubles
  availability: string;   // 'in_stock' | 'on_order' | 'out_of_stock'
  imageUrl: string;       // Image URL
  marketplaces?: {        // Optional marketplace availability
    ozon?: string;
    wildberries?: string;
  }
}
```

### 3. `usersData.ts` - User Profile & Orders

User profile and order history data:
```typescript
// User
{
  id: string;
  email: string;
  name: string;
  phone: string;
  balance: number;
  paymentMethod: 'card' | 'cash' | 'online';
  deliveryMethod: 'courier' | 'pickup' | 'post';
}

// Order
{
  id: string;
  orderNumber: string;
  userId: string;
  date: string;           // ISO date string
  totalPrice: number;
  status: 'completed' | 'new' | 'processing' | 'pending' | 'cancelled';
  items: Array<{
    article: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}
```

### 4. `cartData.ts` - Shopping Cart

Shopping cart with quantity management:
```typescript
{
  id: string;
  article: string;
  name: string;
  brand: string;
  model: string;
  year: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
  availability: 'in_stock' | 'on_order' | 'out_of_stock';
}
```

## Article Code Structure

Article codes follow this pattern: `BRAND+MODEL+YEAR-PART-SIDE`

**Examples:**
- `SDOCT05-880` = Skoda Octavia 2005, part 880
- `KARIO17-520-L` = Kia Rio 2017, part 520, Left side
- `BME3412-488` = BMW 3-series 2012, part 488

**Encoding:**
- `SD` = Skoda
- `KIA` = Kia
- `VW` = Volkswagen
- `BM` = BMW
- `TY` = Toyota
- `HY` = Hyundai
- `MB` = Mercedes-Benz
- `MD` = Mazda
- `FD` = Ford

## Search Flow

1. **User selects brand** → Get unique brands where `display=1`
2. **User selects model+year** → Filter by brand code, get unique model/year combinations
3. **System finds article prefix** → Look up in `articleAvitoData` using brand+model+year codes
4. **System searches products** → Filter `productsData` by article prefix
5. **Display results** → Show matching products with filters and sorting

## Helper Functions

### `catalogData.ts`
- `getUniqueBrands()` - Returns all unique brands with display=1
- `getModelsByBrand(brandCode)` - Returns models/years for selected brand
- `findArticlePrefix(brandCode, modelCode, yearCode)` - Finds article prefix for selection

### `productsData.ts`
- `filterProductsByArticlePrefix(prefix)` - Returns all products matching prefix
- `getUniqueCategories()` - Returns all categories
- `getUniqueBrandsFromProducts()` - Returns all brands from products

### `usersData.ts`
- `getOrdersByUserId(userId)` - Returns user's orders
- `getOrderStatusText(status)` - Returns localized status text
- `getOrderStatusClass(status)` - Returns CSS class for status
- `getPaymentMethodText(method)` - Returns localized payment method
- `getDeliveryMethodText(method)` - Returns localized delivery method

### `cartData.ts`
- `getCartItems()` - Returns all cart items
- `getCartTotal()` - Calculates total price
- `getCartItemsCount()` - Returns total quantity
- `addToCart(item)` - Adds item to cart
- `removeFromCart(itemId)` - Removes item
- `updateCartItemQuantity(itemId, quantity)` - Updates quantity
- `clearCart()` - Empties cart
- `getAvailabilityText(availability)` - Returns localized availability

## Future API Integration

When replacing with real API:

1. Replace `catalogAvitoData` with `GET /api/catalog/avito`
2. Replace `articleAvitoData` with `GET /api/catalog/articles`
3. Replace `productsData` with `GET /api/products?prefix={prefix}`
4. Add pagination, search, advanced filtering
5. Add real images instead of placeholders
6. Connect marketplace links (Ozon, Wildberries)

## Sample Data Included

- **9 brands**: Skoda, Kia, Volkswagen, BMW, Toyota, Hyundai, Mercedes-Benz, Mazda, Ford
- **19 car models/years** (with display=1, plus 2 hidden models)
- **54 products** across multiple categories
- **8 Categories**: Капоты, Бамперы, Крылья, Фары, Фонари, Двери, Зеркала, Решетки
- **1 user profile** with email, phone, balance, preferences
- **4 orders** with different statuses
- **3 cart items** pre-loaded for testing
- **Default product image**: `/product-placeholder.png` (unified placeholder)

