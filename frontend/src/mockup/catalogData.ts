// Mockup data based on Avito car database structure
// This simulates the Katalog_avito table

export interface CatalogAvito {
  id2: string;      // Brand name
  n_ame: string;    // Brand code
  id4: string;      // Model name
  name3: string;    // Model code
  id6: string;      // Year
  name5: string;    // Year code
  display: number;  // 1 = show, 0 = hide
}

// Article to Avito mapping (artf_avito table)
export interface ArticleAvito {
  article_prefix: string;  // e.g., "SDOCT05"
  n_ame: string;          // Brand code
  name3: string;          // Model code
  name5: string;          // Year code
}

// Mockup Catalog Data
export const catalogAvitoData: CatalogAvito[] = [
  // Skoda Octavia
  { id2: "Skoda", n_ame: "329295", id4: "Octavia", name3: "330498", id6: "2005", name5: "334394", display: 1 },
  { id2: "Skoda", n_ame: "329295", id4: "Octavia", name3: "330498", id6: "2008", name5: "334395", display: 1 },
  { id2: "Skoda", n_ame: "329295", id4: "Octavia", name3: "330498", id6: "2013", name5: "334396", display: 1 },
  
  // Kia Rio
  { id2: "Kia", n_ame: "329296", id4: "Rio", name3: "330499", id6: "2011", name5: "334397", display: 1 },
  { id2: "Kia", n_ame: "329296", id4: "Rio", name3: "330499", id6: "2017", name5: "334398", display: 1 },
  
  // VW Golf
  { id2: "Volkswagen", n_ame: "329297", id4: "Golf", name3: "330500", id6: "2009", name5: "334399", display: 1 },
  { id2: "Volkswagen", n_ame: "329297", id4: "Golf", name3: "330500", id6: "2013", name5: "334400", display: 1 },
  
  // BMW 3-Series
  { id2: "BMW", n_ame: "329298", id4: "3 Series", name3: "330501", id6: "2005", name5: "334401", display: 1 },
  { id2: "BMW", n_ame: "329298", id4: "3 Series", name3: "330501", id6: "2012", name5: "334402", display: 1 },
  
  // Toyota Camry
  { id2: "Toyota", n_ame: "329299", id4: "Camry", name3: "330502", id6: "2011", name5: "334403", display: 1 },
  { id2: "Toyota", n_ame: "329299", id4: "Camry", name3: "330502", id6: "2018", name5: "334404", display: 1 },
  
  // Hyundai Solaris
  { id2: "Hyundai", n_ame: "329300", id4: "Solaris", name3: "330503", id6: "2014", name5: "334405", display: 1 },
  { id2: "Hyundai", n_ame: "329300", id4: "Solaris", name3: "330503", id6: "2017", name5: "334406", display: 1 },

  // Mercedes-Benz E-Class
  { id2: "Mercedes-Benz", n_ame: "329301", id4: "E-Class", name3: "330504", id6: "2009", name5: "334407", display: 1 },
  { id2: "Mercedes-Benz", n_ame: "329301", id4: "E-Class", name3: "330504", id6: "2016", name5: "334408", display: 1 },

  // Mazda 3
  { id2: "Mazda", n_ame: "329302", id4: "3", name3: "330505", id6: "2010", name5: "334409", display: 1 },
  { id2: "Mazda", n_ame: "329302", id4: "3", name3: "330505", id6: "2013", name5: "334410", display: 1 },

  // Ford Focus
  { id2: "Ford", n_ame: "329303", id4: "Focus", name3: "330506", id6: "2011", name5: "334411", display: 1 },
  { id2: "Ford", n_ame: "329303", id4: "Focus", name3: "330506", id6: "2015", name5: "334412", display: 1 },
  
  // More models with display=0 (not available)
  { id2: "Audi", n_ame: "329304", id4: "A4", name3: "330507", id6: "2010", name5: "334413", display: 0 },
  { id2: "Nissan", n_ame: "329305", id4: "Qashqai", name3: "330508", id6: "2014", name5: "334414", display: 0 },
];

