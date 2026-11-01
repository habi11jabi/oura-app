import React from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Package,
  TrendingUp,
  Receipt,
  AlertCircle,
  Plus,
  QrCode,
  Search,
  Battery,
  Box,
  Truck,
  ArrowRight,
  ShoppingCart,
  Edit2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { formatBdt } from '../utils/constants';
import { Product } from '../types';

export const DashboardScreen: React.FC = () => {
  const {
    dashboardMetrics,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    openAddProduct,
    openScanner,
    openSaleCheckout,
    openEditProduct,
    deleteProduct,
    setCurrentTab,
    settings,
    t
  } = useInventory();

  const isEnglish = settings.appLanguage === 'EN';
  const lang = settings.appLanguage;

  const inStockProducts = filteredProducts.filter((p) => p.status === 'IN_STOCK').slice(0, 8);

  const profitMargin =
    dashboardMetrics.totalRevenue > 0
      ? ((dashboardMetrics.totalProfit / dashboardMetrics.totalRevenue) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* 4 Overview KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. In Stock Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-400/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.metricInStock}
            </span>
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatBdt(dashboardMetrics.inStockCount, lang)}{' '}
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {isEnglish ? 'Units' : 'টি'}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t.purchaseCostLabel} ৳{formatBdt(dashboardMetrics.totalStockValue, lang)}
            </p>
          </div>
        </div>

        {/* 2. Total Sold & Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-400/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.metricRevenue}
            </span>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              ৳{formatBdt(dashboardMetrics.totalRevenue, lang)}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {dashboardMetrics.totalSalesCount} {isEnglish ? 'devices sold' : 'টি ফোন বিক্রয় হয়েছে'}
            </p>
          </div>
        </div>

        {/* 3. Net Profit Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-400/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.metricProfit}
            </span>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              +৳{formatBdt(dashboardMetrics.totalProfit, lang)}
            </div>
            <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80 font-semibold">
              {isEnglish ? 'Margin:' : 'মার্জিন:'} {profitMargin}%
            </p>
          </div>
        </div>

        {/* 4. Total Outstanding Due */}
        <div
          className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-xs hover:shadow-md transition-all relative overflow-hidden group ${
            dashboardMetrics.totalDue > 0
              ? 'border-amber-300/80 dark:border-amber-700/80 ring-1 ring-amber-400/20'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 dark:bg-amber-400/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.metricDue}
            </span>
            <div
              className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold ${
                dashboardMetrics.totalDue > 0
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-3xl font-extrabold tracking-tight ${
                dashboardMetrics.totalDue > 0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              ৳{formatBdt(dashboardMetrics.totalDue, lang)}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {dashboardMetrics.totalDue > 0
                ? isEnglish
                  ? 'Pending customer due collection'
                  : 'কাস্টমারদের বকেয়া বাকি আছে'
                : isEnglish
                ? 'All sales paid in full'
                : 'সব মেমো সম্পূর্ণ পরিশোধিত'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 rounded-2xl p-5 text-white shadow-md shadow-blue-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-12 w-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs flex-shrink-0">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">
              {isEnglish ? 'Zafrin Electronics Digital Inventory' : 'জাফরিন ইলেকট্রনিক্স ডিজিটাল ইনভেন্টরি'}
            </h3>
            <p className="text-xs text-white/80">
              {isEnglish
                ? 'Barcode / IMEI scanner, digital cash memo, profit & due management'
                : 'বারকোড ও আইএমইআই স্ক্যানার, ডিজিটাল ক্যাশ মেমো, লাভ ও বকেয়া হিসাব'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={openAddProduct}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{t.actionAddStock}</span>
          </button>
          <button
            onClick={() => openScanner('search')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-xs transition-transform active:scale-95"
          >
            <QrCode className="h-4 w-4" />
            <span>{t.actionScanBarcode}</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {isEnglish ? 'Clear' : 'মুছুন'}
          </button>
        )}
      </div>

      {/* Recently Added In-Stock Devices Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {t.recentStockHeader}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {inStockProducts.length}
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('STOCK')}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {inStockProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">{t.noProducts}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {isEnglish
                ? 'No matching phones found. Add your first phone or clear your search query.'
                : 'কোনো ফোন পাওয়া যায়নি। নতুন ফোন যোগ করুন অথবা সার্চ কোয়েরি পরিবর্তন করুন।'}
            </p>
            <button
              onClick={openAddProduct}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>{t.actionAddStock}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inStockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSell={() => openSaleCheckout(product)}
                onEdit={() => openEditProduct(product)}
                onDelete={() => {
                  if (window.confirm(t.confirmDeleteProduct)) {
                    deleteProduct(product.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductCard: React.FC<{
  product: Product;
  onSell?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ product, onSell, onEdit, onDelete }) => {
  const { settings, openProductDetail, showToast, t } = useInventory();
  const lang = settings.appLanguage;
  const isEnglish = settings.appLanguage === 'EN';

  const profit = product.targetSalePrice - product.purchasePrice;
  const margin = product.targetSalePrice > 0 ? ((profit / product.targetSalePrice) * 100).toFixed(0) : '0';

  const copyImei = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(product.imei);
    if ('vibrate' in navigator) navigator.vibrate(40);
    showToast(isEnglish ? `Copied IMEI: ${product.imei}` : `IMEI কপি করা হয়েছে: ${product.imei}`);
  };

  return (
    <div
      onClick={() => openProductDetail(product)}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.995] relative overflow-hidden"
    >
      <div>
        {/* Brand & Model Title with Quick View Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-extrabold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                {product.company}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-semibold text-slate-500 dark:text-slate-400">{product.variant}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">{product.color}</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              <span>{product.model}</span>
            </h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide ${
                product.status === 'IN_STOCK'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {product.status === 'IN_STOCK' ? t.statusInStock : t.statusSold}
            </span>
            <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              <span>{isEnglish ? 'View details' : 'সম্পূর্ণ বিবরণ'}</span>
              <span>→</span>
            </span>
          </div>
        </div>

        {/* Feature Badges (Battery, Box, Supplier) */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
            <Battery className="h-3.5 w-3.5" />
            <span>{product.batteryHealth}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
            <Box className="h-3.5 w-3.5" />
            <span className="truncate max-w-[130px]">{product.boxCondition}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
            <Truck className="h-3.5 w-3.5" />
            <span className="truncate max-w-[100px]">{product.supplier}</span>
          </span>
        </div>

        {/* IMEI Code with copy button */}
        <div className="mt-3 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 group-hover:bg-blue-50/40 dark:group-hover:bg-blue-950/30 group-hover:border-blue-100 dark:group-hover:border-blue-900 transition-colors">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 dark:text-slate-400">{t.imeiLabel}</span>
            <span className="font-mono-code font-bold tracking-wider text-slate-900 dark:text-slate-200">
              {product.imei}
            </span>
          </div>
          <button
            onClick={copyImei}
            className="p-1 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={isEnglish ? 'Copy IMEI' : 'IMEI কপি করুন'}
          >
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
              {isEnglish ? 'Copy' : 'কপি'}
            </span>
          </button>
        </div>

        {/* Pricing & Profit Strip */}
        <div className="mt-3 grid grid-cols-3 gap-2 p-2.5 bg-blue-50/50 dark:bg-slate-800/60 rounded-xl border border-blue-100/70 dark:border-slate-700/60 text-center">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{t.purchaseCostLabel}</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ৳{formatBdt(product.purchasePrice, lang)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{t.targetPriceLabel}</div>
            <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
              ৳{formatBdt(product.targetSalePrice, lang)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.potentialProfitLabel}</div>
            <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              +৳{formatBdt(profit, lang)} ({margin}%)
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        {product.status === 'IN_STOCK' && onSell && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSell();
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{t.btnSell}</span>
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="inline-flex items-center justify-center gap-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
            title={t.btnEdit}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.btnEdit}</span>
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex items-center justify-center p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 rounded-xl transition-all"
            title={t.btnDelete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};
