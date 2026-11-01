import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Search,
  QrCode,
  Plus,
  Package,
  Layers,
  LayoutGrid,
  List,
  Info,
  Edit2,
  Trash2,
  Battery,
  Copy
} from 'lucide-react';
import { ProductCard } from './DashboardScreen';
import { formatBdt } from '../utils/constants';

export const StockScreen: React.FC = () => {
  const {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    openAddProduct,
    openScanner,
    openSaleCheckout,
    openEditProduct,
    openProductDetail,
    deleteProduct,
    settings,
    showToast,
    t
  } = useInventory();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const lang = settings.appLanguage;
  const isEnglish = settings.appLanguage === 'EN';

  const inStockCount = products.filter((p) => p.status === 'IN_STOCK').length;
  const inStockValue = products
    .filter((p) => p.status === 'IN_STOCK')
    .reduce((acc, p) => acc + p.purchasePrice, 0);

  const brandOptions = ['ALL', ...settings.companyPresets];

  const copyImei = (e: React.MouseEvent, imei: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(imei);
    if ('vibrate' in navigator) navigator.vibrate(40);
    showToast(isEnglish ? `Copied IMEI: ${imei}` : `IMEI কপি করা হয়েছে: ${imei}`);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header & Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.stockTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isEnglish
              ? 'Click any device card to view its full IMEI, barcode & hardware details'
              : 'যেকোনো ফোনের উপর ক্লিক করে আইএমইআই, বারকোড ও সম্পূর্ণ বিবরণ দেখুন'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isEnglish ? 'Card Grid View' : 'কার্ড ভিউ'}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isEnglish ? 'Compact Table View' : 'টেবিল ভিউ'}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={openAddProduct}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>{t.actionAddStock}</span>
          </button>
        </div>
      </div>

      {/* Search & Scanner Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {isEnglish ? 'Clear' : 'মুছুন'}
            </button>
          )}
        </div>
        <button
          onClick={() => openScanner('search')}
          className="h-11 px-3.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/80 dark:border-blue-800/80 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
          title={t.actionScanBarcode}
        >
          <QrCode className="h-4 w-4" />
          <span className="hidden sm:inline">{t.actionScanBarcode}</span>
        </button>
      </div>

      {/* Filter Chips: Status */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedStatusFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedStatusFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {t.filterAll} ({products.length})
        </button>
        <button
          onClick={() => setSelectedStatusFilter('IN_STOCK')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedStatusFilter === 'IN_STOCK'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {t.filterInStock} ({inStockCount})
        </button>
        <button
          onClick={() => setSelectedStatusFilter('SOLD')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedStatusFilter === 'SOLD'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {t.filterSold} ({products.filter((p) => p.status === 'SOLD').length})
        </button>
      </div>

      {/* Brand Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {brandOptions.map((brand) => {
          const isSelected = selectedBrandFilter === brand;
          return (
            <button
              key={brand}
              onClick={() => setSelectedBrandFilter(brand)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {brand === 'ALL' ? t.allBrandsLabel : brand}
            </button>
          );
        })}
      </div>

      {/* Interactive Helper Banner */}
      <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 rounded-2xl p-3 flex items-center justify-between text-xs text-blue-900 dark:text-blue-300">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span className="font-semibold">
            {isEnglish
              ? '💡 Tap any phone below to open its complete specifications, IMEI, and barcode.'
              : '💡 যেকোনো ফোনের উপর চাপ দিলে আইএমইআই (IMEI), বারকোড ও সম্পূর্ণ বিবরণ ভেসে উঠবে।'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 font-bold text-blue-700 dark:text-blue-300">
          <span>{t.totalUnitsLabel}</span>
          <span>{formatBdt(inStockCount, lang)} {isEnglish ? 'Units' : 'টি'}</span>
        </div>
      </div>

      {/* Products Display (Grid or Table) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">{t.noProducts}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {isEnglish
              ? 'Try adjusting your search terms or filter criteria.'
              : 'অনুসন্ধানের শব্দ বা ফিল্টার অপশন পরিবর্তন করে পুনরায় চেষ্টা করুন।'}
          </p>
          <button
            onClick={openAddProduct}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{t.actionAddStock}</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
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
      ) : (
        /* Compact Inventory Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">{isEnglish ? 'Device Model' : 'মডেল ও ব্র্যান্ড'}</th>
                  <th className="py-3 px-4">{isEnglish ? 'IMEI' : 'আইএমইআই'}</th>
                  <th className="py-3 px-3">{isEnglish ? 'Battery & Box' : 'ব্যাটারি ও বক্স'}</th>
                  <th className="py-3 px-4 text-right">{isEnglish ? 'Cost' : 'ক্রয়'}</th>
                  <th className="py-3 px-4 text-right">{isEnglish ? 'Target Price' : 'টার্গেট বিক্রয়'}</th>
                  <th className="py-3 px-3 text-center">{isEnglish ? 'Status' : 'স্ট্যাটাস'}</th>
                  <th className="py-3 px-4 text-right">{isEnglish ? 'Actions' : 'অ্যাকশন'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((product) => {
                  return (
                    <tr
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {product.model}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {product.company} • {product.variant} • {product.color}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono-code font-bold text-slate-800 dark:text-slate-200">
                          <span>{product.imei}</span>
                          <button
                            onClick={(e) => copyImei(e, product.imei)}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                            title="Copy IMEI"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                          <Battery className="h-3 w-3" />
                          <span>{product.batteryHealth}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                          {product.boxCondition}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-medium text-slate-600 dark:text-slate-400">
                        ৳{formatBdt(product.purchasePrice, lang)}
                      </td>

                      <td className="py-3 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400">
                        ৳{formatBdt(product.targetSalePrice, lang)}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            product.status === 'IN_STOCK'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {product.status === 'IN_STOCK' ? t.statusInStock : t.statusSold}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {product.status === 'IN_STOCK' && (
                            <button
                              onClick={() => openSaleCheckout(product)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                            >
                              {t.btnSell}
                            </button>
                          )}
                          <button
                            onClick={() => openEditProduct(product)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg"
                            title={t.btnEdit}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(t.confirmDeleteProduct)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 rounded-lg"
                            title={t.btnDelete}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