// Article to Avito mapping
export const articleAvitoData: ArticleAvito[] = [
  { article_prefix: "SDOCT05", n_ame: "329295", name3: "330498", name5: "334394" }, // Skoda Octavia 2005
  { article_prefix: "SDOCT08", n_ame: "329295", name3: "330498", name5: "334395" }, // Skoda Octavia 2008
  { article_prefix: "SDOCT13", n_ame: "329295", name3: "330498", name5: "334396" }, // Skoda Octavia 2013
  { article_prefix: "KARIO11", n_ame: "329296", name3: "330499", name5: "334397" }, // Kia Rio 2011
  { article_prefix: "KARIO17", n_ame: "329296", name3: "330499", name5: "334398" }, // Kia Rio 2017
  { article_prefix: "VWGLF09", n_ame: "329297", name3: "330500", name5: "334399" }, // VW Golf 2009
  { article_prefix: "VWGLF13", n_ame: "329297", name3: "330500", name5: "334400" }, // VW Golf 2013
  { article_prefix: "BME3405", n_ame: "329298", name3: "330501", name5: "334401" }, // BMW 3 2005
  { article_prefix: "BME3412", n_ame: "329298", name3: "330501", name5: "334402" }, // BMW 3 2012
  { article_prefix: "TYCAM11", n_ame: "329299", name3: "330502", name5: "334403" }, // Toyota Camry 2011
  { article_prefix: "TYCAM18", n_ame: "329299", name3: "330502", name5: "334404" }, // Toyota Camry 2018
  { article_prefix: "HYSOL14", n_ame: "329300", name3: "330503", name5: "334405" }, // Hyundai Solaris 2014
  { article_prefix: "HYSOL17", n_ame: "329300", name3: "330503", name5: "334406" }, // Hyundai Solaris 2017
  { article_prefix: "MBECL09", n_ame: "329301", name3: "330504", name5: "334407" }, // Mercedes E 2009
  { article_prefix: "MBECL16", n_ame: "329301", name3: "330504", name5: "334408" }, // Mercedes E 2016
  { article_prefix: "MDMAZ10", n_ame: "329302", name3: "330505", name5: "334409" }, // Mazda 3 2010
  { article_prefix: "MDMAZ13", n_ame: "329302", name3: "330505", name5: "334410" }, // Mazda 3 2013
  { article_prefix: "FDFOC11", n_ame: "329303", name3: "330506", name5: "334411" }, // Ford Focus 2011
  { article_prefix: "FDFOC15", n_ame: "329303", name3: "330506", name5: "334412" }, // Ford Focus 2015
  { article_prefix: "TYCAM11", n_ame: "329299", name3: "330502", name5: "334403" }, // Toyota Camry 2011
  { article_prefix: "TYCAM18", n_ame: "329299", name3: "330502", name5: "334404" }, // Toyota Camry 2018
  { article_prefix: "HYSOL14", n_ame: "329300", name3: "330503", name5: "334405" }, // Hyundai Solaris 2014
  { article_prefix: "HYSOL17", n_ame: "329300", name3: "330503", name5: "334406" }, // Hyundai Solaris 2017
  { article_prefix: "MBECL09", n_ame: "329301", name3: "330504", name5: "334407" }, // Mercedes E 2009
  { article_prefix: "MBECL16", n_ame: "329301", name3: "330504", name5: "334408" }, // Mercedes E 2016
  { article_prefix: "MDMAZ10", n_ame: "329302", name3: "330505", name5: "334409" }, // Mazda 3 2010
  { article_prefix: "MDMAZ13", n_ame: "329302", name3: "330505", name5: "334410" }, // Mazda 3 2013
];

// Helper functions to work with catalog data
export const getUniqueBrands = (): Array<{ name: string; code: string }> => {
  const brands = catalogAvitoData
    .filter(item => item.display === 1)
    .reduce((acc, item) => {
      if (!acc.find(b => b.code === item.n_ame)) {
        acc.push({ name: item.id2, code: item.n_ame });
      }
      return acc;
    }, [] as Array<{ name: string; code: string }>);
  
  return brands.sort((a, b) => a.name.localeCompare(b.name));
};

export const getModelsByBrand = (brandCode: string): Array<{ model: string; year: string; modelCode: string; yearCode: string }> => {
  return catalogAvitoData
    .filter(item => item.n_ame === brandCode && item.display === 1)
    .map(item => ({
      model: item.id4,
      year: item.id6,
      modelCode: item.name3,
      yearCode: item.name5
    }));
};

export const findArticlePrefix = (brandCode: string, modelCode: string, yearCode: string): string | null => {
  const match = articleAvitoData.find(
    item => item.n_ame === brandCode && item.name3 === modelCode && item.name5 === yearCode
  );
  return match ? match.article_prefix : null;
};

