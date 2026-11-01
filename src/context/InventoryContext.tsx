import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Sale,
  ShopSettings,
  AppTab,
  DashboardMetrics,
  MonthlyReport,
  ProductStatus
} from '../types';
import {
  DEFAULT_SHOP_SETTINGS,
  INITIAL_DEMO_PRODUCTS,
  INITIAL_DEMO_SALES,
  BanglaStrings,
  EnglishStrings
} from '../utils/constants';

interface InventoryContextType {
  products: Product[];
  sales: Sale[];
  settings: ShopSettings;
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedStatusFilter: 'ALL' | 'IN_STOCK' | 'SOLD';
  setSelectedStatusFilter: (status: 'ALL' | 'IN_STOCK' | 'SOLD') => void;
  selectedBrandFilter: string;
  setSelectedBrandFilter: (brand: string) => void;
  reportPeriod: 'THIS_MONTH' | 'LAST_MONTH' | 'ALL_TIME';
  setReportPeriod: (period: 'THIS_MONTH' | 'LAST_MONTH' | 'ALL_TIME') => void;

  filteredProducts: Product[];
  filteredSales: Sale[];
  dashboardMetrics: DashboardMetrics;
  reportData: MonthlyReport;

  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  isDark: boolean;

  // CRUD
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  recordSale: (saleData: {
    product: Product;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    salePrice: number;
    paidAmount: number;
    paymentMethod: string;
    warrantyInfo: string;
    remarks: string;
  }) => Sale;
  updateDuePayment: (saleId: string, additionalAmount: number) => void;
  updateSale: (sale: Sale) => void;
  deleteSale: (saleId: string, restoreStock: boolean) => void;

  updateSettings: (newSettings: ShopSettings) => void;
  resetSettings: () => void;
  clearAllData: () => void;
  loadDemoData: () => void;

  // Modal dialog states
  isAddEditOpen: boolean;
  editingProduct: Product | null;
  openAddProduct: () => void;
  openEditProduct: (product: Product) => void;
  closeAddEdit: () => void;

  viewingProduct: Product | null;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;

  productToSell: Product | null;
  openSaleCheckout: (product: Product) => void;
  closeSaleCheckout: () => void;

  activeInvoiceSale: Sale | null;
  openInvoice: (sale: Sale) => void;
  closeInvoice: () => void;

  editingSale: Sale | null;
  openEditSale: (sale: Sale) => void;
  closeEditSale: () => void;

  saleForDuePayment: Sale | null;
  openDuePayment: (sale: Sale) => void;
  closeDuePayment: () => void;

  isScannerOpen: boolean;
  scannerTarget: 'search' | 'imei-input';
  openScanner: (target?: 'search' | 'imei-input') => void;
  closeScanner: () => void;
  onScannerBarcodeFound: (code: string) => void;

