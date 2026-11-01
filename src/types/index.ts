export type ProductStatus = 'IN_STOCK' | 'SOLD' | 'RESERVED';

export interface Product {
  id: string;
  company: string;        // Apple, Samsung, Google Pixel, etc.
  model: string;          // iPhone 15 Pro Max, Galaxy S24 Ultra, etc.
  variant: string;        // 128GB, 256GB, 512GB, 1TB
  color: string;          // Natural Titanium, Midnight, etc.
  batteryHealth: string;  // 100%, 98%, Brand New, etc.
  boxCondition: string;   // ইনট্যাক্ট (Sealed Box), মেচিং বক্স (Original Box), etc.
  supplier: string;       // Dubai Stock, USA LL/A, Singapore ZP/A, Local, etc.
  purchasePrice: number;  // Cost price in BDT
  targetSalePrice: number;// Selling price in BDT
  imei: string;           // 15-digit IMEI or serial number
  status: ProductStatus;
  notes: string;
  createdAt: number;
}

export interface Sale {
  id: string;
  productId: string;
  invoiceNumber: string;    // e.g. AABD-100234
  productDetails: string;   // Apple iPhone 15 Pro Max (256GB, Natural Titanium)
  imei: string;
  batteryHealth: string;
  boxCondition: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  costPrice: number;
  salePrice: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;    // নগদ ক্যাশ (Cash), বিকাশ (bKash), etc.
  warrantyInfo: string;
  soldAt: number;
  remarks: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ShopSettings {
  appLanguage: 'BN' | 'EN';
  themeMode: ThemeMode;
  shopName: string;
  shopTagline: string;
  shopPhone: string;
  shopAddress: string;
  warrantyReplacement: string;
  warrantyService: string;
  warrantyExchangeDeduction: string;
  companyPresets: string[];
  variantPresets: string[];
  colorPresets: string[];
  batteryPresets: string[];
  boxConditionPresets: string[];
  supplierPresets: string[];
  paymentMethodPresets: string[];
}

export type AppTab = 'DASHBOARD' | 'STOCK' | 'SALES' | 'REPORTS' | 'SETTINGS';

export interface DashboardMetrics {
  inStockCount: number;
  totalStockValue: number;
  totalTargetValue: number;
  totalSalesCount: number;
  totalRevenue: number;
  totalProfit: number;
  totalDue: number;
}

export interface MonthlyReport {
  periodName: string;
  unitsSold: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalPaid: number;
  totalDue: number;
  profitMarginPercent: number;
  topSellingModels: { modelName: string; count: number }[];
}