  isInstallModalOpen: boolean;
  openInstallModal: () => void;
  closeInstallModal: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
  t: typeof BanglaStrings;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'zafrin_electronics_products_v1',
  SALES: 'zafrin_electronics_sales_v1',
  SETTINGS: 'zafrin_electronics_settings_v1'
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial settings
  const [settings, setSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SHOP_SETTINGS;
  });

  // Load products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_PRODUCTS;
  });

  // Load sales
  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_SALES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  // Theme Mode
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(() => {
    try {
      const savedTheme = localStorage.getItem('zafrin_theme_mode');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme as 'light' | 'dark' | 'system';
      }
    } catch (_) {}
    return (settings.themeMode as 'light' | 'dark' | 'system') || 'light';
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemIsDark);

  useEffect(() => {
    try {
      localStorage.setItem('zafrin_theme_mode', themeMode);
    } catch (_) {}
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode, isDark]);

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
    setSettings((prev) => ({ ...prev, themeMode: mode }));
  };

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  // Tab & filters
  const [currentTab, setCurrentTab] = useState<AppTab>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'SOLD'>('ALL');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('ALL');
  const [reportPeriod, setReportPeriod] = useState<'THIS_MONTH' | 'LAST_MONTH' | 'ALL_TIME'>('THIS_MONTH');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productToSell, setProductToSell] = useState<Product | null>(null);
  const [activeInvoiceSale, setActiveInvoiceSale] = useState<Sale | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [saleForDuePayment, setSaleForDuePayment] = useState<Sale | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerTarget, setScannerTarget] = useState<'search' | 'imei-input'>('search');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const openInstallModal = () => setIsInstallModalOpen(true);
  const closeInstallModal = () => setIsInstallModalOpen(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const t = useMemo(() => {
    return settings.appLanguage === 'EN' ? EnglishStrings : BanglaStrings;
  }, [settings.appLanguage]);

  // Modal Open/Close helpers
  const openAddProduct = () => {
    setEditingProduct(null);
    setIsAddEditOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddEditOpen(true);
  };

  const closeAddEdit = () => {
    setEditingProduct(null);
    setIsAddEditOpen(false);
  };

  const openProductDetail = (product: Product) => {
    setViewingProduct(product);
  };

  const closeProductDetail = () => {
    setViewingProduct(null);
  };

  const openSaleCheckout = (product: Product) => {
    setProductToSell(product);
  };

  const closeSaleCheckout = () => {
    setProductToSell(null);
  };

  const openInvoice = (sale: Sale) => {
    setActiveInvoiceSale(sale);
  };

  const closeInvoice = () => {
    setActiveInvoiceSale(null);
  };

  const openEditSale = (sale: Sale) => {
    setEditingSale(sale);
  };

  const closeEditSale = () => {
    setEditingSale(null);
  };

  const openDuePayment = (sale: Sale) => {
    setSaleForDuePayment(sale);
  };

  const closeDuePayment = () => {
    setSaleForDuePayment(null);
  };

  const openScanner = (target: 'search' | 'imei-input' = 'search') => {
    setScannerTarget(target);
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  const onScannerBarcodeFound = (code: string) => {
    if (scannerTarget === 'search') {
      setSearchQuery(code);
      setCurrentTab('STOCK');
      showToast(settings.appLanguage === 'EN' ? `Scanned IMEI: ${code}` : `IMEI স্ক্যান হয়েছে: ${code}`);
    }
    closeScanner();
  };

  // CRUD Operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'status'>) => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      status: 'IN_STOCK',
      createdAt: Date.now()
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(settings.appLanguage === 'EN' ? `${newProduct.model} added to stock!` : `${newProduct.model} স্টকে যুক্ত হয়েছে!`);
    closeAddEdit();
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(settings.appLanguage === 'EN' ? `${updated.model} details updated!` : `${updated.model} এর তথ্য আপডেট হয়েছে!`);
    closeAddEdit();
  };

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(
      settings.appLanguage === 'EN'
        ? `${product?.model || 'Product'} removed from stock`
        : `${product?.model || 'ফোন'} স্টক থেকে মুছে ফেলা হয়েছে`
    );
  };

  const recordSale = (saleData: {
    product: Product;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    salePrice: number;
    paidAmount: number;
    paymentMethod: string;
    warrantyInfo: string;
    remarks: string;
  }): Sale => {
    const { product, customerName, customerPhone, customerAddress, salePrice, paidAmount, paymentMethod, warrantyInfo, remarks } = saleData;
    const dueAmount = Math.max(0, salePrice - paidAmount);
    const invoiceNumber = 'AABD-' + Math.floor(100000 + Math.random() * 900000);

    const newSale: Sale = {
      id: 'sale-' + Date.now(),
      productId: product.id,
      invoiceNumber,
      productDetails: `${product.company} ${product.model} (${product.variant}, ${product.color})`,
      imei: product.imei,
      batteryHealth: product.batteryHealth,
      boxCondition: product.boxCondition,
      customerName,
      customerPhone,
      customerAddress,
      costPrice: product.purchasePrice,
      salePrice,
      paidAmount,
      dueAmount,
      paymentMethod,
      warrantyInfo: warrantyInfo.trim() || `1. ${settings.warrantyReplacement}\n2. ${settings.warrantyService}\n3. ${settings.warrantyExchangeDeduction}`,
      soldAt: Date.now(),
      remarks
    };

    // Mark product as sold
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, status: 'SOLD' as ProductStatus } : p)));
    // Add sale record
    setSales((prev) => [newSale, ...prev]);

    setProductToSell(null);
    setActiveInvoiceSale(newSale);
    showToast(settings.appLanguage === 'EN' ? `Sale completed! Invoice #${invoiceNumber}` : `বিক্রয় সম্পন্ন হয়েছে! মেমো #${invoiceNumber}`);
    return newSale;
  };

  const updateDuePayment = (saleId: string, additionalAmount: number) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id === saleId) {
          const newPaid = s.paidAmount + additionalAmount;
          const newDue = Math.max(0, s.dueAmount - additionalAmount);
          const updated = { ...s, paidAmount: newPaid, dueAmount: newDue };
          if (activeInvoiceSale?.id === saleId) {
            setActiveInvoiceSale(updated);
          }
          return updated;
        }
        return s;
      })
    );
    setSaleForDuePayment(null);
    showToast(
      settings.appLanguage === 'EN'
        ? `Payment of ৳${additionalAmount.toLocaleString()} recorded successfully!`
        : `৳${additionalAmount.toLocaleString()} বকেয়া পরিশোধ রেকর্ড করা হয়েছে!`
    );
  };

  const updateSale = (updatedSale: Sale) => {
    setSales((prev) => prev.map((s) => (s.id === updatedSale.id ? updatedSale : s)));
    if (activeInvoiceSale?.id === updatedSale.id) {
      setActiveInvoiceSale(updatedSale);
    }
    setEditingSale(null);
    showToast(settings.appLanguage === 'EN' ? 'Sale invoice updated!' : 'বিক্রয় মেমো আপডেট করা হয়েছে!');
  };

  const deleteSale = (saleId: string, restoreStock: boolean) => {
    const saleToDelete = sales.find((s) => s.id === saleId);
    if (!saleToDelete) return;

    setSales((prev) => prev.filter((s) => s.id !== saleId));
    if (restoreStock && saleToDelete.productId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === saleToDelete.productId ? { ...p, status: 'IN_STOCK' as ProductStatus } : p))
      );
    }
    setEditingSale(null);
    setActiveInvoiceSale(null);
    showToast(
      restoreStock
        ? (settings.appLanguage === 'EN' ? 'Invoice deleted and phone restored to in-stock!' : 'মেমো মুছে ফোনটি পুনরায় স্টকে ফেরত নেওয়া হয়েছে!')
        : (settings.appLanguage === 'EN' ? 'Invoice deleted permanently' : 'মেমো মুছে ফেলা হয়েছে')
    );
  };

  const updateSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    showToast(newSettings.appLanguage === 'EN' ? 'Settings saved successfully!' : 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SHOP_SETTINGS);
    showToast(settings.appLanguage === 'EN' ? 'Settings reset to defaults' : 'সেটিংস ডিফল্টে রিসেট করা হয়েছে');
  };

  const clearAllData = () => {
    setProducts([]);
    setSales([]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    showToast(settings.appLanguage === 'EN' ? 'All products and sales data cleared!' : 'সব স্টক ও বিক্রয় ডেটা মুছে ফেলা হয়েছে!');
  };

  const loadDemoData = () => {
    setProducts(INITIAL_DEMO_PRODUCTS);
    setSales(INITIAL_DEMO_SALES);
    showToast(settings.appLanguage === 'EN' ? 'Demo phone inventory and sales loaded!' : 'ডেমো স্টক ও বিক্রয় মেমো লোড করা হয়েছে!');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        p.model.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.imei.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'IN_STOCK' && p.status === 'IN_STOCK') ||
        (selectedStatusFilter === 'SOLD' && p.status === 'SOLD');

      const matchesBrand =
        selectedBrandFilter === 'ALL' || p.company.toLowerCase() === selectedBrandFilter.toLowerCase();

      return matchesQuery && matchesStatus && matchesBrand;
    });
  }, [products, searchQuery, selectedStatusFilter, selectedBrandFilter]);

  // Filtered Sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        s.customerName.toLowerCase().includes(q) ||
        s.customerPhone.toLowerCase().includes(q) ||
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.productDetails.toLowerCase().includes(q) ||
        s.imei.toLowerCase().includes(q) ||
        s.remarks.toLowerCase().includes(q)
      );
    });
  }, [sales, searchQuery]);

  // Dashboard Metrics
  const dashboardMetrics: DashboardMetrics = useMemo(() => {
    const inStock = products.filter((p) => p.status === 'IN_STOCK');
    const inStockCount = inStock.length;
    const totalStockValue = inStock.reduce((acc, p) => acc + p.purchasePrice, 0);
    const totalTargetValue = inStock.reduce((acc, p) => acc + p.targetSalePrice, 0);

    const totalSalesCount = sales.length;
    const totalRevenue = sales.reduce((acc, s) => acc + s.salePrice, 0);
    const totalProfit = sales.reduce((acc, s) => acc + (s.salePrice - s.costPrice), 0);
    const totalDue = sales.reduce((acc, s) => acc + s.dueAmount, 0);

    return {
      inStockCount,
      totalStockValue,
      totalTargetValue,
      totalSalesCount,
      totalRevenue,
      totalProfit,
      totalDue
    };
  }, [products, sales]);

  // Report calculations based on selected period
  const reportData: MonthlyReport = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = sales.filter((s) => {
      if (reportPeriod === 'ALL_TIME') return true;
      const saleDate = new Date(s.soldAt);
      if (reportPeriod === 'THIS_MONTH') {
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
      }
      if (reportPeriod === 'LAST_MONTH') {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return saleDate.getMonth() === lastMonthDate.getMonth() && saleDate.getFullYear() === lastMonthDate.getFullYear();
      }
      return true;
    });

    const periodName =
      reportPeriod === 'THIS_MONTH'
        ? (settings.appLanguage === 'EN' ? 'This Month' : 'চলতি মাস')
        : reportPeriod === 'LAST_MONTH'
        ? (settings.appLanguage === 'EN' ? 'Last Month' : 'গত মাস')
        : (settings.appLanguage === 'EN' ? 'All Time' : 'সব সময়');

    const unitsSold = filtered.length;
    const totalRevenue = filtered.reduce((acc, s) => acc + s.salePrice, 0);
    const totalCost = filtered.reduce((acc, s) => acc + s.costPrice, 0);
    const totalProfit = filtered.reduce((acc, s) => acc + (s.salePrice - s.costPrice), 0);
    const totalPaid = filtered.reduce((acc, s) => acc + s.paidAmount, 0);
    const totalDue = filtered.reduce((acc, s) => acc + s.dueAmount, 0);
    const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Top selling models map
    const modelCounts: Record<string, number> = {};
    filtered.forEach((s) => {
      modelCounts[s.productDetails] = (modelCounts[s.productDetails] || 0) + 1;
    });
    const topSellingModels = Object.entries(modelCounts)
      .map(([modelName, count]) => ({ modelName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      periodName,
      unitsSold,
      totalRevenue,
      totalCost,
      totalProfit,
      totalPaid,
      totalDue,
      profitMarginPercent,
      topSellingModels
    };
  }, [sales, reportPeriod, settings.appLanguage]);

  return (
    <InventoryContext.Provider
      value={{
        products,
        sales,
        settings,
        currentTab,
        setCurrentTab,
        searchQuery,
        setSearchQuery,
        selectedStatusFilter,
        setSelectedStatusFilter,
        selectedBrandFilter,
        setSelectedBrandFilter,
        reportPeriod,
        setReportPeriod,

        filteredProducts,
        filteredSales,
        dashboardMetrics,
        reportData,

        themeMode,
        setThemeMode,
        toggleTheme,
        isDark,

        addProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        updateDuePayment,
        updateSale,
        deleteSale,

        updateSettings,
        resetSettings,
        clearAllData,
        loadDemoData,

        isAddEditOpen,
        editingProduct,
        openAddProduct,
        openEditProduct,
        closeAddEdit,

        viewingProduct,
        openProductDetail,
        closeProductDetail,

        productToSell,
        openSaleCheckout,
        closeSaleCheckout,

        activeInvoiceSale,
        openInvoice,
        closeInvoice,

        editingSale,
        openEditSale,
        closeEditSale,

        saleForDuePayment,
        openDuePayment,
        closeDuePayment,

        isScannerOpen,
        scannerTarget,
        openScanner,
        closeScanner,
        onScannerBarcodeFound,

        isInstallModalOpen,
        openInstallModal,
        closeInstallModal,

        toastMessage,
        showToast,
        t
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
